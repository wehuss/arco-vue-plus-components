import {
  PropType,
  defineComponent,
  toRefs,
  computed,
  reactive,
  provide,
  ref,
  onMounted,
  unref,
  inject,
  watch,
  Fragment,
  onRenderTracked,
  VNode,
  onRenderTriggered,
} from 'vue'
import {
  Card,
  CardInstance,
  ConfigProvider,
  Size,
  Table,
  TableChangeExtra,
  TableColumnData,
  TableData,
} from '@arco-design/web-vue'
import { useSize } from '@arco-design/web-vue/es/_hooks/use-size'
import { getPrefixCls } from '@arco-design/web-vue/es/_utils/global-config'
import { omit, pick } from 'lodash'
import { Filters, Sorter } from '@arco-design/web-vue/es/table/interface'
import { configProviderInjectionKey } from '@arco-design/web-vue/es/config-provider/context'
import useListeners from '../_hooks/listeners'
import { useMergedState } from './hooks/use-merged-state'
import {
  ColumnsStateType,
  PageInfo,
  PaginationPropsWithEvent,
  PlusColumn,
  QueryData,
  QueryParams,
  ToolbarProps,
} from './interface'
import commonProps from './common-props'
import './table.less'
import Toolbar from './components/toolbar'
import QuerySearch from './components/query-search'
import { tableInjectionKey } from './context'
import { useFetchData } from './hooks/use-fetch-data'
import { genColumnKey, mergePagination } from './utils'
import { genPlusColumnToColumn } from './utils/gen-plus-column-to-column'
import LightSearch from './components/light-search'
import commonEmits from './common-emits'
import Tbody from './components/tbody'
import useColumnsState from './hooks/use-columns-state'
import { columnSort } from './utils/columnSort'
import Tr from './components/tr/index.vue'
import Td from './components/td/index.vue'

