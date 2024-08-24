import { Button, ButtonProps } from '@arco-design/web-vue'
import { omit } from 'lodash'
import { computed, defineComponent, PropType, toRefs, unref, VNode } from 'vue'

/** @name 用于配置操作栏 */
export type SearchConfig = {
  /** @name 重置按钮的文本 */
  resetText?: VNode
  /** @name 提交按钮的文本 */
  submitText?: VNode
}

export type SubmitterProps = {
  /** @name 提交方法 */
  onSubmit?: () => void
  /** @name 重置方法 */
  onReset?: () => void
  /** @name 搜索的配置，一般用来配置文本 */
  searchConfig?: SearchConfig
  /** @name 提交按钮的 props */
  submitButtonProps?: false | (ButtonProps & { preventDefault?: boolean })
  /** @name 重置按钮的 props */
  resetButtonProps?: false | (ButtonProps & { preventDefault?: boolean })
  /** @name 自定义操作的渲染 */
  render?:
    | ((
        props: SubmitterProps & {
          submit: () => void
          reset: () => void
        },
        dom: VNode[]
      ) => VNode[] | VNode | false)
    | false
}

export default defineComponent({
  props: {
    onSubmit: {
      type: Function,
    },
    onReset: {
      type: Function,
    },
    searchConfig: {
      type: Object as PropType<SearchConfig>,
    },
    submitButtonProps: {
      type: [Boolean, Object] as PropType<
        false | (ButtonProps & { preventDefault?: boolean })
      >,
      default: undefined,
    },
    resetButtonProps: {
      type: [Boolean, Object] as PropType<
        false | (ButtonProps & { preventDefault?: boolean })
      >,
      default: undefined,
    },
    render: {
      type: Function as PropType<
        (
          props: SubmitterProps & { submit: () => void; reset: () => void },
          dom: VNode[]
        ) => VNode[] | VNode | false
      >,
    },
  },
  setup(props) {
    const { submitButtonProps, resetButtonProps } = toRefs(props)
    return () => {
      const dom = []
      if (unref(resetButtonProps) !== false) {
        dom.push(
          <Button
            onClick={() => {
              props.onReset?.()
            }}
            {...(unref(resetButtonProps) as ButtonProps)}
          >
            {props.searchConfig?.resetText ?? '重置'}
          </Button>
        )
      }
      if (unref(submitButtonProps) !== false) {
        dom.push(
          <Button
            onClick={() => {
              props.onSubmit?.()
            }}
            type="primary"
            {...(unref(submitButtonProps) as ButtonProps)}
          >
            {props.searchConfig?.submitText ?? '搜索'}
          </Button>
        )
      }
      // @ts-expect-error
      const renderDom = props.render ? props.render({ ...props }, dom) : dom

      if (Array.isArray(renderDom)) {
        if (renderDom?.length < 1) {
          return null
        }
        if (renderDom?.length === 1) {
          return renderDom[0] as JSX.Element
        }
        return (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            {renderDom}
          </div>
        )
      }
    }
  },
})
