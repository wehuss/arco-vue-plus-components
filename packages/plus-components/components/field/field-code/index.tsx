import { computed, defineComponent, PropType, useModel, watch } from 'vue'
import { Input, Textarea } from '@arco-design/web-vue'
import commonProps from '../common-props'

const languageFormat = (text: string, language: string) => {
  if (typeof text !== 'string') {
    return text
  }
  try {
    if (language === 'json') {
      return JSON.stringify(JSON.parse(text), null, 2)
    }
  } catch (error) {
    // console.log(error)
  }
  return text
}

export default defineComponent({
  props: {
    ...commonProps,
    language: {
      type: String as PropType<'json' | 'text'>,
      default: 'text',
    },
  },
  setup(props) {
    const modelValue = useModel(props, 'modelValue')

    const code = computed(() =>
      languageFormat(modelValue.value, props.language)
    )

    return () => {
      if (props.mode === 'read') {
        return (
          <pre
            style={{
              padding: '12px',
              overflow: 'auto',
              fontSize: '85%',
              lineHeight: 1.45,
              backgroundColor: 'var(--color-fill-2)',
              borderRadius: 3,
              width: 'min-content',
            }}
          >
            {code.value}
          </pre>
        )
      }
      return (
        <Textarea
          autoSize={{
            minRows: 4,
          }}
          v-model={modelValue.value}
        />
      )
    }
  },
})
