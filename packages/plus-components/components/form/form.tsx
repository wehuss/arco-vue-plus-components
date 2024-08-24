import {
  Button,
  Form,
  FormInstance,
  FormItem,
  FormItemInstance,
  ValidatedError,
} from '@arco-design/web-vue'
import {
  computed,
  createVNode,
  defineComponent,
  Fragment,
  PropType,
  reactive,
  Ref,
  ref,
  RenderFunction,
  useModel,
  VNode,
  VNodeChild,
  watch,
} from 'vue'
import { isFunction, omit, pick } from 'lodash'
import useListeners from '@/components/_hooks/listeners'
import PlusField, {
  PlusFieldProps,
} from '@/components/field'
import {
  getValueByPath,
  setValueByPath,
} from '@arco-design/web-vue/es/_utils/get-value-by-path'
import { DatEntryComponentProps, PlusFormItem } from './inferface'
import Submitter, { SubmitterProps } from './components/submitter'


export default defineComponent({
  name: 'PlusForm',
  extends: Form,
  props: {
    model: {
      type: Object,
      default: () => ({}),
    },
    onSubmit: {
      type: Function as PropType<
        (data: {
          values: Record<string, any>
          errors: Record<string, ValidatedError> | undefined
        }) => void
      >,
    },
    onSubmitSuccess: {
      type: Function as PropType<(form: Record<string, any>) => void>,
    },
    onReset: {
      type: Function as PropType<() => void>,
    },
    contentRender: {
      type: Function as PropType<
        (
          items: VNode[],
          actions: {
            submit: () => Promise<Record<string, ValidatedError> | undefined>
            reset: () => void
            submitterNode: VNode | undefined
          },
          config: Array<
            PlusFormItem & {
              'modelValue': any
              'onUpdate:modelValue': (val: any) => void
            }
          >
        ) => VNodeChild
      >,
    },
    items: {
      type: Array as PropType<PlusFormItem[]>,
      default: () => [],
    },
    /**
     * 表单项的默认属性，会被合并到每个表单项的属性中
     */
    itemProps: {
      type: Object as PropType<FormItemInstance['$props']>,
      default: () => ({}),
    },
    modelValue: {
      type: Object,
    },
    // 'onUpdate:modelValue': {
    //   type: Function as PropType<(val: any) => void>,
    // },
    defaultFormData: {
      type: Object,
      default: () => ({}),
    },
    trigger: {
      type: String as PropType<'change' | 'submit'>,
      default: 'change',
    },
    mode: {
      type: String as PropType<'edit' | 'read'>,
      default: 'edit',
    },
    formRef: {
      type: Object as PropType<Ref<FormInstance | undefined>>,
    },
    /**
     * 表单列数，大于1时为多列布局，在 inline 模式下不生效
     */
    cols: {
      type: Number,
      default: 1,
    },
    layout: {
      type: String as PropType<'inline' | 'vertical' | 'horizontal'>,
      default: 'horizontal',
    },
    submitter: {
      type: [Object, Boolean] as PropType<SubmitterProps | false>,
      default: undefined,
    },
  },
  setup(props, { expose, attrs }) {
    const { listeners } = useListeners()
    const formRef = ref<FormInstance>()
    watch(
      () => formRef.value,
      (newVal) => {
        // eslint-disable-next-line vue/no-mutating-props
        if (props.formRef) props.formRef.value = newVal
      }
    )

    const modelValue = useModel(props, 'modelValue')
    const _formData = ref({ ...props.defaultFormData })
    const computedFormData = computed(() => modelValue.value ?? _formData.value)

    const submit = () => {
      return formRef!.value!.validate((erros) => {
        if (!erros) {
          props.onSubmitSuccess?.(computedFormData.value)
        }
        props.onSubmit?.({ values: computedFormData.value, errors: erros })
      })
    }
    const reset = () => {
      if (modelValue.value) modelValue.value = {}
      _formData.value = {}
      props.onReset?.()
    }

    const exposeData = reactive({
      submit,
      reset,
      formRef,
      modelValue,
      formData: computedFormData,
    })
    expose(exposeData)

    // 是否为多列布局
    const isMultiCol = computed(
      () => props.cols > 1 && props.layout !== 'inline'
    )
    const formStyle = computed(() => {
      if (isMultiCol.value) {
        return {
          display: 'grid',
          gridTemplateColumns: `repeat(${props.cols}, 1fr)`,
          gap: '20px',
        }
      }
      return {}
    })
    const formItemStyle = computed(() => {
      if (isMultiCol.value) {
        return {
          marginBottom: '0',
        }
      }
      return {}
    })

    const computedItems = computed(() => {
      return props.items.map((item) => ({
        ...item,
        'modelValue': computedFormData.value[item.field as string],
        'onUpdate:modelValue': (val: any) => {
          computedFormData.value[item.field as string] = val
        },
      }))
    })

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
      const renderProps = {
        ...componentProps,
        mode: props.mode,
        fieldProps: {
          placeholder:
            typeof _props.label === 'string' &&
            ['select', 'text', 'textarea'].includes(fieldType)
              ? `请${fieldType === 'select' ? '选择' : '输入'}${_props.label}`
              : undefined,
          ...(_props.fieldProps || {}),
        },
      } as PlusFieldProps
      if (_props.render) {
        const vnode = _props.render(renderProps as any)
        return createVNode(vnode, {
          ...renderProps,
          ...vnode.props,
        })
      }

      return <PlusField {...renderProps} />
    }

    const submitterProps = computed(() =>
      typeof props.submitter === 'object' || !props.submitter
        ? {}
        : props.submitter
    )
    const submitterNode = computed(() => {
      if (props.submitter === false) return undefined
      return (
        <Submitter
          {...submitterProps.value}
          onSubmit={submit}
          onReset={reset}
        />
      )
    })

    const FormItemList = computed(() => [
      ...computedItems.value.map((item, index) => (
        <FormItem
          style={formItemStyle.value}
          {...props.itemProps}
          {...omit(item, ['render', 'label', 'style'])}
          v-slots={{
            label: () => (isFunction(item?.label) ? item.label() : item?.label),
          }}
        >
          <DataEntryComponent
            valueType={item.valueType}
            valueEnum={item.valueEnum}
            render={item?.render}
            rowIndex={index}
            // v-model={computedFormData.value[item!.field as string]}
            modelValue={getValueByPath(computedFormData.value, item.field)}
            onUpdate:modelValue={(val) => {
              setValueByPath(computedFormData.value, item.field, val)
            }}
            key={item?.field}
            label={item.label}
            fieldProps={item.fieldProps}
          />
        </FormItem>
      )),
    ])

    const formProps = computed(() => pick(props, Object.keys(Form.props)))

    return () => (
      <Form
        {...formProps.value}
        {...omit(listeners.value, ['onSubmit'])}
        ref={formRef}
        model={computedFormData.value}
        autoLabelWidth
        onSubmit={submit}
        style={formStyle.value}
      >
        {props.contentRender ? (
          props.contentRender(
            FormItemList.value,
            { submit, reset, submitterNode: submitterNode.value },
            computedItems.value
          )
        ) : (
          <Fragment>
            {FormItemList.value}
            {submitterNode.value}
          </Fragment>
        )}
      </Form>
    )
  },
})
