import ModalForm from '@/components/form/components/modal-form'
import { Button, ButtonProps, ValidatedError } from '@arco-design/web-vue'
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
    modalFormConfig: {
      type: Object as PropType<InstanceType<typeof ModalForm>['$props']>,
    },
    // 是否在操作成功后刷新表格
    refreshAfterSuccess: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const prefixCls = getPrefixCls('plus-table')
    const context = inject<TableContext>(tableInjectionKey)

    const config = computed(() =>
      getFormItemPropsFromColumns(
        Object.values(context?.columnsFlatMap ?? {}),
        'createForm'
      )
    )

    const visible = ref(false)
    const setVisible = (val: boolean) => {
      visible.value = val
    }

    const triggerButton = () => {
      const button = (
        <Button
          class={`${prefixCls}-create-button`}
          type="primary"
          status="success"
          {...props.triggerButtonProps}
          onClick={() => {
            setVisible(true)
          }}
        >
          <IconPlus /> {props.triggerButtonProps?.text ?? '新增'}
        </Button>
      )
      if (props.triggerButtonRender) {
        return props.triggerButtonRender(setVisible, button)
      }
      return button
    }

    const handleBeforeSubmit = async (data: {
      done: (closed: boolean) => void
      values: Record<string, any>
      erros: Record<string, ValidatedError> | undefined
    }) => {
      const { done, values, erros } = data
      if (erros) {
        done(false)
        return
      }
      const closed = await new Promise<boolean>(
        // eslint-disable-next-line no-async-promise-executor
        async (resolve) => {
          if (isFunction(props.onSubmit)) {
            let result = props.onSubmit(values, (_closed = true) =>
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
      <Fragment>
        <ModalForm
          {...props.modalFormConfig}
          modalConfig={{
            title: '新增',
            ...props?.modalFormConfig?.modalConfig,
            bodyClass: `${prefixCls}-modal-form`,
          }}
          v-model:visible={visible.value}
          items={config.value.formItems}
          defaultFormData={config.value.defaultFormData}
          onBeforeSubmit={handleBeforeSubmit}
          resetOnClose={true}
        />
        {triggerButton()}
      </Fragment>
    )
  },
})
