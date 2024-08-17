import {
  Button,
  Card,
  CardInstance,
  Col,
  Form,
  FormInstance,
  FormItem,
  Input,
  Row,
  Space,
} from '@arco-design/web-vue'
import { getPrefixCls } from '@arco-design/web-vue/es/_utils/global-config'
import { IconDown, IconUp } from '@arco-design/web-vue/es/icon'
import { omit } from 'lodash'
import {
  computed,
  createVNode,
  defineComponent,
  inject,
  PropType,
  ref,
  VNode,
} from 'vue'
import { useRef } from '../../../_hooks/ref'
import { TableContext, tableInjectionKey } from '../../context'
import { PlusColumn } from '../../interface'

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
    const prefixCls = getPrefixCls('plus-table')
    const context = inject<TableContext>(tableInjectionKey)

    const formRef = ref<FormInstance>()
    const [formData, resetFormData] = useRef<Record<string, any>>({})

    const onSubmit = () => {
      formRef.value?.validate((erros) => {
        if (!erros) {
          props.onFormSubmit?.(formData.value)
          context?.action.reset()
        }
      })
    }
    const onReset = () => {
      resetFormData()
      props.onFormReset?.()
      context?.action.reset()
    }

    const BREAKPOINTS = [
      [513, 1],
      [701, 2],
      [1062, 3],
      [1352, 3],
      [Infinity, 6],
    ]
    const wrapperRef = ref<CardInstance>()
    const spanSize = computed(() => {
      const width = wrapperRef.value?.$el.clientWidth || 1024
      const breakPoint = BREAKPOINTS.find(
        (item) => width < (item[0] as number) + 16
      )
      return 24 / (breakPoint?.[1] || 6)
    })
    const showLength = computed(() => Math.max(1, 24 / spanSize.value - 1))
    const collapsed = ref(true)
    const totalSpan = ref(0)
    const totalSize = ref(0)
    const totalShowSpan = ref(0)
    const offset = computed(() => {
      return 24 - spanSize.value - (totalShowSpan.value % 24)
    })
    const needCollapseRender = computed(() => {
      if (totalSpan.value < 24 || totalSize.value <= showLength.value) {
        return false
      }
      return true
    })

    const extractFormItemProps = (item: PlusColumn) => {
      const { form } = item
      if (form === true)
        return {
          label: item.title as string,
          field: item.dataIndex as string,
        }
      const formItemProps = {
        ...form,
        label: form?.label ?? (item.title as string),
        field: form?.field ?? (item.dataIndex as string),
      }
      return formItemProps
    }
    const queryFromItemList = computed(() => {
      return (
        context?.columns
          .map((item) => {
            if (!item.form) {
              return null
            }
            return extractFormItemProps(item)
          })
          .filter((item) => item) || []
      )
    })

    const processedList = computed(() => {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      totalSpan.value = 0
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      totalSize.value = 0
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      totalShowSpan.value = 0
      return queryFromItemList.value.map((item) => {
        totalSpan.value += spanSize.value
        totalSize.value += 1

        const hidden =
          collapsed.value &&
          totalSize.value > showLength.value - 1 &&
          totalSpan.value >= 24

        totalShowSpan.value += hidden ? 0 : spanSize.value
        return {
          ...item,
          hidden,
        }
      })
    })

    // const context = inject(tableInjectionKey)
    const gutterSize = computed(
      () =>
        ({
          mini: 8,
          small: 12,
          medium: 16,
          large: 24,
        }[context?.size as 'small'])
    )

    const DataEntryComponent = (_props: {
      render?: () => VNode
      [key: string]: any
    }) => {
      const componentProps = omit(_props, ['render'])
      if (_props.render) {
        return createVNode(_props.render(), componentProps)
      }
      return <Input {...componentProps} />
    }

    return () => (
      <Card
        ref={wrapperRef}
        class={[`${prefixCls}-query-filter-wrapper`]}
        bordered={context?.bordered}
        style={{
          display: queryFromItemList.value.length ? 'block' : 'none',
        }}
      >
        <Form
          ref={formRef}
          model={formData.value}
          class={[`${prefixCls}-query-filter`]}
          autoLabelWidth
        >
          <Row
            gutter={gutterSize.value}
            style={{
              rowGap: 'var(--gap-size)',
            }}
          >
            {processedList.value.map((item) => (
              <Col
                span={spanSize.value}
                style={{
                  display: item.hidden ? 'none' : 'block',
                }}
              >
                <FormItem {...item}>
                  <DataEntryComponent
                    render={item?.render}
                    v-model={formData.value[item!.field as string]}
                    placeholder={`请输入${item!.label}`}
                    onBlur={onSubmit}
                    allowClear
                  />
                </FormItem>
              </Col>
            ))}

            <Col span={spanSize.value} offset={offset.value}>
              <div
                style={{
                  textAlign: 'end',
                }}
              >
                <Space size={gutterSize.value}>
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--gap-size-small)',
                    }}
                  >
                    <Button onClick={onReset}>重置</Button>
                    <Button type="primary" onClick={onSubmit}>
                      查询
                    </Button>
                  </div>
                  <a
                    class={[`${prefixCls}-query-filter-collapse-button`]}
                    style={{
                      display: needCollapseRender.value ? 'block' : 'none',
                    }}
                    onClick={() => {
                      collapsed.value = !collapsed.value
                    }}
                  >
                    {collapsed.value ? '展开' : '收起'}
                    <span
                      style={{
                        marginLeft: 'calc(var(--margin-size) / 2)',
                      }}
                    >
                      {collapsed.value ? <IconDown /> : <IconUp />}
                    </span>
                  </a>
                </Space>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  },
})
