import { computed, defineComponent, toRefs, unref } from 'vue'
import dayjs from 'dayjs'

import { omit } from 'lodash'
import FieldSelect from './field-select'
import commonProps from './common-props'
import FieldText from './field-text'
import FieldNumber from './field-number'
import FieldDate from './field-date'
import FieldCode from './field-code'
import FieldTextArea from './field-text-area'
import FieldRangePicker from './field-range-picker'

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
    const render = computed(() => {
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
      if (unref(valueType) === 'textarea') {
        return <FieldTextArea {...componentProps} />
      }

      if (['digit', 'number'].includes(unref(valueType))) {
        return <FieldNumber {...componentProps} />
      }
      if (unref(valueType) === 'date') {
        return <FieldDate {...componentProps} />
      }
      if (unref(valueType) === 'dateTime') {
        // @ts-ignore
        return (
          <FieldDate
            {...omit(componentProps)}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
          />
        )
      }

      if (unref(valueType) === 'dateRange') {
        return <FieldRangePicker {...omit(componentProps, ['mode'])} />
      }
      if (unref(valueType) === 'dateTimeRange') {
        return (
          <FieldRangePicker
            {...omit(componentProps, ['mode'])}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
          />
        )
      }

      if (unref(valueType) === 'code') {
        return <FieldCode {...componentProps} />
      }
      if (unref(valueType) === 'jsonCode') {
        return <FieldCode {...componentProps} language="json" />
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
    })

    return () => render.value
  },
})
