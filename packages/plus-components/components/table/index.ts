import type { App } from 'vue'
import _PlusTable from './table'
import { PlusTableExposed } from './interface'

// PlusTable.install = (app: App) =>
//   app.component(PlusTable.name as string, PlusTable)
const PlusTable=Object.assign(_PlusTable,{
  install(app: App) {
    app.component(_PlusTable.name as string, _PlusTable)
  }
})

type PlusTableInstance = InstanceType<typeof PlusTable> & PlusTableExposed

export * from './interface'
export { PlusTableInstance }

export default PlusTable
