import { defineConfig } from 'vitepress'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import { genComponentDocWatch } from '../../scripts/doc-gen'
// import path from 'node:path'


// if (process.env.NODE_ENV !== 'production') {
//   console.log('process.env.NODE_ENV', process.env.NODE_ENV);
//   genComponentDocWatch()
// }

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // outDir: '../public',
  // base:'/arco-vue-plus-components/',
  vite: {
    plugins: [vueJsx()],
    ssr: {
      noExternal: [
        '@arco-design/web-vue',
        'lodash',
        'vue',
        'arco-vue-plus-components',
      ],
    },
  },
  title: 'Arco Vue Plus Components',
  description: 'arco vue的扩展组件',
  themeConfig: {
    logo: '/logo.svg',
    outline: {
      label: '页面目录',
    },
    siteTitle: false,
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/quick-start' },
      {
        text: '组件',
        link: '/components/table',
      },
    ],

    sidebar: {
      '/guide': [
        {
          text: '快速开始',
          link: '/guide/quick-start',
        },
      ],
      components: [
        {
          text: '数据展示',
          items: [
            {
              text: 'PlusTable 高级表格',
              link: '/components/table',
            },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
})
