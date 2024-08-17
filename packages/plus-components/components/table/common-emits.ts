import {
  TableChangeExtra,
  TableColumnData,
  TableData,
} from '@arco-design/web-vue'

export default {
  'update:selectedKeys': (rowKeys: (string | number)[]) => true,
  'update:expandedKeys': (rowKeys: (string | number)[]) => true,
  /**
   * @zh 点击展开行时触发
   * @en Triggered when a row is clicked to expand
   * @param {string | number} rowKey
   * @param {TableData} record
   */
  'expand': (rowKey: string | number, record: TableData) => true,
  /**
   * @zh 已展开的数据行发生改变时触发
   * @en Triggered when the expanded data row changes
   * @param {(string | number)[]} rowKeys
   */
  'expandedChange': (rowKeys: (string | number)[]) => true,
  /**
   * @zh 点击行选择器时触发
   * @en Triggered when the row selector is clicked
   * @param {string | number[]} rowKeys
   * @param {string | number} rowKey
   * @param {TableData} record
   */
  'select': (
    rowKeys: (string | number)[],
    rowKey: string | number,
    record: TableData
  ) => true,
  /**
   * @zh 点击全选选择器时触发
   * @en Triggered when the select all selector is clicked
   * @param {boolean} checked
   */
  'selectAll': (checked: boolean) => true,
  /**
   * @zh 已选择的数据行发生改变时触发
   * @en Triggered when the selected data row changes
   * @param {(string | number)[]} rowKeys
   */
  'selectionChange': (rowKeys: (string | number)[]) => true,
  /**
   * @zh 排序规则发生改变时触发
   * @en Triggered when the collation changes
   * @param {string} dataIndex
   * @param {string} direction
   */
  'sorterChange': (dataIndex: string, direction: string) => true,
  /**
   * @zh 过滤选项发生改变时触发
   * @en Triggered when the filter options are changed
   * @param {string} dataIndex
   * @param {string[]} filteredValues
   */
  'filterChange': (dataIndex: string, filteredValues: string[]) => true,
  /**
   * @zh 表格分页发生改变时触发
   * @en Triggered when the table pagination changes
   * @param {number} page
   */
  'pageChange': (page: number) => true,
  /**
   * @zh 表格每页数据数量发生改变时触发
   * @en Triggered when the number of data per page of the table changes
   * @param {number} pageSize
   */
  'pageSizeChange': (pageSize: number) => true,
  /**
   * @zh 表格数据发生变化时触发
   * @en Triggered when table data changes
   * @param {TableData[]} data
   * @param {TableChangeExtra} extra
   * @param {TableData[]} currentData
   * @version 2.40.0 增加 currentData
   */
  'change': (
    data: TableData[],
    extra: TableChangeExtra,
    currentData: TableData[]
  ) => true,
  /**
   * @zh 单元格 hover 进入时触发
   * @en Triggered when hovering into a cell
   * @param {TableData} record
   * @param {TableColumnData} column
   * @param {Event} ev
   */
  'cellMouseEnter': (record: TableData, column: TableColumnData, ev: Event) =>
    true,
  /**
   * @zh 单元格 hover 退出时触发
   * @en Triggered when hovering out of a cell
   * @param {TableData} record
   * @param {TableColumnData} column
   * @param {Event} ev
   */
  'cellMouseLeave': (record: TableData, column: TableColumnData, ev: Event) =>
    true,
  /**
   * @zh 点击单元格时触发
   * @en Triggered when a cell is clicked
   * @param {TableData} record
   * @param {TableColumnData} column
   * @param {Event} ev
   */
  'cellClick': (record: TableData, column: TableColumnData, ev: Event) => true,
  /**
   * @zh 点击行数据时触发
   * @en Triggered when row data is clicked
   * @param {TableData} record
   * @param {Event} ev
   */
  'rowClick': (record: TableData, ev: Event) => true,
  /**
   * @zh 点击表头数据时触发
   * @en Triggered when the header data is clicked
   * @param {TableColumnData} column
   * @param {Event} ev
   */
  'headerClick': (column: TableColumnData, ev: Event) => true,
  /**
   * @zh 调整列宽时触发
   * @en Triggered when column width is adjusted
   * @param {string} dataIndex
   * @param {number} width
   * @version 2.28.0
   */
  'columnResize': (dataIndex: string, width: number) => true,
  /**
   * @zh 双击行数据时触发
   * @en Triggered when row data is double clicked
   * @param {TableData} record
   * @param {Event} ev
   */
  'rowDblclick': (record: TableData, ev: Event) => true,
  /**
   * @zh 双击单元格时触发
   * @en Triggered when a cell is double clicked
   * @param {TableData} record
   * @param {TableColumnData} column
   * @param {Event} ev
   */
  'cellDblclick': (record: TableData, column: TableColumnData, ev: Event) =>
    true,
  /**
   * @zh 右击行数据时触发
   * @en Triggered when row data is right clicked
   * @param {TableData} record
   * @param {Event} ev
   */
  'rowContextmenu': (record: TableData, ev: Event) => true,
  /**
   * @zh 右击单元格时触发
   * @en Triggered when a cell is right clicked
   * @param {TableData} record
   * @param {TableColumnData} column
   * @param {Event} ev
   */
  'cellContextmenu': (record: TableData, column: TableColumnData, ev: Event) =>
    true,
}
