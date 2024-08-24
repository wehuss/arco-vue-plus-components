import ModalForm from '@/components/form/components/modal-form'
import {
  Button,
  ButtonProps,
  Popconfirm,
  ValidatedError,
} from '@arco-design/web-vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'
import {
  computed,
  defineComponent,
  Fragment,
  inject,
  PropType,
  ref,
  VNode,
} from 'vue'
import { isBoolean } from 'lodash'
import { getPrefixCls } from '@arco-design/web-vue/es/_utils/global-config'
import { isFunction, isPromise } from '@arco-design/web-vue/es/_utils/is'
import { TableContext, tableInjectionKey } from '../../../context'
import { getFormItemPropsFromColumns } from '../../../utils'

export default defineComponent({
  name: 'PlusTableCreate',
  props: {
    onSubmit: {
      type: Function as PropType<
        (
          values: Record<string, any>,
          done: (closed: boolean) => void
        ) => boolean | void | Promise<boolean | void>
      >,
    },
    triggerButtonProps: {
      type: Object as PropType<ButtonProps & { text: string }>,
    },
    triggerButtonRender: {
      type: Function as PropType<
        (setVisible: (val: boolean) => void, dom: VNode) => VNode
      >,
    },
    // 是否在操作成功后刷新表格
    refreshAfterSuccess: {
      type: Boolean,
      default: true,
    },
    values: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  },
  setup(props) {
    const prefixCls = getPrefixCls('plus-table')
    const context = inject<TableContext>(tableInjectionKey)

    const visible = ref(false)
    const setVisible = (val: boolean) => {
      visible.value = val
    }

    const triggerButton = () => {
      const button = (
        <Button
          class={`${prefixCls}-delete-button`}
          type="text"
          status="danger"
          {...props.triggerButtonProps}
          onClick={() => {
            setVisible(true)
          }}
        >
          {props.triggerButtonProps?.text ?? '删除'}
        </Button>
      )
      if (props.triggerButtonRender) {
        return props.triggerButtonRender(setVisible, button)
      }
      return button
    }

    const handleBeforeSubmit = async (done: (closed: boolean) => void) => {
      const closed = await new Promise<boolean>(
        // eslint-disable-next-line no-async-promise-executor
        async (resolve) => {
          if (isFunction(props.onSubmit)) {
            let result = props.onSubmit(props.values, (_closed = true) =>
              resolve(_closed)
            )
            if (isPromise(result)) {
              try {
                // if onBeforeOk is Promise<void> ,set Defaults true
                result = (await result) ?? true
              } catch (error) {
                result = false
              }
            }
            if (isBoolean(result)) {
              resolve(result)
            }
          } else {
            resolve(true)
          }
        }
      )
      if (closed && props.refreshAfterSuccess) {
        context?.action.reload?.()
      }
      done(closed)
    }

    return () => (
      <Popconfirm
        content="是否删除该项目"
        onBeforeOk={handleBeforeSubmit}
        type="error"
        okButtonProps={{
          status: 'danger',
        }}
      >
        {triggerButton()}
      </Popconfirm>
    )
  },
})
