import {
  InputInstance,
  InputPasswordInstance,
  TextareaInstance,
  SelectProps,
  CheckboxInstance,
  RateInstance,
  SliderInstance,
  AvatarInstance,
  InputNumberInstance,
  ProgressInstance,
  RadioInstance,
} from '@arco-design/web-vue'
import {
  DatePickerProps,
  RangePickerProps,
} from '@arco-design/web-vue/es/date-picker/interface'
import { ImageProps } from '@arco-design/web-vue/es/image/interface'
import { TimePickerProps } from '@arco-design/web-vue/es/time-picker/interface'

import { BadgeStatus } from '@arco-design/web-vue/es/badge/badge'
import { CSSProperties } from 'vue'
import PlusField from '.'

export type FieldValueTypeWithFieldProps = {
  /** 文本输入框 */
  text: InputInstance['$props']
  /** 密码输入框 */
  password: InputPasswordInstance['$props']
  /** 金额 */
  money: Record<string, any>
  /** 索引 */
  index: Record<string, any>
  /** 索引带边框 */
  indexBorder: Record<string, any>
  /** 下拉选择 */
  option: Record<string, any>
  /** 多行文本 */
  textarea: TextareaInstance['$props']
  /** 日期选择器 */
  date: DatePickerProps
  /** 周选择器 */
  dateWeek: DatePickerProps
  /** 月选择器 */
  dateMonth: DatePickerProps
  /** 季度选择器 */
  dateQuarter: DatePickerProps
  /** 年选择器 */
  dateYear: DatePickerProps
  /** 日期时间选择器 */
  dateTime: DatePickerProps
  /** 相对时间 */
  fromNow: DatePickerProps
  /** 日期范围选择器 */
  dateRange: RangePickerProps
  /** 日期时间范围选择器 */
  dateTimeRange: RangePickerProps
  /** 周范围选择器 */
  dateWeekRange: RangePickerProps
  /** 月范围选择器 */
  dateMonthRange: RangePickerProps
  /** 季范围选择器 */
  dateQuarterRange: RangePickerProps
  /** 年范围选择器 */
  dateYearRange: RangePickerProps
  /** 时间选择器 */
  time: TimePickerProps
  /** 时间范围选择器 */
  // timeRange: RangePickerProps;
  /** 下拉选择器 */
  select: SelectProps
  /** 复选框 */
  checkbox: CheckboxInstance['$props']
  /** 评分 */
  rate: RateInstance['$props']
  /** 滑动条 */
  slider: SliderInstance['$props']
  /** 单选框 */
  radio: RadioInstance['$props']
  /** 单选框按钮 */
  radioButton: RadioInstance['$props']
  /** 进度条 */
  progress: ProgressInstance['$props']
  /** 百分比输入框 */
  percent: InputNumberInstance['$props']
  /** 数字输入框 */
  digit: InputNumberInstance['$props']
  /** 数字范围输入框 */
  digitRange: InputNumberInstance['$props']
  /** 秒数输入框 */
  second: InputInstance['$props']
  /** 代码输入框 */
  code: TextareaInstance['$props']
  /** JSON 代码输入框 */
  jsonCode: TextareaInstance['$props']
  /** 头像 */
  avatar: AvatarInstance['$props']
  /** 图片 */
  image: ImageProps
}

/**
 * @param textarea 文本框
 * @param password 密码框
 * @param money 金额 option 操作 需要返回一个数组
 * @param date 日期 YYYY-MM-DD
 * @param dateWeek 周选择器
 * @param dateMonth 月选择器
 * @param dateQuarter 季度选择器
 * @param dateYear 年选择器
 * @param dateRange 日期范围 YYYY-MM-DD[]
 * @param dateTime 日期和时间 YYYY-MM-DD HH:mm:ss
 * @param dateTimeRange 范围日期和时间 YYYY-MM-DD HH:mm:ss[]
 * @param time: 时间 HH:mm:ss
 * @param timeRange: 时间区间 HH:mm:ss[]
 * @param index：序列
 * @param indexBorder：序列
 * @param progress: 进度条
 * @param percent: 百分比
 * @param digit 数值
 * @param second 秒速
 * @param fromNow 相对于当前时间
 * @param avatar 头像
 * @param code 代码块
 * @param image 图片设置
 * @param jsonCode Json 的代码块，格式化了一下
 * @param color 颜色选择器
 * @param color 颜色选择器
 */
export type FieldValueType = Extract<keyof FieldValueTypeWithFieldProps, any>

export type FieldRenderProps = {
  type: FieldValueType
  props: FieldValueTypeWithFieldProps[FieldValueType]
}

export type SchemaValueEnumType = {
  /** @name 显示的文本 */
  text: string
  /** @name 状态 */
  status?: BadgeStatus
  /** @name 自定义的颜色 */
  color?: string
  /** @name 是否禁用 */
  // disabled?: boolean
  type?: 'default' | 'tag'
}

export type SchemaValueEnumMap = Map<
  string | number | boolean,
  SchemaValueEnumType
>

export type SchemaValueEnumObj = Record<string, SchemaValueEnumType>

export type FieldValueEnumType = SchemaValueEnumMap | SchemaValueEnumObj

export type PlusFieldProps<T extends FieldValueType = 'text'> = {
  'mode'?: 'edit' | 'read'
  'valueType'?: T extends FieldValueType ? FieldValueType : 'text'
  'modelValue'?: any
  'columnEmptyText'?: string
  'fieldProps'?: Partial<FieldValueTypeWithFieldProps[T]> & {
    style?: CSSProperties
    class?: string | string[]
  }
  'valueEnum'?: FieldValueEnumType
  'onUpdate:modelValue'?: (value: any) => void
  'rowIndex'?: number
}
