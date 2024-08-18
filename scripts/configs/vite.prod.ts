import { InlineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import external from '../plugins/vite-plugin-external';
import vueExportHelper from '../plugins/vite-plugin-vue-export-helper';
import path from 'path';
import dts from 'vite-plugin-dts';

const packagePath = path.resolve(process.cwd(), 'packages/plus-components')
const componentsPath = path.resolve(packagePath, 'components')
const esPath = path.resolve(packagePath, 'es')
const libPath = path.resolve(packagePath, 'lib')
const inputPath = path.resolve(packagePath,'components/index.ts')

const config: InlineConfig = {
  mode: 'production',
  build: {
    target: 'modules',
    outDir: esPath,
    emptyOutDir: false,
    minify: false,
    // brotliSize: false,
    rollupOptions: {
      input: [inputPath],
      output: [
        {
          format: 'es',
          dir: esPath,
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: componentsPath,
        },
        {
          format: 'commonjs',
          dir: libPath,
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: componentsPath,
        },
      ],
    },
    // 开启lib模式，但不使用下面配置
    lib: {
      entry: inputPath,
      formats: ['es', 'cjs'],
    },
  },
  // @ts-ignore vite内部类型错误
  plugins: [external(), vue(), vueJsx(), vueExportHelper(),    dts({
    root:packagePath,
    outDir: ['es', 'lib'], // 指定.d.ts文件的输出目录
    // tsconfigPath: '../../tsconfig.json', // 指定tsconfig.json路径
    compilerOptions:{
      jsx: 1,
      skipLibCheck: true,
      isolatedModules:false,
    }
  }),],
};

export default config;
