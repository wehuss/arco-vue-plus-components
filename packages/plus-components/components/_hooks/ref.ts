import { type UnwrapRef, ref } from 'vue'
import { cloneDeep } from 'lodash'

export function useRef<T = any>(initValue: T) {
  // eslint-disable-next-line no-underscore-dangle
  const _ref = ref<T>(cloneDeep(initValue))

  const reset = () => {
    _ref.value = cloneDeep(initValue) as UnwrapRef<T>
  }

  return [_ref, reset] as const
}
