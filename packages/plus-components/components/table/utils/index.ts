import { UnwrapRef } from 'vue'
import { cloneDeep, merge } from 'lodash'
import { setValueByPath } from '@arco-design/web-vue/es/_utils/get-value-by-path'
import {
  PaginationPropsWithEvent,
  PlusColumn,
  UseFetchDataAction,
} from '../interface'
import { PlusFormItem } from '../../form'

export function mergePagination<T>(
  pagination: PaginationPropsWithEvent | boolean | undefined,
  pageInfo: UnwrapRef<UseFetchDataAction<T>['pageInfo']> & {
    setPageInfo: any
  }
): PaginationPropsWithEvent | false | undefined {
  if (pagination === false) {
    return false
  }
  const { total, current, pageSize, setPageInfo } = pageInfo
  const defaultPagination: PaginationPropsWithEvent =
    typeof pagination === 'object' ? pagination : {}

  return {
    showTotal: true,
    total,
    ...(defaultPagination as PaginationPropsWithEvent),
    current:
      pagination !== true && pagination
        ? pagination.current ?? current
        : current,
    pageSize:
      pagination !== true && pagination
        ? pagination.pageSize ?? pageSize
        : pageSize,
    onChange: (page: number) => {
      const { onChange } = pagination as PaginationPropsWithEvent
      onChange?.(page)
      // pageSize 改变之后就没必要切换页码
      if (current !== page) {
        setPageInfo({ current: page })
      }
    },
    onPageSizeChange: (newPageSize: number) => {
      const { onPageSizeChange } = pagination as PaginationPropsWithEvent
      onPageSizeChange?.(newPageSize)
      setPageInfo({ pageSize: newPageSize })
    },
  }
}

/**
 * 根据 key 和 dataIndex 生成唯一 id
 *
 * @param key 用户设置的 key
 * @param dataIndex 在对象中的数据
 * @param index 序列号，理论上唯一
 */
export const genColumnKey = (
  key?: string | number,
  index?: number | string
): string => {
  if (key) {
    return Array.isArray(key) ? key.join('-') : key.toString()
  }
  return `${index}`
}

export const getFormItemPropsFromColumns = (
  columns: PlusColumn[],
  formKey: 'searchForm' | 'updateForm' | 'createForm'
) => {
  const defaultFormData: Record<string, any> = {}

  // @ts-expect-error
  const formItems: PlusFormItem[] =
    columns
      .map((item) => {
        const valueType =
          !item.valueType ||
          ['textarea', 'jsonCode', 'code'].includes(item?.valueType)
            ? 'text'
            : (item?.valueType as 'text')
        const { valueEnum } = item
        let { form } = item
        if (!form) return null
        if (form === true)
          return {
            label: item.title,
            field: item.dataIndex as string,
            valueType,
            valueEnum,
          }

        // 准备合并的form
        const mergeProps = form[formKey]
        if (form[formKey] === false) return null
        if (mergeProps && mergeProps !== true) {
          form = merge(cloneDeep(form), mergeProps)
          // 避免将render设置为undefined时不覆盖默认render
          if ('render' in mergeProps) {
            form.render = mergeProps.render
          }
        }

        if (form?.defaultValue) {
          setValueByPath(
            defaultFormData,
            item.dataIndex as string,
            cloneDeep(form.defaultValue)
          )
        }
        const formItemProps = {
          valueType,
          valueEnum,
          ...form,
          label: form?.label ?? item.title,
          field: form?.field ?? (item.dataIndex as string),
        }
        return formItemProps
      })
      .filter((item) => item)
      .sort((a, b) => (b?.order ?? 0) - (a?.order ?? 0)) || []

  return {
    formItems,
    defaultFormData,
  }
}

// export extractFormItemPropsByColumns
