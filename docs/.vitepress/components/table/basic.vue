<script setup lang="tsx">
  import data from './lol.json'
  import { PlusColumn } from 'arco-vue-plus-components'
  console.log('data',data);
  type Hero = (typeof data.hero)[0]

  const columns: PlusColumn<Hero>[] = [
    {
      dataIndex: 'name',
      title: '英雄称号',
      // form属性用于控制是否在是否字段搜索表单中展示,默认会渲染为input
      form: {
        // 传递给input的属性
        fieldProps: {
          placeholder: '请输入英雄称号/名称/外号',
        },
      },
    },
    {
      dataIndex: 'title',
      title: '英雄名称',
    },
    {
      dataIndex: 'roles',
      title: '定位',
      // 传入enum类型的数据，会自动转换成下拉框
      form: {
        defaultValue: [],
        fieldProps: {
          multiple: true,
        },
      },
      valueEnum: {
        mage: {
          text: '法师',
        },
        tank: {
          text: '坦克',
        },
        assassin: {
          text: '刺客',
        },
        fighter: {
          text: '战士',
        },
        marksman: {
          text: '射手',
        },
        support: {
          text: '辅助',
        },
      },
      // render属性用于自定义渲染
      render: ({ record, column }) => {
        // return record.roles.map(role=><a-space>{column.valueEnum![role].text}</a-space>)
        return (
          <a-space>
            {record.roles.map((role) => (
              <a-tag>{column.valueEnum![role].text}</a-tag>
            ))}
          </a-space>
        )
      },
    },
  ]

  const heroList = data.hero
  const query = async (params) => {
    let list = heroList
    if (params.name) {
      list = heroList.filter((hero) => hero.keywords.includes(params.name))
    }
    if(params.roles){
      list = list.filter(hero=>params.roles.every(role=>hero.roles.includes(role)))
    }
    const { current, pageSize } = params
    const data = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(list.slice((current - 1) * pageSize, current * pageSize))
      }, 300)
    })
    return {
      data,
      total: list.length,
    }
  }
</script>
<template>
  <div style="height: 400px">
    <PlusTable autoFill :columns="columns" :query="query" :toolbar="false" />
  </div>
</template>
<style scoped></style>
