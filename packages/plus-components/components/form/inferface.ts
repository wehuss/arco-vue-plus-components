import { FormItemInstance } from '@arco-design/web-vue'
import { RenderFunction, VNode } from 'vue'
import {
  FieldValueType,
  FieldValueEnumType,
  FieldValueTypeWithFieldProps,
  PlusFieldProps,
} from '../field'
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

export type PlusFormItem = Omit<FormItemInstance['$props'], 'label'> & {
  label?: string | (() => VNode) | RenderFunction
  render?: (props: DatEntryComponentProps) => VNode
  defaultValue?: any
  hidden?: boolean
  order?: number
  valueType?: FieldValueType
  valueEnum?: FieldValueEnumType
}
