<script setup lang="tsx">
      import {codeFormat,rawCode} from './basic-code';
     
  import { h } from 'vue'
  import { Button } from '@arco-design/web-vue'

  const columns = [
    {
      dataIndex: 'name',
      title: 'Name',
    },
    {
      dataIndex: 'age',
      title: 'Age',
    },
    {
      dataIndex: 'address',
      title: 'Address',
    },
  ]
  const toolbar = {
    leftPanelStart: () => <Button>test</Button>,
  }

  const getTableData = async (params) => {
    const { current, pageSize } = params
    const start = (current - 1) * pageSize
    const data = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          new Array(pageSize).fill(0).map((_, index) => ({
            name: `name-${index + start}`,
            age: index + start,
            address: `address-${index + start}`,
          }))
        )
      }, 1000)
    })

    return {
      data,
      total: 100,
    }
  }

     </script>
<template><ComponentDoc codeName="table.basic" :codeFormat="codeFormat" :rawCode="rawCode"><ClientOnly>
  <div style="height: 300px">
    <PlusTable
      autoFill
      :columns="columns"
      :query="getTableData"
      :toolbar="toolbar"
    />
  </div>
</ClientOnly></ComponentDoc></template>
<style scoped></style>
