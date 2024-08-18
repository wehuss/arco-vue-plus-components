import DefaultTheme from 'vitepress/theme'
import ArcoVue from '@arco-design/web-vue/lib'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import ArcoPlus from 'arco-vue-plus-components'
import ComponentDoc from './components/component-doc.vue'
import 'arco-vue-plus-components/dist/style.css'
import '@arco-design/web-vue/dist/arco.css'
import './theme.less'

// import pkg from '@arco-design/web-vue/lib/index.js'
// console.log(pkg);

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(ArcoVue)
    app.use(ArcoVueIcon)
    app.use(ArcoPlus)
    app.component('ComponentDoc', ComponentDoc)

    // 注册图标组件
    // app.component('IconLineHeight', IconLineHeight)
    // app.component('IconSettings', IconSettings)
    // app.component('IconRefresh', IconRefresh)
    // app.component('IconDown', IconDown)
    // app.component('IconUp', IconUp)
  },
  outline: {
    label: '目录',
  },
}
