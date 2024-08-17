/* eslint-disable consistent-return */
import { nextTick, ref, toRefs, watch } from 'vue'
import { debounce } from 'lodash'
import { useMergedState } from '../use-merged-state'
import {
  PageInfo,
  PaginationPropsWithEvent,
  QueryData,
  UseFetchDataAction,
  UseFetchProps,
} from '../../interface'

/**
 * 组合用户的配置和默认值
 *
 * @param param0
 */
const mergeOptionAndPageInfo = ({ pageInfo }: UseFetchProps) => {
  if (pageInfo && typeof pageInfo === 'object') {
    const { current, defaultCurrent, pageSize, defaultPageSize } = pageInfo
    return {
      current: current || defaultCurrent || 1,
      total: 0,
      pageSize: pageSize || defaultPageSize || 20,
    }
  }
  return { current: 1, total: 0, pageSize: 20 }
}

export const useFetchData = <DataSource extends QueryData<any>>(
  getData:
    | undefined
    | ((params?: { pageSize: number; current: number }) => Promise<DataSource>),
  defaultData: any[] | undefined,
  options: UseFetchProps
): UseFetchDataAction => {
  const {
    onLoad,
    manual,
    polling,
    onRequestError,
    debounceTime = ref(30),
    effects = ref([]),
    loading: _loading,
    dataSource,
  } = toRefs(options || {})
  const manualRequestRef = manual
  /**
   * 表格的加载状态
   */
  const [tableLoading, setTableLoading] = useMergedState<boolean>(false, {
    value: _loading,
    onChange: options?.onLoadingChange,
  })
  /**
   * 用于存储最新的数据，这样可以在切换的时候保持数据的一致性
   */
  const [tableDataList, setTableDataList] = useMergedState<DataSource[]>(
    defaultData ?? [],
    {
      value: dataSource,
      onChange: options?.onDataSourceChange,
    }
  )

  const [pageInfo, setPageInfoState] = useMergedState<PageInfo>(
    () => mergeOptionAndPageInfo(options),
    {
      onChange: options?.onPageInfoChange,
    }
  )

  const setPageInfo = (changePageInfo: Partial<PageInfo>) => {
    if (
      changePageInfo.current !== pageInfo.value.current ||
      changePageInfo.pageSize !== pageInfo.value.pageSize ||
      changePageInfo.total !== pageInfo.value.total
    ) {
      setPageInfoState({
        ...pageInfo.value,
        ...changePageInfo,
      })
    }
  }

  const setDataAndLoading = (newData: DataSource[], dataTotal: number) => {
    setTableDataList(newData)
    if (pageInfo.value?.total !== dataTotal) {
      setPageInfo({
        ...pageInfo.value,
        total: dataTotal || newData.length,
      })
    }
  }

  /** 请求数据 */
  const fetchList = async () => {
    // 需要手动触发的首次请求
    // if (manualRequestRef.value.current) {
    //   manualRequestRef.value.current = false
    //   return
    // }
    // if (!isPolling) {
    //   setTableLoading(true)
    // } else {
    //   setPollingLoading(true)
    // }

    setTableLoading(true)
    const { pageSize, current } = pageInfo.value || {}
    try {
      const pageParams =
        options?.pageInfo !== false
          ? {
              current,
              pageSize,
            }
          : undefined
      const {
        data = [],
        success,
        total = 0,
        ...rest
      } = (await getData?.(pageParams)) || ({} as DataSource)
      // 如果失败了，直接返回，不走剩下的逻辑了
      if (success === false) return []

      const responseData = data
      // 设置表格数据
      setDataAndLoading(responseData, total)
      onLoad?.value?.(responseData, rest)
      return responseData
    } catch (e) {
      // 如果没有传递这个方法的话，需要把错误抛出去，以免吞掉错误
      if (onRequestError?.value === undefined) throw new Error(e as string)
      if (tableDataList === undefined) setTableDataList([])
      onRequestError.value(e as Error)
    } finally {
      // console.log('table loading?', tableLoading.value)
      setTableLoading(false)
    }

    return []
  }
  const fetchListWithDebounce = debounce(fetchList, debounceTime.value)

  watch(
    () => pageInfo.value.current,
    () => {
      fetchListWithDebounce()
    }
  )
  watch(
    () => pageInfo.value.pageSize,
    () => {
      if (pageInfo.value.current !== 1) setPageInfo({ current: 1 })
      else fetchListWithDebounce()
    }
  )

  watch(
    () => effects.value,
    () => {
      fetchListWithDebounce()
    },
    {
      deep: true,
    }
  )

  return {
    reload: fetchListWithDebounce as () => Promise<any>,
    dataSource: tableDataList,
    loading: tableLoading,
    pageInfo,
    setPageInfo,
    setDataSource: setTableDataList,
    reset: () => {
      const { pageInfo: optionPageInfo } = options || {}
      const { defaultCurrent = 1, defaultPageSize = 30 } =
        (optionPageInfo as PaginationPropsWithEvent) || {}
      const initialPageInfo = {
        current: defaultCurrent,
        total: 0,
        pageSize: defaultPageSize,
      }
      setPageInfo(initialPageInfo)
      fetchListWithDebounce()
    },
  }
}
