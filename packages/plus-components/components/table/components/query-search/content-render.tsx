import {
  Button,
  Card,
  CardInstance,
  Col,
  Row,
  Space,
} from '@arco-design/web-vue'
import { getPrefixCls } from '@arco-design/web-vue/es/_utils/global-config'
import { IconDown, IconUp } from '@arco-design/web-vue/es/icon'
import { computed, defineComponent, inject, PropType, ref, VNode } from 'vue'
import { PlusFormItem } from '@/components/form'
import { TableContext, tableInjectionKey } from '../../context'

export default defineComponent({
  props: {
    onSubmit: {
      type: Function as PropType<(form: Record<string, any>) => void>,
    },
    onReset: {
      type: Function as PropType<() => void>,
    },
    actions: {
      type: Object as PropType<{
        submit: () => Promise<Record<string, any> | undefined>
        reset: () => void
        submitterNode: VNode | undefined
      }>,
    },
    config: {
      type: Array as PropType<
        Array<
          PlusFormItem & {
            'modelValue': any
            'onUpdate:modelValue': (val: any) => void
          }
        >
      >,
    },
    items: {
      type: Array as PropType<VNode[]>,
      default: () => [],
    },
  },
  setup(props) {
    const prefixCls = getPrefixCls('plus-table')
    const context = inject<TableContext>(tableInjectionKey)

    const BREAKPOINTS = [
      [576, 1],
      [768, 2],
      [992, 3],
      [1200, 3],
      [1600, 4],
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

    const formItemVNodes = computed(() => props.items || [])

    const processedList = computed(() => {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      totalSpan.value = 0
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      totalSize.value = 0
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      totalShowSpan.value = 0
      return (props.items || []).map((item) => {
        totalSpan.value += spanSize.value
        totalSize.value += 1

        const hidden =
          collapsed.value &&
          totalSize.value > showLength.value - 1 &&
          totalSpan.value >= 24

        totalShowSpan.value += hidden ? 0 : spanSize.value
        return (
          <Col
            span={spanSize.value}
            style={{
              display: hidden ? 'none' : 'block',
            }}
          >
            {item}
          </Col>
        )
      })
    })

    const gutterSize = computed(
      () =>
        ({
          mini: 8,
          small: 12,
          medium: 16,
          large: 24,
        }[context?.size as 'small'])
    )

    return () => (
      <Card
        ref={wrapperRef}
        class={[`${prefixCls}-query-filter-wrapper`]}
        bordered={context?.bordered}
        style={{
          display: formItemVNodes.value.length ? 'block' : 'none',
        }}
      >
        <Row
          gutter={gutterSize.value}
          style={{
            rowGap: 'var(--gap-size)',
          }}
        >
          {processedList.value}

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
                  <Button onClick={props.actions?.reset}>重置</Button>
                  <Button type="primary" onClick={props.actions?.submit}>
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
      </Card>
    )
  },
})
