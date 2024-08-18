> [!TIP]
> 推荐使用jsx进行开发


## 安装
### 前置准备
<!-- * 安装18.x版本及以上的`node`
* 安装3.x版本的`vue`
* 安装最新版本的`@arco-design/web-vue` -->
* ``node`` >= 18.x
* ``vue`` >= 3.x
* ``@arco-design/web-vue`` >= 2.x

::: code-group
```sh [npm]
npm install -D arco-vue-plus-components
```

```sh [yarn]
yarn add -D arco-vue-plus-components
```

```sh [pnpm]
pnpm install arco-vue-plus-components
```
:::

## 完整导入
```js
import { createApp } from 'vue'
import ArcoPlus from 'arco-vue-plus-components';
import App from './App.vue';
import 'arco-vue-plus-components/dist/style.css';

const app = createApp(App);
app.use(ArcoPlus);
app.mount('#app');
```

## 浏览器兼容性
* Edge>=79
* Firefox>=78
* Chrome>=83
* Safari>=12
