import { InlineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import terser from '@rollup/plugin-terser';

const packagePath = path.resolve(process.cwd(), 'packages/plus-components')
const inputPath = path.resolve(packagePath,'components/plus-components.ts')
const distPath = path.resolve(packagePath, 'dist')

const entryFileName='arco-vue-plus-components'

const config: InlineConfig = {
  mode: 'production',
  resolve:{
    alias:[
      {
        find:'@',
        replacement:packagePath
      }
    ]
  },
  build: {
    target: 'modules',
    outDir: distPath,
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    // brotliSize: false,
    rollupOptions: {
      external: ['vue', '@arco-design/web-vue'],
      output: [
        {
          name:'ArcoVuePlusComponents',
          format: 'umd',
          entryFileNames: `${entryFileName}.js`,
          globals: {
            vue: 'Vue',
            '@arco-design/web-vue': 'ArcoDesignWebVue',
          },
        },
        {
          name:'ArcoVuePlusComponentsMin',
          format: 'umd',
          entryFileNames: `${entryFileName}.min.js`,
          globals: {
            vue: 'Vue',
            '@arco-design/web-vue': 'ArcoDesignWebVue',
          },
          plugins: [terser()],
        },
      ],
    },
    // 开启lib模式
    lib: {
      entry:inputPath,
      formats: ['umd'],
      name:'ArcoVuePlusComponents',
    },
  },
  // @ts-ignore vite内部类型错误
  plugins: [vue(), vueJsx()],
}

export default config;
