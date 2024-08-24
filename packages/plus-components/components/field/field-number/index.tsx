import { defineComponent, useModel } from 'vue'
import { InputNumber } from '@arco-design/web-vue'
import commonProps from '../common-props'

export default defineComponent({
  props: commonProps,
  setup(props) {
    const modelValue = useModel(props, 'modelValue')

    return () => {
      if (props.mode === 'read') {
        return <div>{modelValue.value}</div>
      }

      return <InputNumber v-model={modelValue.value} />
    }
  },
})
