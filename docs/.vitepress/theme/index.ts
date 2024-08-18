import DefaultTheme from 'vitepress/theme'
import ArcoVue from '@arco-design/web-vue/es/arco-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import ArcoPlus from 'arco-vue-plus-components'
import ComponentDoc from './components/component-doc.vue'
import 'arco-vue-plus-components/dist/style.css'
import '@arco-design/web-vue/dist/arco.css'
import './theme.less'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(ArcoVue)
    app.use(ArcoVueIcon)
    app.use(ArcoPlus)
    app.component('ComponentDoc', ComponentDoc)
  },
  outline:{
    label:'目录',
  }
}