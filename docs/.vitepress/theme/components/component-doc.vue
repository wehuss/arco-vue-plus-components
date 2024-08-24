<template>
  <div class="component-doc vp-raw">
    <div class="component-doc-content">
      <slot />
    </div>
    <div class="component-doc-operation">
      <a-space>
        <a-tooltip content="查看代码">
          <a-button
            size="small"
            shape="circle"
            @click="visibleCode = !visibleCode"
            :class="{
              'btn-active': visibleCode,
            }"
          >
            <icon-code />
          </a-button>
        </a-tooltip>
        <a-tooltip content="查看代码">
          <a-button size="small" shape="circle" @click="copyCode">
            <icon-copy />
          </a-button>
        </a-tooltip>
      </a-space>
    </div>
    <div
      class="component-doc-code"
      :style="{
        height: visibleCode ? 'auto' : '0',
        opacity: visibleCode ? '1' : '0',
      }"
    >
      <pre v-html="currentCode" />
    </div>
  </div>
</template>

<script>
  import { Message } from '@arco-design/web-vue'
  import { defineComponent, ref, computed } from 'vue'
  import { useClipboard } from '@vueuse/core'

  export default defineComponent({
    props: {
      codeName: String,
      codeSrc: String,
      codeFormat: String,
      rawCode: String,
    },
    setup(props) {
      const currentCode = computed(() => decodeURIComponent(props.codeFormat))
      const visibleCode = ref(false)

      const { copy } = useClipboard()
      const copyCode = () => {
        copy(decodeURIComponent(props.rawCode)).then(() => {
          Message.success('复制成功')
        })
      }

      return {
        visibleCode,
        currentCode,
        copyCode,
      }
    },
  })
</script>

<style lang="less">
  .component-doc {
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    ul {
      padding-left: 0;
      margin: 0 0;
    }
    &-content {
      padding: 24px;
      border: 1px solid var(--color-border);
      border-radius: 4px;
    }
    .component-doc-operation {
      display: flex;
      justify-content: flex-end;

      .arco-btn {
        margin-left: 8px;
        background-color: var(--color-bg-4);
        border: 1px solid var(--color-fill-3);

        &:hover {
          color: rgb(var(--primary-6));
          border-color: rgb(var(--primary-6));
        }
      }
      .btn-active {
        color: rgb(var(--gray-1));
        background-color: rgb(var(--gray-10));
        border-color: rgb(var(--gray-1));
      }
      // padding: 8px 24px;
      // border-top: 1px solid var(--color-border);
      // background-color: var(--vp-c-code-block-bg);
    }

    &-code {
      max-height: 720px;
      transition: all 0.3s;
      opacity: 0;
      height: 0;
      font-size: 14px;
      overflow: auto;
      background-color: var(--color-fill-2);
      padding: 12px 24px;
      border-radius: 4px;
      code {
        color: #000;
        background: none;
        text-shadow: 0 1px white;
        font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
        font-size: 1em;
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        word-wrap: normal;
        line-height: 1.5;
        -moz-tab-size: 4;
        -o-tab-size: 4;
        tab-size: 4;
        -webkit-hyphens: none;
        -moz-hyphens: none;
        -ms-hyphens: none;
        hyphens: none;
      }
    }
  }
</style>
