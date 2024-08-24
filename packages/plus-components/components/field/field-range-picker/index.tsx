import { defineComponent, useModel } from 'vue'
import { RangePicker } from '@arco-design/web-vue'
import useListeners from '@/components/_hooks/listeners'
import { omit } from 'lodash'
import commonProps from '../common-props'

export default defineComponent({
  extends: RangePicker,
  props: omit(commonProps, ['mode']),
  setup(props) {
    const { listeners } = useListeners()
    const modelValue = useModel(props, 'modelValue')

    return () => {
      return (
        <RangePicker
          {...listeners.value}
          {...props}
          v-model={modelValue.value}
        />
      )
    }
  },
})
