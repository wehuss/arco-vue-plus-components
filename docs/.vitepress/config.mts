import { defineConfig } from 'vitepress'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite:{
    plugins:[vueJsx()]
  },
  title: "Arco Vue Plus Components",
  description: "arco vue的扩展组件",
  themeConfig: {
    logo: '/logo.svg',
    outline:{
      label:'页面目录'
    },
    siteTitle:false,
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/quick-start' },
      {
        text: '组件',
        link:'/components/table',
      }
    ],

    sidebar: {
      '/guide':[
        {
          text: '快速开始',
          link: '/guide/quick-start'
        }
      ],
      'components':[
        {
          text:'数据展示',
          items:[
            {
              text:'PlusTable 高级表格',
              link:'/components/table'
            }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
