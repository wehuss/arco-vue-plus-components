import { Select, Size } from '@arco-design/web-vue'
import { IconLineHeight } from '@arco-design/web-vue/es/icon'
import { defineComponent, inject } from 'vue'
import { TableContext, tableInjectionKey } from '../../context'

export default defineComponent({
  setup() {
    const context = inject<TableContext>(tableInjectionKey)
    const sizeOptions = [
      {
        label: '默认',
        value: 'medium',
      },
      {
        label: '紧凑',
        value: 'small',
      },
      {
        label: '松散',
        value: 'large',
      },
      {
        label: '迷你',
        value: 'mini',
      },
    ]
    return () => (
      <Select
        modelValue={context?.tableSize}
        options={sizeOptions}
        onChange={(val) => {
          context?.setTableSize(val as Size)
        }}
        triggerProps={{
          autoFitPopupMinWidth: true,
          contentStyle: {
            width: '80px',
          },
          position: 'bottom',
          showArrow: true,
        }}
        v-slots={{
          trigger: () => <IconLineHeight />,
          option: ({ data }: any) => (
            <span
              style={{
                color:
                  data.value === context?.tableSize
                    ? 'rgb(var(--primary-6))'
                    : '',
              }}
            >
              {data.label}
            </span>
          ),
        }}
      ></Select>
    )
  },
})
