import { defineComponent, useModel, watch } from 'vue'
import { Input, Textarea } from '@arco-design/web-vue'
import commonProps from '../common-props'

export default defineComponent({
  props: commonProps,
  setup(props) {
    const modelValue = useModel(props, 'modelValue')
    return () => {
      if (props.mode === 'read') {
        return <div>{modelValue.value}</div>
      }
      return <Textarea v-model={modelValue.value} />
    }
  },
})
