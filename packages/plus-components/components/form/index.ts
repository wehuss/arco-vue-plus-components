import { type App } from 'vue'
import _PlusField from './form'
import ModalForm from './components/modal-form'
import { genPlusFormItem } from './utils'

const PlusField = Object.assign(_PlusField, {
  install(app: App) {
    app.component(_PlusField.name as string, _PlusField)
  },
})

export { ModalForm, genPlusFormItem }

export type * from './inferface'

export default PlusField
