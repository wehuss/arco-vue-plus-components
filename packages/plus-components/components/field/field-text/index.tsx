import { defineComponent, useModel } from 'vue'
import { Input } from '@arco-design/web-vue'
import commonProps from '../common-props'

export default defineComponent({
  props: commonProps,
  setup(props) {
    const modelValue = useModel(props, 'modelValue')
    if (props.mode === 'read') {
      return () => <div>{modelValue.value}</div>
    }

    return () => <Input v-model={modelValue.value} />
  },
})
