import {type App } from 'vue'
import _PlusField from './form'

const PlusField=Object.assign(_PlusField,{
  install(app: App) {
    app.component(_PlusField.name as string, _PlusField)
  }
})
// PlusField.install = (app: App) =>
//   app.component(PlusField.name as string, PlusField)

// type PlusFieldInstance = InstanceType<typeof plusField>

export type * from './inferface'


export default PlusField
