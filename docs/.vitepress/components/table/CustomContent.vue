<script setup lang="tsx">
  // @ts-ignore
  import data from './lol.json'
  const heroList = data.hero
  const query = async (params) => {
    let list=heroList
    if(params.name){
      list=heroList.filter(hero=>hero.keywords.includes(params.name))
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
  const tableContentRender = (record: any[]) => {
    return (
      <div style='display: grid;grid-template-columns: repeat(6,1fr);gap: 16px;padding:16px'>
        {record.map((hero) => (
          <a-card
            v-slots={{
              cover: () => (
                <a-image
                  src={`https://game.gtimg.cn/images/lol/act/img/skinloading/${hero.instance_id}.jpg`}
                  style='height: 200px'
                />
              ),
            }}
          >
            <div>{hero.name}</div>
            {hero.title}
          </a-card>
        ))}
      </div>
    )
  }
</script>

<template>
  <div style="height: 600px">
    <PlusTable
      autoFill
      :query="query"
      :tableContentRender="tableContentRender"
      :columns="[
        {
          dataIndex:'name',
          title:'英雄名称',
          form:true
        }
      ]"
      :showHeader="false"
      lightSearch
    />
    <div
      style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px"
    ></div>
  </div>
</template>

<style scoped></style>
