import type { App } from 'vue'
import _PlusTable from './table'
import { PlusTableExposed } from './interface'
import PlusTableCreate from './components/crud/create'
import PlusTableUpdate from './components/crud/update'
import PlusTableDelete from './components/crud/delete'

const PlusTable=Object.assign(_PlusTable,{
  install(app: App) {
    app.component(_PlusTable.name as string, _PlusTable)
  }
})

type PlusTableInstance = InstanceType<typeof PlusTable> & PlusTableExposed

export * from './interface'
export { PlusTableInstance, PlusTableCreate, PlusTableUpdate, PlusTableDelete }

export default PlusTable