<script setup lang="ts">
  defineProps<{
    record: any
    rowIndex: number
    column: any
  }>()
</script>

<template>
  <td v-memo="[record, rowIndex, column]">
    <slot></slot>
  </td>
</template>

<style lang="scss" scoped></style>
