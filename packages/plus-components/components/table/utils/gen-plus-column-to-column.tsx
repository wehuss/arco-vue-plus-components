import {
  TableColumnData,
  TableData,
  TableInstance,
} from '@arco-design/web-vue/es/table'
import { PlusColumn, UseFetchDataAction } from '../interface'
import { genColumnKey } from '.'
import { columnRender } from './column-render'

type ColumnToColumnParams = {
  columns: PlusColumn[]
  columnEmptyText: string
  action: UseFetchDataAction
} & Pick<TableInstance['$props'], 'rowKey'>

export const omitUndefinedAndEmptyArr = <T extends Record<string, any>>(
  obj: T
): T => {
  const newObj = {} as Record<string, any> as Record<string, any>
  Object.keys(obj || {}).forEach((key) => {
    if (Array.isArray(obj[key]) && obj[key]?.length === 0) {
      return
    }
    if (obj[key] === undefined) {
      return
    }
    newObj[key] = obj[key]
  })
  return newObj as T
}

/**
 * 转化 columns 到 pro 的格式 主要是 render 方法的自行实现
 *
 * @param columns
 * @param map
 * @param columnEmptyText
 */
export function genPlusColumnToColumn(
  params: ColumnToColumnParams,
  parents?: PlusColumn
): TableColumnData[] {
  const {
    columns,
    columnEmptyText,
    action,
    // type,
    // editableUtils,
    // marginSM,
    rowKey = 'id',
    // childrenColumnName = 'children',
  } = params

  return columns
    ?.map((columnProps, columnsIndex) => {
      const {
        key,
        dataIndex,
        valueEnum,
        valueType = 'text',
        children,
        // onFilter,
        // filters = [],
      } = columnProps as PlusColumn
      const columnKey = genColumnKey(
        key || dataIndex?.toString(),
        [parents?.key, columnsIndex].filter(Boolean).join('-')
      )
      // 这些都没有，说明是普通的表格不需要 pro 管理
      const noNeedPro = !valueEnum && !valueType && !children
      if (noNeedPro) {
        return {
          index: columnsIndex,
          ...columnProps,
        }
      }
      // const config = action.columnsMap[columnKey] || {
      //   fixed: columnProps.fixed,
      // }

      const tempColumns = {
        index: columnsIndex,
        key: columnKey,
        ...columnProps,
        title:
          typeof columnProps.title === 'function'
            ? columnProps.title()
            : columnProps.title,
        valueEnum,
        // filters:
        //   filters === true
        //     ? proFieldParsingValueEnumToArray(
        //         runFunction<[undefined]>(valueEnum, undefined)
        //       ).filter((valueItem) => valueItem && valueItem.value !== 'all')
        //     : filters,
        // onFilter: genOnFilter(),
        // fixed: config.fixed,
        width: columnProps.width || (columnProps.fixed ? 200 : undefined),
        children: (columnProps as PlusColumn).children
          ? genPlusColumnToColumn(
              {
                ...params,
                columns: (columnProps as PlusColumn)?.children || [],
              },
              { ...columnProps, key: columnKey } as PlusColumn
            )
          : undefined,
        render: (data: {
          record: TableData
          column: TableColumnData
          rowIndex: number
        }) => {
          return columnRender({
            ...data,
            columnEmptyText,
            action,
            column: columnProps,
          })
        },
      }
      return omitUndefinedAndEmptyArr(tempColumns)
    })
    ?.filter((item) => !item.hideInTable) as unknown as TableColumnData[]
}
