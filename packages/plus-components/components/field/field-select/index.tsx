import { computed, defineComponent } from 'vue'
import { Select, SelectOptionData } from '@arco-design/web-vue'
import commonProps from '../common-props'
import { fieldParsingText } from '../../_utils/field-parsing-text'
import { FieldValueEnumType, SchemaValueEnumMap } from '../inferface'

function getType(obj: any) {
  // @ts-ignore
  const type = Object.prototype.toString
    .call(obj)
    .match(/^\[object (.*)\]$/)[1]
    .toLowerCase()
  if (type === 'string' && typeof obj === 'object') return 'object' // Let "new String('')" return 'object'
  if (obj === null) return 'null' // PhantomJS has type "DOMWindow" for null
  if (obj === undefined) return 'undefined' // PhantomJS has type "DOMWindow" for undefined
  return type
}

export const ObjToMap = (
  value: FieldValueEnumType | undefined
): SchemaValueEnumMap => {
  if (getType(value) === 'map') {
    return value as SchemaValueEnumMap
  }
  return new Map(Object.entries(value || {}))
}

/**
 * 把 value 的枚举转化为数组
 *
 * @param valueEnum
 */
export const plusFieldParsingValueEnumToArray = (
  valueEnumParams: FieldValueEnumType
): SelectOptionData[] => {
  const enumArray: Partial<
    SelectOptionData & {
      text: string
      /** 是否禁用 */
      disabled?: boolean
    }
  >[] = []
  const valueEnum = ObjToMap(valueEnumParams)

  valueEnum.forEach((_, key) => {
    const value = (valueEnum.get(key) || valueEnum.get(`${key}`)) as {
      text: string
      disabled?: boolean
    }

    if (!value) {
      return
    }

    if (typeof value === 'object' && value?.text) {
      enumArray.push({
        text: value?.text as unknown as string,
        value: key,
        label: value?.text as unknown as string,
        disabled: value.disabled,
      })
      return
    }
    enumArray.push({
      text: value as unknown as string,
      value: key,
    })
  })
  return enumArray
}

export default defineComponent({
  props: commonProps,
  setup(props) {
    if (props.mode === 'read') {
      return () =>
        fieldParsingText(
          props.modelValue,
          // @ts-expect-error
          props.valueEnum,
          props.rowIndex
        )
    }
    const options = computed(() =>
      plusFieldParsingValueEnumToArray(ObjToMap(props.valueEnum)).map(
        ({ value, text, ...rest }) => ({
          label: text,
          value,
          key: value,
          ...rest,
        })
      )
    )

    return () => <Select options={options.value} {...props} />
  },
})
