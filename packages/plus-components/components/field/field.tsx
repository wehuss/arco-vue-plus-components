import {
  defineComponent,
  toRefs,
  unref,
} from 'vue'
import dayjs from 'dayjs'
import FieldSelect from './field-select'
import commonProps from './common-props'
import FieldText from './field-text'

export default defineComponent({
  name: 'PlusField',
  inheritAttrs: false,
  props: {
    ...commonProps,
    fieldProps: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { mode, valueType, modelValue, columnEmptyText } = toRefs(props)
    if (mode.value === 'edit')
      console.log('props.valueEnusssm', valueType.value, props.valueEnum)

    return () => {
      const componentProps = {
        ...props,
        ...props.fieldProps,
      }
      if (unref(valueType) === 'index') {
        return unref(modelValue) + 1
      }
      if (
        unref(valueType) === 'select' ||
        (unref(valueType) === 'text' && props.valueEnum)
      ) {
        return <FieldSelect {...componentProps} />
      }

      if (
        typeof unref(modelValue) === 'string' ||
        typeof unref(modelValue) === 'number'
      ) {
        if (unref(valueType) === 'date')
          return dayjs(unref(modelValue)).format('YYYY-MM-DD')
        if (unref(valueType) === 'time')
          return dayjs(unref(modelValue)).format('HH:mm:ss')
        if (unref(valueType) === 'dateTime')
          return dayjs(unref(modelValue)).format('YYYY-MM-DD HH:mm:ss')

        if (unref(valueType) === 'percent') return `${unref(modelValue)}%`
      }

      if (
        unref(columnEmptyText) &&
        !['number', 'boolean'].includes(typeof unref(modelValue)) &&
        !unref(modelValue) &&
        unref(mode) === 'read'
      )
        return unref(columnEmptyText) ?? '-'

      return <FieldText {...componentProps} />
    }
  },
})