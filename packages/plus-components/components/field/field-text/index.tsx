import { defineComponent, useModel, watch } from 'vue'
import { Input } from '@arco-design/web-vue'
import commonProps from '../common-props'

export default defineComponent({
  props: commonProps,
  setup(props) {
    const modelValue = useModel(props, 'modelValue')
    return () => {
      if (props.mode === 'read') {
        return <div>{modelValue.value}</div>
      }
      return <Input v-model={modelValue.value} />
    }
  },
})
// export default function FieldText(props: any) {
//   console.log('render?')
//   if (props.mode === 'read') {
//     return <div>{props.modelValue}</div>
//   }
//   return (
//     <Input
//       {...props}
//       modelValue={props.modelValue}
//       onUpdate:modelValue={props['onUpdate:modelValue']}
//     />
//   )
// }
