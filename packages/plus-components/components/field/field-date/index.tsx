import { defineComponent, useModel } from 'vue'
import { DatePicker } from '@arco-design/web-vue'
import useListeners from '@/components/_hooks/listeners'
import { omit } from 'lodash'
import commonProps from '../common-props'

export default defineComponent({
  extends: DatePicker,
  props: commonProps,
  setup(props) {
    const { listeners } = useListeners()
    const modelValue = useModel(props, 'modelValue')

    return () => {
      if (props.mode === 'read') {
        return <div>{modelValue.value}</div>
      }
      return (
        <DatePicker
          v-model={modelValue.value}
          {...listeners.value}
          {...omit(props, ['mode'])}
        />
      )
    }
  },
})
