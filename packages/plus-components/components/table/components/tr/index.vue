<script setup lang="ts">
  defineProps<{
    record: any
    rowIndex: number
    columns: any[]
  }>()
</script>

<template>
  <!-- 官方表格在resize时会重新渲染所有td，性能极差。通过自定义td+v-memo确保td只在必要时渲染 -->
  <tr v-memo="[record, rowIndex, columns]">
    <slot></slot>
  </tr>
</template>

<style lang="scss" scoped></style>
