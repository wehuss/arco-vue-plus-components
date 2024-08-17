import {
  TableColumnData,
  TableFilterable,
  TableSortable,
  PaginationProps,
  TableData,
} from '@arco-design/web-vue'
import { VNode, Ref, VNodeChild } from 'vue'
import { OptionConfig } from './components/toolbar'
import { PlusFormItem } from '../form/inferface'
import { FieldValueEnumType, FieldValueType } from '../field'

export type PaginationPropsWithEvent = {
  'onChange'?: ((current: number) => any) | undefined
  'onUpdate:current'?: ((current: number) => any) | undefined
  'onPageSizeChange'?: ((pageSize: number) => any) | undefined
  'onUpdate:pageSize'?: ((pageSize: number) => any) | undefined
} & PaginationProps

export type ColumnRenderInterface<T = TableData> = {
  column: PlusColumn
  record: T
  rowIndex: number
  columnEmptyText?: string | false
  action: UseFetchDataAction
  dom?: VNodeChild
}

export type PlusColumnForm = PlusFormItem & {
  searchForm?: PlusColumnForm
  addForm?: PlusColumnForm
  updateForm?: PlusColumnForm
}

export type PlusColumn<T = TableData> = Omit<
  TableColumnData,
  'filterable' | 'dataIndex' | 'render' | 'children'
> & {
  hideInTable?: boolean
  form?: PlusColumnForm | true
  children?: PlusColumn<T>[]
  /**
   * 筛选器设置，配置filter函数时为本地筛选，否则为服务器端筛选
   */
  filterable?: Partial<TableFilterable>
  /**
   * 排序设置，sorter函数为true时为服务器端排序，否则为本地排序
   */
  sortable?: TableSortable
  valueEnum?: FieldValueEnumType
  valueType?: FieldValueType
  key?: string
  render?: (data: ColumnRenderInterface<T>) => VNodeChild
  // eslint-disable-next-line @typescript-eslint/ban-types
  dataIndex?: keyof T | (string & {})
}

export type QueryParams = {
  pageSize: number
  current: number
} & Record<string, any>

export type QueryData<T = any> = {
  data: T[] | undefined
  total?: number
  success?: boolean
} & Record<string, any>

export type PageInfo = {
  pageSize: number
  total: number
  current: number
}

export type UseFetchDataAction<T = any> = {
  dataSource: Ref<T[]>
  setDataSource: (dataSource: T[]) => void
  loading: Ref<boolean>
  pageInfo: Ref<PageInfo>
  reload: () => Promise<any>
  fullScreen?: () => void
  reset: () => void
  // pollingLoading: boolean
  setPageInfo: (pageInfo: Partial<PageInfo>) => void
}

export type UseFetchProps = {
  /**
   * 数据源
   * @type {any}
   */
  dataSource?: any

  /**
   * 是否处于加载状态
   * @type {UseFetchDataAction['loading']}
   */
  loading: boolean

  /**
   * 加载状态改变时的回调函数
   * @type {(loading: UseFetchDataAction['loading']) => void}
   */
  onLoadingChange?: (loading: boolean) => void

  /**
   * 数据加载完成后的回调函数
   * @type {(dataSource: any[], extra: any) => void}
   */
  onLoad?: (dataSource: any[], extra: any) => void

  /**
   * 数据源变化时的回调函数
   * @type {(dataSource?: any) => void}
   */
  onDataSourceChange?: (dataSource?: any) => void

  /**
   * 请求时附带的数据
   * @type {any}
   */
  postData: (dataSource: any[]) => any[]

  /**
   * 分页信息
   * @type {{
   *   current?: number;
   *   pageSize?: number;
   *   defaultCurrent?: number;
   *   defaultPageSize?: number;
   * } | false}
   */
  pageInfo: PaginationPropsWithEvent | boolean

  /**
   * 分页信息变化时的回调函数
   * @type {(pageInfo: PageInfo) => void}
   */
  onPageInfoChange?: (pageInfo: PageInfo) => void

  /**
   * 请求相关的副作用
   * @type {any[]}
   */
  effects?: any[]

  /**
   * 请求出错时的回调函数
   * @type {(e: Error) => void}
   */
  onRequestError?: (e: Error) => void

  /**
   * 是否手动触发请求
   * @type {boolean}
   */
  manual: boolean

  /**
   * 请求防抖时间
   * @type {number}
   */
  debounceTime?: number

  /**
   * 数据源轮询间隔时间或轮询触发条件
   * @type {number | ((dataSource: any[]) => number)}
   */
  polling?: number | ((dataSource: any[]) => number)

  /**
   * 是否在页面获得焦点时重新验证数据
   * @type {Boolean}
   */
  revalidateOnFocus?: boolean
}

export type PlusTableExposed<T = any> = {
  action: UseFetchDataAction<T>
}

export type ListToolBarSetting = {
  icon: VNode
  tooltip?: string
  key?: string
  onClick?: (key?: string) => void
}

export type ToolbarProps = {
  options?: OptionConfig | false
  toolbarLeft?: () => VNode
  leftPanelStart?: () => VNode
  leftPanelEnd?: () => VNode
  rightPanelStart?: () => VNode
  rightPanelEnd?: () => VNode
  // optionsRender?: ToolbarRenderProps<T>['optionsRender'];
}
