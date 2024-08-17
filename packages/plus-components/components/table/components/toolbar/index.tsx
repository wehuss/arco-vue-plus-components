import { IconRefresh } from '@arco-design/web-vue/es/icon'
import { getPrefixCls } from '@arco-design/web-vue/es/_utils/global-config'
import { Component, defineComponent, inject, PropType, VNode } from 'vue'
import { Button, Tooltip } from '@arco-design/web-vue'
import Density from './density'
import ColumnSetting from './column-setting'
import { TableContext, tableInjectionKey } from '../../context'

export type SettingOptionType = {
  draggable?: boolean
  checkable?: boolean
  showListItemOption?: boolean
  checkedReset?: boolean
  listsHeight?: number
  extra?: VNode
  children?: VNode
  settingIcon?: VNode
}
export type OptionConfig = {
  density?: boolean
  fullScreen?: boolean
  reload?: boolean
  setting?: boolean | SettingOptionType
  // search?: (OptionSearchProps & { name?: string }) | boolean;
  reloadIcon?: VNode
  densityIcon?: VNode
}

export default defineComponent({
  props: {
    toolbarLeft: {
      type: Function as PropType<() => VNode>,
    },
    leftPanelStart: {
      type: Function as PropType<() => VNode>,
    },
    leftPanelEnd: {
      type: Function as PropType<() => VNode>,
    },
    rightPanelStart: {
      type: Function as PropType<() => VNode>,
    },
    rightPanelEnd: {
      type: Function as PropType<() => VNode>,
    },
    options: {
      type: [Object, Boolean] as PropType<OptionConfig | false>,
      default: () => ({}),
    },
  },
  setup(props) {
    const prefixCls = getPrefixCls('plus-table')
    const context = inject<TableContext>(tableInjectionKey)

    const defaultOptions = {
      reload: true,
      density: true,
      setting: true,
      search: false,
      fullScreen: true,
    }

    const optionItems = {
      reload: {
        text: '刷新',
        render: () => (
          <IconRefresh
            onClick={() => {
              context?.action.reload()
            }}
          />
        ),
      },
      density: {
        text: '表格密度',
        render: () => <Density />,
      },
      setting: {
        text: '列设置',
        render: () => <ColumnSetting />,
      },
    }

    const renderDefaultOption = () => {
      return Object.entries({ ...defaultOptions, ...props.options })
        .map(([key, value]) => {
          if (!value) return null

          const optionItem = optionItems[key as 'reload']

          if (optionItem)
            return (
              <Tooltip content={optionItem.text}>
                <div class={[`${prefixCls}-toolbar-option-item`]}>
                  <optionItem.render />
                </div>
              </Tooltip>
            )

          return null
        })
        .filter((item) => item)
    }
    return () => (
      <div class={[`${prefixCls}-toolbar`]}>
        <div class={[`${prefixCls}-toolbar-left`]}>
          {props.leftPanelStart && props.leftPanelStart()}
          {props.toolbarLeft && props.toolbarLeft()}
          {props.leftPanelEnd && props.leftPanelEnd()}
        </div>
        <div class={[`${prefixCls}-toolbar-right`]}>
          {props.rightPanelStart && props.rightPanelStart()}
          <div class={[`${prefixCls}-toolbar-options`]}>
            {props.options && renderDefaultOption()}
          </div>
          {props.rightPanelEnd && props.rightPanelEnd()}
        </div>
      </div>
    )
  },
})
