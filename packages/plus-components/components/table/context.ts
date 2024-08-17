import { InjectionKey, Slots } from 'vue'
import { Size } from '@arco-design/web-vue'
import {
  PaginationPropsWithEvent,
  PlusColumn,
  UseFetchDataAction,
} from './interface'

export interface TableContext {
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
  columnsFlatMap: PlusColumn[]
}

export const tableInjectionKey: InjectionKey<TableContext> = Symbol('PlusTable')
