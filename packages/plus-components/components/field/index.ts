import { createVNode, type App, type VNode } from 'vue'
import _PlusField from './field'
import { FieldValueType, PlusFieldProps } from './inferface'

// PlusField.install = (app: App) =>
//   app.component(PlusField.name as string, PlusField)
const PlusField = Object.assign(_PlusField, {
  install(app: App) {
    app.component(_PlusField.name as string, _PlusField)
  }
})

// type PlusFieldInstance = InstanceType<typeof plusField>

export type * from './inferface'
// export { PlusFieldInstance }
export function renderPlusField<T extends FieldValueType = 'text'>(
  props: PlusFieldProps<T>
): VNode {
  return createVNode(PlusField, props)
}

export default PlusField
