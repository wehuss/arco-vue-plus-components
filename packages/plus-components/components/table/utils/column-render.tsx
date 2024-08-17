import {
  getValueByPath,
  setValueByPath,
} from '@arco-design/web-vue/es/_utils/get-value-by-path'
import { VNode, VNodeChild } from 'vue'
import { isNil } from 'lodash'
import { ColumnRenderInterface } from '../interface'
import PlusField from '../../field/field'

/** 转化列的定义 */
// export type ColumnRenderInterface = {
//   column: PlusColumn
//   record: Record<string, any>
//   rowIndex: number
//   columnEmptyText?: string | false
//   action: UseFetchDataAction
// }

const defaultRender = ({
  column,
  record,
  rowIndex,
  text,
}: ColumnRenderInterface & { text: VNodeChild }) => {
  const modelValue = column.valueType === 'index' ? rowIndex : text
  return (
    <PlusField
      {...column}
      rowIndex={rowIndex}
      modelValue={modelValue as any}
      onUpdate:modelValue={(val: any) => {
        setValueByPath(record, column.dataIndex as string, val)
      }}
    />
  )
  // return PlusField({
  //   ...column,
  //   rowIndex,
  //   'modelValue': modelValue as any,
  //   'onUpdate:modelValue': (val: any) => {
  //     setValueByPath(record, column.dataIndex as string, val)
  //   },
  // })
}

/**
 * 这个组件负责单元格的具体渲染
 *
 * @param param0
 */
export function columnRender({
  column,
  record,
  rowIndex,
  columnEmptyText,
  action,
}: ColumnRenderInterface): any {
  // const { action } = action
  // console.log('r')

  // const { renderText = (val: any) => val } = column
  const text = getValueByPath(record, column.dataIndex as string)
  // const renderTextStr = fieldParsingText(text, column.valueEnum ?? {}, rowIndex)

  const textDom = defaultRender({
    text,
    column,
    record,
    rowIndex,
    columnEmptyText,
    action,
  })
  const dom = textDom

  if (!column.render) {
    return (!isNil(dom) && dom) || null
  }

  const renderDom = column.render({
    column,
    record,
    rowIndex,
    columnEmptyText,
    action,
    dom,
  })

  if (renderDom && record.valueType === 'option' && Array.isArray(renderDom)) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 8,
        }}
      >
        {renderDom}
      </div>
    )
  }
  return renderDom as VNode
}
