import { ButtonProps, FormItemInstance } from '@arco-design/web-vue'
import { CSSProperties, RenderFunction, VNode } from 'vue'
import {
  FieldValueType,
  FieldValueEnumType,
  FieldValueTypeWithFieldProps,
  PlusFieldProps,
} from '@/components/field'
import { TimePickerProps } from '@arco-design/web-vue/es/time-picker/interface'
import { RangePickerProps } from '@arco-design/web-vue/es/date-picker/interface'

export type PlusFormItemRenderObject =
  | {
      type: 'text'
      props: FieldValueTypeWithFieldProps['text']
    }
  | {
      type: 'password'
      props: FieldValueTypeWithFieldProps['password']
    }
  | {
      type: 'money'
      props: FieldValueTypeWithFieldProps['money']
    }
  | {
      type: 'index'
      props: FieldValueTypeWithFieldProps['index']
    }
  | {
      type: 'indexBorder'
      props: FieldValueTypeWithFieldProps['indexBorder']
    }
  | {
      type: 'option'
      props: FieldValueTypeWithFieldProps['option']
    }
  | {
      type: 'textarea'
      props: FieldValueTypeWithFieldProps['textarea']
    }
  | {
      type: 'date'
      props: FieldValueTypeWithFieldProps['date']
    }
  | {
      type: 'dateWeek'
      props: FieldValueTypeWithFieldProps['dateWeek']
    }
  | {
      type: 'dateMonth'
      props: FieldValueTypeWithFieldProps['dateMonth']
    }
  | {
      type: 'dateQuarter'
      props: FieldValueTypeWithFieldProps['dateQuarter']
    }
  | {
      type: 'dateYear'
      props: FieldValueTypeWithFieldProps['dateYear']
    }
  | {
      type: 'dateTime'
      props: FieldValueTypeWithFieldProps['dateTime']
    }
  | {
      type: 'fromNow'
      props: FieldValueTypeWithFieldProps['fromNow']
    }
  | {
      type: 'dateRange'
      props: RangePickerProps
    }
  | {
      type: 'dateTimeRange'
      props: RangePickerProps
    }
  | {
      type: 'dateWeekRange'
      props: RangePickerProps
    }
  | {
      type: 'dateMonthRange'
      props: RangePickerProps
    }
  | {
      type: 'dateQuarterRange'
      props: RangePickerProps
    }
  | {
      type: 'dateYearRange'
      props: RangePickerProps
    }
  | {
      type: 'time'
      props: TimePickerProps
    }
  | {
      type: 'timeRange'
      props: TimePickerProps
    }
  | {
      type: 'select'
      props: FieldValueTypeWithFieldProps['select']
    }
  | {
      type: 'checkbox'
      props: FieldValueTypeWithFieldProps['checkbox']
    }
  | {
      type: 'rate'
      props: FieldValueTypeWithFieldProps['rate']
    }
  | {
      type: 'slider'
      props: FieldValueTypeWithFieldProps['slider']
    }
  | {
      type: 'radio'
      props: FieldValueTypeWithFieldProps['radio']
    }
  | {
      type: 'radioButton'
      props: FieldValueTypeWithFieldProps['radioButton']
    }
  | {
      type: 'progress'
      props: FieldValueTypeWithFieldProps['progress']
    }
  | {
      type: 'custom'
      render: RenderFunction
    }

export type DatEntryComponentProps = PlusFieldProps & {
  allowClear: true
}

export type PlusFormItem<T extends FieldValueType = any> = Omit<
  FormItemInstance['$props'],
  'label'
> & {
  label?: string | (() => VNode) | RenderFunction
  render?: (props: DatEntryComponentProps) => VNode
  defaultValue?: any
  hidden?: boolean
  order?: number
  valueType?: FieldValueType
  valueEnum?: FieldValueEnumType
  fieldProps?: Partial<FieldValueTypeWithFieldProps[T]> & {
    style?: CSSProperties
    class?: string | string[]
  }
}

// /** @name 用于配置操作栏 */
// export type SearchConfig = {
//   /** @name 重置按钮的文本 */
//   resetText?: VNode
//   /** @name 提交按钮的文本 */
//   submitText?: VNode
// }

// export type SubmitterProps<T = Record<string, any>> = {
//   /** @name 提交方法 */
//   onSubmit?: (value?: T) => void
//   /** @name 重置方法 */
//   onReset?: (value?: T) => void
//   /** @name 搜索的配置，一般用来配置文本 */
//   searchConfig?: SearchConfig
//   /** @name 提交按钮的 props */
//   submitButtonProps?: false | (ButtonProps & { preventDefault?: boolean })
//   /** @name 重置按钮的 props */
//   resetButtonProps?: false | (ButtonProps & { preventDefault?: boolean })
//   /** @name 自定义操作的渲染 */
//   render?:
//     | ((
//         props: SubmitterProps &
//           T & {
//             submit: () => void
//             reset: () => void
//           },
//         dom: VNode[]
//       ) => VNode[] | VNode | false)
//     | false
// }
