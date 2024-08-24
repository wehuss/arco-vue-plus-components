import { computed, watchEffect } from 'vue'
import { ColumnsState, ColumnsStateType, PlusColumn } from '../../interface'
import { useMergedState } from '../use-merged-state'

export default function useColumnsState(
  columnsState: ColumnsStateType,
  columns: PlusColumn[]
) {
  const defaultColumnKeyMap = computed(() => {
    const columnKeyMap: ColumnsStateType['defaultValue'] = {}
    columns.forEach(({ key, dataIndex, fixed, disable }, index) => {
      const columnKey = key ?? dataIndex ?? index
      if (columnKey) {
        columnKeyMap[columnKey as string] = {
          show: true,
          fixed,
          disable,
        }
      }
    })

    return columnKeyMap
  })
  const columnsStateValue = computed(
    () => columnsState.value as Record<string, ColumnsState>
  )
  const [columnsMap, setColumnsMap] = useMergedState<
    typeof defaultColumnKeyMap.value
  >(
    () => {
      const { persistenceType, persistenceKey } = columnsState
      if (persistenceKey && persistenceType && typeof window !== 'undefined') {
        /** 从持久化中读取数据 */
        const storage = window[persistenceType]
        try {
          const storageValue = storage?.getItem(persistenceKey)
          if (storageValue) {
            return JSON.parse(storageValue)
          }
        } catch (error) {
          console.warn(error)
        }
      }
      return (
        columnsState?.value ||
        columnsState?.defaultValue ||
        defaultColumnKeyMap.value
      )
    },
    {
      value: columnsStateValue,
      onChange: columnsState.onChange,
    }
  )

  watchEffect(() => {
    const { persistenceType, persistenceKey } = columnsState || {}

    if (persistenceKey && persistenceType && typeof window !== 'undefined') {
      /** 从持久化中读取数据 */
      const storage = window[persistenceType]
      try {
        const storageValue = storage?.getItem(persistenceKey)
        if (storageValue) {
          setColumnsMap(JSON.parse(storageValue))
        } else {
          console.log('else')
          setColumnsMap(defaultColumnKeyMap.value)
        }
      } catch (error) {
        console.warn(error)
      }
    }
  })

  const clearPersistenceStorage = computed(() => {
    const _columnsState = columnsState
    return () => {
      const { persistenceType, persistenceKey } = _columnsState || {}

      if (!persistenceKey || !persistenceType || typeof window === 'undefined')
        return

      /** 给持久化中设置数据 */
      const storage = window[persistenceType]
      try {
        storage?.removeItem(persistenceKey)
      } catch (error) {
        console.warn(error)
      }
    }
  })

  watchEffect(() => {
    if (!columnsState?.persistenceKey || !columnsState?.persistenceType) {
      return
    }
    if (typeof window === 'undefined') return
    /** 给持久化中设置数据 */
    const { persistenceType, persistenceKey } = columnsState
    const storage = window[persistenceType]
    try {
      storage?.setItem(persistenceKey, JSON.stringify(columnsMap))
    } catch (error) {
      console.warn(error)
      clearPersistenceStorage.value()
    }
  })

  return { columnsMap, setColumnsMap }
}
