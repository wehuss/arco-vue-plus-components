import { PropType } from 'vue'
import { FieldValueType, FieldValueEnumType } from './inferface'

export default {
  'mode': {
    type: String as PropType<'edit' | 'read'>,
    default: 'read',
  },
  'valueType': {
    type: String as PropType<FieldValueType>,
    default: 'text',
  },
  'valueEnum': {
    type: [Object, Map] as PropType<FieldValueEnumType>,
  },
  'modelValue': {
    type: [String, Number, Boolean, Object, Array] as PropType<any>,
  },
  // eslint-disable-next-line vue/prop-name-casing
  'onUpdate:modelValue': {
    type: Function as PropType<(value: any) => void>,
  },
  'columnEmptyText': {
    type: String,
  },
  'rowIndex': {
    type: Number,
  },
}
