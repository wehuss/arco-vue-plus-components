import { Form, FormInstance, FormItem } from '@arco-design/web-vue'
import {
  computed,
  createVNode,
  defineComponent,
  PropType,
  ref,
  RenderFunction,
  useModel,
  VNode,
  VNodeChild,
} from 'vue'
import { isFunction, omit } from 'lodash'
import useListeners from '../_hooks/listeners'
import PlusField, {
  PlusFieldProps,
} from '../field'
import { DatEntryComponentProps, PlusFormItem } from './inferface'

export default defineComponent({
  name: 'PlusForm',
  extends: Form,
  props: {
    model: {
      type: Object,
      default: () => ({}),
    },
    onFormSubmit: {
      type: Function as PropType<(form: Record<string, any>) => void>,
    },
    onFormReset: {
      type: Function as PropType<() => void>,
    },
    contentRender: {
      type: Function as PropType<
        (items: VNode[], submit: () => void, reset: () => void) => VNodeChild
      >,
    },
    items: {
      type: Array as PropType<PlusFormItem[]>,
      default: () => [],
    },
    modelValue: {
      type: Object,
    },
    defaultFormData: {
      type: Object,
      default: () => ({}),
    },
    trigger: {
      type: String as PropType<'change' | 'submit'>,
      default: 'change',
    },
  },
  setup(props) {
    const { listeners } = useListeners()

    const formRef = ref<FormInstance>()

    const modelValue = useModel(props, 'modelValue')
    const _formData = ref({ ...props.defaultFormData })
    const computedFormData = computed(() => modelValue.value ?? _formData.value)

    const submit = () => {
      formRef.value?.validate((erros) => {
        if (!erros) {
          props.onFormSubmit?.(computedFormData.value)
        }
      })
    }
    const reset = () => {
      // resetFormData()
      if (modelValue.value) modelValue.value = {}
      _formData.value = {}
      props.onFormReset?.()
    }

    const DataEntryComponent = (
      _props: PlusFieldProps & {
        render?: (p: DatEntryComponentProps) => VNode
        label?: string | RenderFunction
      }
    ) => {
      const componentProps = omit(_props, ['render']) as PlusFieldProps
      const fieldType =
        _props.valueType === 'text' && _props.valueEnum
          ? 'select'
          : _props.valueType || 'text'
      const fieldProps = {
        ...componentProps,
        mode: 'edit',
        allowClear: true,
        fieldProps: {
          placeholder:
            typeof _props.label === 'string' &&
            ['select', 'text'].includes(fieldType)
              ? `请${fieldType === 'text' ? '输入' : '选择'}${_props.label}`
              : undefined,
          allowClear: true,
        },
      } as PlusFieldProps
      if (_props.render) {
        const vnode = _props.render(fieldProps as any)
        return createVNode(vnode, {
          ...fieldProps,
          ...vnode.props,
        })
      }

      return <PlusField {...fieldProps} />
    }

    // onMounted(() => {
    //   if (Object.values(computedFormData.value).length !== 0) submit()
    // })

    const FormItemList = computed(() =>
      props.items.map((item, index) => (
        <FormItem
          {...omit(item, ['render', 'label'])}
          // hideLabel
          v-slots={{
            label: () => (isFunction(item?.label) ? item.label() : item?.label),
          }}
        >
          <DataEntryComponent
            valueType={item.valueType}
            valueEnum={item.valueEnum}
            render={item?.render}
            rowIndex={index}
            v-model={computedFormData.value[item!.field as string]}
            // onChange={submit}
            key={item?.field}
            label={item.label}
          />
        </FormItem>
      ))
    )

    return () => (
      <Form
        {...props}
        {...listeners}
        ref={formRef}
        model={computedFormData.value}
        autoLabelWidth
        onSubmit={submit}
      >
        {props.contentRender
          ? props.contentRender(FormItemList.value, submit, reset)
          : FormItemList.value}
      </Form>
    )
  },
})
