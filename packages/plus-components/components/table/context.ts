import { InjectionKey, Slots } from 'vue'
import { Size } from '@arco-design/web-vue'
import {
  ColumnsState,
  PaginationPropsWithEvent,
  PlusColumn,
  UseFetchDataAction,
} from './interface'

export interface TableContext {
  tableColumns: PlusColumn[]
  columns: PlusColumn[]
  columnEmptyText: string
  slots: Slots
  // Plus table整体的size
  size: Size
  // table部分的size
  tableSize: Size
  bordered: boolean
  setTableSize: (tableSize: Size) => void
  action: UseFetchDataAction
  pagination: PaginationPropsWithEvent | false
  /**
   * 平铺的columns
   */
  columnsFlatMap: Record<string, PlusColumn>
  columnsMap: Record<string, ColumnsState>
  setColumnsMap: (columnsMap: Record<string, ColumnsState>) => void
  sortKeyColumns: string[]
  setSortKeyColumns: (sortKeyColumns: string[]) => void
}

export const tableInjectionKey: InjectionKey<TableContext> = Symbol('PlusTable')