export default defineComponent({
  name: 'PlusTable',
  props: {
    ...commonProps,
    query: {
      type: Function as PropType<
        (
          params: QueryParams,
          sorter: Sorter,
          filters: Filters
        ) => Promise<Partial<QueryData>>
      >,
    },
    columns: {
      type: Array as PropType<PlusColumn<any>[]>,
      default: () => [],
    },
    columnEmptyText: {
      type: String,
      default: '-',
    },
    apis: {
      type: Object as PropType<{
        get: () => void
        add: () => void
        update: () => void
        remove: () => void
      }>,
    },
    autoFill: {
      type: Boolean,
    },
    bordered: {
      type: Boolean,
      default: true,
    },
    search: {
      type: Boolean,
      default: true,
    },
    lightSearch: {
      type: Boolean,
      default: false,
    },
    tableSize: {
      type: String as PropType<Size>,
      default: () =>
        inject(configProviderInjectionKey, undefined)?.size ?? 'medium',
    },
    dataSource: {
      type: Array as PropType<TableData[]>,
    },
    toolbar: {
      type: [Boolean, Object] as PropType<false | ToolbarProps>,
      default: true,
    },
    cardProps: {
      type: Object as PropType<Omit<CardInstance['$props'], 'title'>>,
    },
    params: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    tableContentRender: {
      type: Function as PropType<
        (data: TableData[], columns: PlusColumn[]) => VNode
      >,
    },
    columnsState: {
      type: Object as PropType<ColumnsStateType>,
      default: () => ({}),
    },
  },
  emits: {
    ...commonEmits,
  },
  setup(props, { slots, emit, expose }) {
    const prefixCls = getPrefixCls('plus-table')
    const { listeners } = useListeners()
    const {
      // columns,
      columnEmptyText,
      autoFill,
      size,
      bordered,
      pagination: propsPagination,
      dataSource: rawDataSource,
      toolbar,
      params,
    } = toRefs(props)

    const { mergedSize } = useSize(size)

    const _tableSize = ref<Size>()
    const setTableSize = (tableSize: Size) => {
      _tableSize.value = tableSize
    }
    const tableSize = computed(() => _tableSize.value ?? mergedSize.value)
    watch(() => props.tableSize, setTableSize, { immediate: true })

    /**
     * 平铺所有column
     */
    const columnsFlatMap = computed(() => {
      const _columnMap: Record<string, PlusColumn> = {}

      const loopFilter = (data: any[]) => {
        for (let i = 0; i < data.length; i += 1) {
          const _column = data[i]
          if (_column.children) {
            loopFilter(_column.children)
          } else {
            _columnMap[_column.dataIndex] = _column
          }
        }
      }
      loopFilter(props.columns || [])

      return _columnMap
    })

    const mergedScroll = computed(() => ({
      ...(props.scroll || {}),
      ...(autoFill.value
        ? {
            y: '100%',
          }
        : {}),
    }))

    const [filters, setFilters] = useMergedState<Filters>({})
    const [sorter, setSorter] = useMergedState<Sorter | Record<string, any>>({})

    const omitLocalFilter = (_filters: Filters) => {
      Object.entries(_filters).forEach(([key]) => {
        // 配置了filter就是本地过滤,不传递给服务器
        if (columnsFlatMap.value[key]?.filterable?.filter) delete _filters[key]
      })

      return _filters
    }

    const handleTableChange: (
      data: TableData[],
      extra: TableChangeExtra,
      currentData: TableData[]
    ) => void = (_data, extra) => {
      // emit('change', _data, extra, _data)
      /**
       * sorter设置为true时为服务器端排序
       */
      if (
        extra.sorter &&
        columnsFlatMap.value[extra.sorter.field]?.sortable?.sorter === true
      )
        setSorter(extra.sorter)
      if (extra.filters) setFilters(omitLocalFilter(extra.filters))
    }

    const formSearch = ref<Record<string, any>>({})

    const fetchData = computed(() => {
      if (!props.query) return undefined
      return async (pageParams?: { pageSize: number; current: number }) => {
        const _params = {
          ...pageParams,
          ...params.value,
          ...formSearch.value,
        }

        const response = await props.query?.(
          _params as QueryParams,
          sorter.value as Sorter,
          filters.value
        )
        return response as QueryData
      }
    })

    const action = useFetchData(
      fetchData.value,
      [],
      reactive({
        dataSource: rawDataSource,
        pageInfo: propsPagination,
        effects: [formSearch, params],
      }) as any
    )
    watch(
      params,
      () => {
        if (
          props.query &&
          action.dataSource.value &&
          action.pageInfo.value.current === 1
        ) {
          action.setPageInfo({
            current: 1,
          })
        }
      },
      {
        deep: true,
      }
    )

    const dataSource = computed(() =>
      props.query
        ? action.dataSource.value
        : (props.data.length && props.data) ||
          (rawDataSource.value?.length && rawDataSource.value) ||
          []
    )
    const pagination = computed(() => {
      const newPropsPagination =
        unref(propsPagination) === false
          ? false
          : { ...(propsPagination.value as PaginationPropsWithEvent) }

      const pageConfig = {
        ...action.pageInfo.value,
        setPageInfo: ({ pageSize, current }: PageInfo) => {
          const pageInfo = action.pageInfo.value
          const newPageInfo = {
            pageSize: pageSize ?? pageInfo.pageSize,
            current: current ?? pageInfo.current,
          }
          // pageSize 发生改变，并且你不是在第一页，切回到第一页
          // 这样可以防止出现 跳转到一个空的数据页的问题
          if (pageSize === pageInfo.pageSize || pageInfo.current === 1) {
            action.setPageInfo(newPageInfo)
            return
          }

          action.setPageInfo(newPageInfo)
        },
      }
      if (props.query && newPropsPagination) {
        delete newPropsPagination.onChange
        delete newPropsPagination.onPageSizeChange
      }

      return mergePagination<any[]>(newPropsPagination, pageConfig)
    })

    const onSubmit = (values: Record<string, any>) => {
      formSearch.value = { ...values }
    }

    const onReset = () => {
      formSearch.value = {}
    }

    const { columnsMap, setColumnsMap } = useColumnsState(
      reactive(props.columnsState),
      reactive(props.columns)
    )

    const tableColumns = computed(() => {
      return genPlusColumnToColumn({
        columns: props.columns,
        columnEmptyText: props.columnEmptyText,
        rowKey: props.rowKey,
        action,
        columnsMap: columnsMap.value,
      }).sort(columnSort(columnsMap.value))
    })

    const columns = computed(() => {
      const loopFilter = (column: any[]): any[] => {
        return column
          .map((item) => {
            // 删掉不应该显示的
            const columnKey = item.key ?? item.dataIndex
            const config = columnsMap.value[columnKey]
            if (config && config.show === false) {
              return false
            }
            if (item.children) {
              return {
                ...item,
                children: loopFilter(item.children),
              }
            }
            return item
          })
          .filter(Boolean)
      }
      return loopFilter(tableColumns.value)
    })
    const computedColumns = computed(() => {
      return columns.value?.map(
        (column) => omit(column, ['form', 'hideInTable']) as TableColumnData
      )
    })

    const sortKeyColumns = ref<string[]>([])
    const setSortKeyColumns = (keys: string[]) => {
      sortKeyColumns.value = keys
    }
    watch(
      tableColumns,
      () => {
        if (tableColumns.value.length > 0) {
          const columnKeys = tableColumns.value.map((item) =>
            genColumnKey(item.dataIndex, item.index)
          )
          setSortKeyColumns(columnKeys)
        }
      },
      {
        immediate: true,
      }
    )

    const tableContext = reactive({
      // 实际显示的columns
      columns,
      // 所有的columns
      tableColumns,
      slots,
      columnEmptyText,
      size: mergedSize,
      tableSize,
      setTableSize,
      bordered,
      action,
      pagination,
      columnsFlatMap,
      columnsMap,
      setColumnsMap,
      dataSource,
      sortKeyColumns,
      setSortKeyColumns,
    })

    // @ts-expect-error
    provide(tableInjectionKey, tableContext)
    expose({
      action,
    })

    onMounted(() => {
      action.reload()
    })

    const tableSlots = {
      ...slots,
      tbody: props.tableContentRender
        ? () => (
            <Tbody
              render={() =>
                props.tableContentRender?.(
                  dataSource.value,
                  columns.value as PlusColumn[]
                )
              }
            />
          )
        : slots.tobdy,
      tr: ({ record, rowIndex }: any) => (
        <Tr
          record={record}
          rowIndex={rowIndex}
          columns={computedColumns.value}
        />
      ),
      td: ({ record, column, rowIndex }: any) => (
        <Td record={record} rowIndex={rowIndex} column={column} />
      ),
    }

    const tableProps = computed(() => {
      return pick(props, Object.keys(commonProps))
    })

    return () => (
      <div
        class={[
          `${prefixCls}-${mergedSize.value}`,
          `${prefixCls}-container`,
          {
            [`${prefixCls}-fill`]: autoFill.value,
            // 是否拥有tbody渲染
            [`${prefixCls}-has-tbody-render`]: !!props.tableContentRender,
          },
        ]}
      >
        <ConfigProvider size={mergedSize.value}>
          {props.search && !props.lightSearch && (
            <QuerySearch onSubmit={onSubmit} onReset={onReset} />
          )}
          <Card
            class={[`${prefixCls}-body`]}
            bordered={props.bordered}
            {...props.cardProps}
          >
            {toolbar.value && (
              <Toolbar
                {...toolbar.value}
                leftPanelStart={
                  props.lightSearch
                    ? () => (
                        <Fragment>
                          {(toolbar.value as any)?.leftPanelStart?.()}
                          <LightSearch onSubmit={onSubmit} onReset={onReset} />
                        </Fragment>
                      )
                    : toolbar.value?.leftPanelStart
                }
              />
            )}
            <div class={[`${prefixCls}-element`]}>
              <Table
                {...tableProps.value}
                {...listeners.value}
                size={tableSize.value}
                columns={computedColumns.value}
                scroll={mergedScroll.value}
                onChange={handleTableChange}
                data={dataSource.value}
                loading={action.loading.value}
                pagination={pagination.value}
                v-slots={tableSlots}
              />
            </div>
          </Card>
        </ConfigProvider>
      </div>
    )
  },
})
