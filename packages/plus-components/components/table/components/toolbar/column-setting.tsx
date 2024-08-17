import { Popover } from '@arco-design/web-vue'
import { IconSettings } from '@arco-design/web-vue/es/icon'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    // const sizeOptions = [
    //   {
    //     label: '默认',
    //     value: 'medium',
    //   },
    //   {
    //     label: '紧凑',
    //     value: 'small',
    //   },
    //   {
    //     label: '松散',
    //     value: 'large',
    //   },
    // ]
    return () => (
      <Popover
        position="bottom"
        v-slots={{
          content: () => <div>test</div>,
        }}
      >
        <IconSettings />
      </Popover>
    )
  },
})
