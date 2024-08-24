<script setup lang="ts">
  const props = defineProps<{
    record: any
    column: any
    rowIndex: number
    render: any
  }>()
</script>

<template>
  <div v-memo="[record, column, rowIndex]">
    <component :is="render" />
  </div>
</template>

<style lang="scss" scoped></style>
