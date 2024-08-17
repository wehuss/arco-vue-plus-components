import { Badge, Space, Tag } from '@arco-design/web-vue'
import {
  Fragment,
  type CSSProperties,
  FunctionalComponent,
  VNode,
  VNodeChild,
} from 'vue'
import {
  FieldValueEnumType,
  SchemaValueEnumMap,
} from '../field'

/**
 * 获取类型的 type
 *
 * @param obj
 */
function getType(obj: any) {
  // @ts-ignore
  const type = Object.prototype.toString
    .call(obj)
    .match(/^\[object (.*)\]$/)[1]
    .toLowerCase()
  if (type === 'string' && typeof obj === 'object') return 'object' // Let "new String('')" return 'object'
  if (obj === null) return 'null' // PhantomJS has type "DOMWindow" for null
  if (obj === undefined) return 'undefined' // PhantomJS has type "DOMWindow" for undefined
  return type
}

type StatusProps = {
  className?: string
  style?: CSSProperties
  text?: string
}

export const PlusFieldBadgeColor: FunctionalComponent<
  StatusProps & { color: string }
> = ({ color, text }) => <Badge color={color} text={text} />
export const PlusFieldTagColor: FunctionalComponent<
  StatusProps & { color: string }
> = ({ color, text }) => <Tag color={color}>{text}</Tag>

export const objectToMap = (
  value: FieldValueEnumType | undefined
): SchemaValueEnumMap => {
  if (getType(value) === 'map') {
    return value as SchemaValueEnumMap
  }
  return new Map(Object.entries(value || {}))
}

// ["normal", "processing", "success", "warning", "danger"];
const TableStatus: {
  success: FunctionalComponent<StatusProps>
  danger: FunctionalComponent<StatusProps>
  processing: FunctionalComponent<StatusProps>
  normal: FunctionalComponent<StatusProps>
  warning: FunctionalComponent<StatusProps>
} = {
  success: ({ text }) => <Badge status="success" text={text} />,
  danger: ({ text }) => <Badge status="danger" text={text} />,
  normal: ({ text }) => <Badge status="normal" text={text} />,
  processing: ({ text }) => <Badge status="processing" text={text} />,
  warning: ({ text }) => <Badge status="warning" text={text} />,
}
const TableStatusTag: {
  success: FunctionalComponent<StatusProps>
  danger: FunctionalComponent<StatusProps>
  processing: FunctionalComponent<StatusProps>
  normal: FunctionalComponent<StatusProps>
  warning: FunctionalComponent<StatusProps>
} = {
  success: ({ text }) => <Tag color="rgb(var(--success-6))">{text}</Tag>,
  danger: ({ text }) => <Tag color="rgb(var(--danger-6))">{text}</Tag>,
  normal: ({ text }) => <Tag>{text}</Tag>,
  processing: ({ text }) => <Tag color="rgb(var(--primary-6))">{text}</Tag>,
  warning: ({ text }) => <Tag color="rgb(var(--warning-6))">{text}</Tag>,
}

type ProFieldStatusType =
  | 'success'
  | 'warning'
  | 'danger'
  | 'normal'
  | 'processing'

/**
 * 转化 text 和 valueEnum 通过 type 来添加 Status
 *
 * @param text
 * @param valueEnum
 * @param pure 纯净模式，不增加 status
 */
export const fieldParsingText = (
  text: string | number | (string | number)[],
  valueEnumParams: FieldValueEnumType,
  key?: number | string
): VNodeChild => {
  if (Array.isArray(text)) {
    return (
      <Space size={2} wrap>
        {text.map((value, index) =>
          // @ts-ignore
          fieldParsingText(value, valueEnumParams, index)
        )}
      </Space>
    )
  }

  const valueEnum = objectToMap(valueEnumParams)
  if (!valueEnum.has(text) && !valueEnum.has(`${text}`)) {
    // @ts-ignore
    return text?.label || text
  }

  const domText = (valueEnum.get(text) || valueEnum.get(`${text}`)) as {
    text: string
    status: ProFieldStatusType
    color?: string
    type?: 'default' | 'tag'
  }

  if (!domText) {
    // @ts-ignore
    return <Fragment key={key}>{text?.label || text}</Fragment>
  }

  const { status, color, type } = domText

  const Status = type === 'tag' ? TableStatusTag[status] : TableStatus[status]
  // 如果类型存在优先使用类型
  if (Status) {
    return <Status key={key} text={domText.text}></Status>
  }

  // 如果不存在使用颜色
  if (color) {
    return type === 'tag' ? (
      <PlusFieldTagColor key={key} color={color} text={domText.text} />
    ) : (
      <PlusFieldBadgeColor
        key={key}
        color={color}
        text={domText.text}
      ></PlusFieldBadgeColor>
    )
  }
  // 什么都没有使用 text
  return <span key={key}>{domText.text || (domText as any as VNode)}</span>
}
