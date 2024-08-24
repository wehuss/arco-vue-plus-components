import { getPrefixCls } from '@arco-design/web-vue/es/_utils/global-config'
import {
  computed,
  createVNode,
  defineComponent,
  inject,
  PropType,
  ref,
  watch,
} from 'vue'
import PlusForm from '@/components/form/form'
import { merge } from 'lodash'
import { TableContext, tableInjectionKey } from '../../context'
import { getFormItemPropsFromColumns } from '../../utils'

export default defineComponent({
  props: {
    onSubmit: {
      type: Function as PropType<(form: Record<string, any>) => void>,
    },
    onReset: {
      type: Function as PropType<() => void>,
    },
  },
  setup(props) {
    const context = inject<TableContext>(tableInjectionKey)
    const prefixCls = getPrefixCls('plus-table')

    const formConfig = computed(() => {
      const config = getFormItemPropsFromColumns(
        Object.values(context?.columnsFlatMap ?? {}),
        'searchForm'
      )
      return {
        ...config,
        formItems: config.formItems.map((item) => ({
          ...item,
          // 查询表单暂不支持校验
          rules: [],
          fieldProps: merge(
            { ...item.fieldProps },
            {
              allowClear: true,
            }
          ),
        })),
      }
    })

    const formData = ref<Record<string, any>>(formConfig.value.defaultFormData)
    const onSubmit = (val: any) => {
      context?.action.setPageInfo?.({ current: 1 })
      props.onSubmit?.(val)
    }

    watch(
      () => formData.value,
      (newVal) => {
        onSubmit(newVal)
      },
      {
        deep: true,
        immediate: true,
      }
    )

    return () => (
      <PlusForm
        style={{
          width: 'auto',
        }}
        onSubmitSuccess={onSubmit}
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
