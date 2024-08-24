import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TbodyRender',
  props: {
    render: {
      type: Function,
    },
  },
  setup(props) {
    return () => props?.render?.()
  },
})
