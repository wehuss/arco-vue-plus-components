import useListeners from '@/components/_hooks/listeners'
import {
  Button,
  type FormInstance,
  Modal,
  Space,
  type ValidatedError,
} from '@arco-design/web-vue'
import { isPromise, isFunction } from '@arco-design/web-vue/es/_utils/is'
import { isBoolean, omit } from 'lodash'
import {
  type PropType,
  defineComponent,
  type SlotsType,
  ref,
  onMounted,
  Ref,
  VNode,
} from 'vue'
import PlusForm from '../form'

export interface ValidateParams {
  errors: Record<string, ValidatedError> | undefined
  done: (closed: boolean) => void
  isPass: boolean
}

export default defineComponent({
  extends: PlusForm,
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    modalConfig: {
      type: Object as PropType<InstanceType<typeof Modal>['$props']>,
      default: () => ({}),
    },
    onBeforeSubmit: {
      type: Function as PropType<
        (data: {
          done: (closed: boolean) => void
          values: Record<string, any>
          erros: Record<string, ValidatedError> | undefined
        }) => boolean | void | Promise<boolean | void>
      >,
    },
    footerRender: {
      type: Function as PropType<
        (action: { ok: () => void; cancel: () => void }) => VNode
      >,
    },
    submitOnEnter: {
      type: Boolean,
      default: true,
    },
    resetOnClose: {
      type: Boolean,
      default: true,
    },
  },
  slots: Object as SlotsType<{
    default: any
  }>,
  emits: ['update:visible', 'validate'],
  setup(props, { slots, emit }) {
    const plusFormRef = ref<
      InstanceType<typeof PlusForm> & {
        reset: () => void
        submit: () => void
        formRef: FormInstance
        formData: Record<string, any>
      }
    >()
    const { listeners } = useListeners()

    const modalRef = ref<InstanceType<typeof Modal>>()
    const handleBeforeOk = async (done: (closed: boolean) => void) => {
      const closed = await new Promise<boolean>(
        // eslint-disable-next-line no-async-promise-executor
        async (resolve) => {
          if (isFunction(props.onBeforeSubmit)) {
            const erros = await plusFormRef.value?.formRef.validate()
            let result = props.onBeforeSubmit({
              done: (_closed = true) => resolve(_closed),
              erros,
              values: plusFormRef.value!.formData as Record<string, any>,
            })
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
      done(closed)
    }

    return () => {
      return (
        <Modal
          ref={modalRef}
          {...props.modalConfig}
          visible={props.visible}
          onUpdate:visible={(val) => {
            emit('update:visible', val)
          }}
          onOk={async () => {
            const erros = await plusFormRef.value?.formRef.validate()
            props.onSubmit?.({
              values: plusFormRef.value!.modelValue as Record<string, any>,
              errors: erros,
            })
            if (!erros) {
              props.onSubmitSuccess?.(plusFormRef.value!.formData)
            }
          }}
          onClose={() => {
            if (props.resetOnClose) {
              plusFormRef.value?.reset()
            }
          }}
          onBeforeOk={handleBeforeOk}
          v-slots={{
            // ...omit(slots, 'default'),
            ...slots,
            footer:
              typeof props.footerRender === 'function'
                ? () =>
                    props.footerRender!({
                      ok: async () => {
                        await modalRef.value?.handleOk(new Event('click'))
                      },
                      cancel: () => {
                        modalRef.value?.handleCancel(new Event('click'))
                      },
                    })
                : undefined,
          }}
        >
          <PlusForm
            ref={plusFormRef}
            {...listeners}
            {...omit(props, ['onSubmit'])}
            onSubmit={async () => {
              await modalRef.value?.handleOk(new Event('click'))
            }}
            contentRender={(items) => {
              if (props.submitOnEnter) {
                items.push(<button type="submit" style="display:none"></button>)
              }
              return items
            }}
          />
        </Modal>
      )
    }
  },
})
