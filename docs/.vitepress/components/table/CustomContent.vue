<script setup lang="tsx">
  // @ts-ignore
  import data from './lol.json'
  const heroList = data.hero
  const query = async (params) => {
    let list = heroList
    if (params.name) {
      list = heroList.filter((hero) => hero.keywords.includes(params.name))
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
      <a-grid  class="hero-list" cols={6} colGap={16} rowGap={16}>
        {record.map((hero) => (
          <a-grid-item  class="hero">
            <a-card
              v-slots={{
                cover: () => (
                  <a-image
                    src={`https://game.gtimg.cn/images/lol/act/img/skinloading/${hero.instance_id}.jpg`}
                    style='height: 200px'
                    width='100%'
                  />
                ),
              }}
            >
              <div>{hero.name}</div>
              {hero.title}
            </a-card>
          </a-grid-item>
        ))}
      </a-grid>
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
          dataIndex: 'name',
          title: '英雄名称',
          form: true,
        },
      ]"
      :showHeader="false"
      lightSearch
    />
    <div
      style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px"
    ></div>
  </div>
</template>