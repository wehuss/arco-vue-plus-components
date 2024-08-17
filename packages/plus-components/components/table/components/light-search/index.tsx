import { getPrefixCls } from '@arco-design/web-vue/es/_utils/global-config'
import {
  computed,
  createVNode,
  defineComponent,
  inject,
  onMounted,
  PropType,
  ref,
  watch,
  watchEffect,
} from 'vue'
import PlusForm from '../../../form'
import { TableContext, tableInjectionKey } from '../../context'
import { getFormItemPropsFromColumns } from '../../utils'

export default defineComponent({
  props: {
    onFormSubmit: {
      type: Function as PropType<(form: Record<string, any>) => void>,
    },
    onFormReset: {
      type: Function as PropType<() => void>,
    },
  },
  setup(props) {
    const context = inject<TableContext>(tableInjectionKey)
    const prefixCls = getPrefixCls('plus-table')

    const formConfig = computed(() =>
      getFormItemPropsFromColumns(Object.values(context?.columns ?? {}))
    )
    const formData = ref<Record<string, any>>(formConfig.value.defaultFormData)
    const onSubmit = (val: any) => {
      context?.action.setPageInfo?.({ current: 1 })
      props.onFormSubmit?.(val)
    }
    // watchEffect(() => {
    //   // console.log('watchEffect', watchEffect)
    //   onSubmit(formData.value)
    // })
    watch(
      () => formData.value,
      (newVal) => {
        onSubmit(newVal)
      },
      {
        deep: true,
      }
    )

    return () => (
      <PlusForm
        onFormSubmit={onSubmit}
        v-model={formData.value}
        class={[`${prefixCls}-light-filter`]}
        layout="inline"
        items={formConfig.value.formItems}
        contentRender={(items) => {
          return items.map((item) => {
            return createVNode(item, {
              hideLabel: item.props?.hideLabel ?? true,
            })
          })
        }}
      />
    )
  },
})
