---
outline: deep
---

# PlusTable

`PlusTable` 在 `arc-design-vue` 的 `Table` 上进行了一层封装，支持了一些预设，并且封装了一些行为。能帮助用户快速创建一个与服务端进行交互的表格。

## 基本用法
### 查询表格
通过传入`columns`和`query`属性，可快速创建一个查询表格
:::demo
basic.vue
:::

## 自定义表格渲染


通过传入 `tableContentRender` 属性，可以自定义表格内容的渲染方式。
:::demo
CustomContent.vue
:::

**Input**
