/*
 * @Author       : linxiao
 * @Date         : 2023-03-27 09:53:48
 * @LastEditors  : linxiao
 * @LastEditTime : 2023-03-29 14:06:25
 * @FilePath     : /src/stores/system.js
 * @Description  :系统状态
 * Copyright 2023 OBKoro1, All Rights Reserved.
 * 2023-03-27 09:53:48
 */
import { getConfig } from '@/config/index'
import IconMaterialSymbolsWbSunnyRounded from '~icons/material-symbols/wb-sunny-rounded'
import IconMaterialSymbolsDarkModeRounded from '~icons/material-symbols/dark-mode-rounded'
import IconMdiThemeLightDark from '~icons/mdi/theme-light-dark'

export const useSystemStore = defineStore(
  'system',
  () => {
    // 当前可切换布局
    const currentSwitchlayout = shallowRef(null)
    // 可切换布局列表
    const switchLayoutList = shallowRef([])

    // 初始化可切换布局方法
    const initSwitchLayout = list => {
      if (list && list.length > 0) {
        switchLayoutList.value = [...list]
        if (!currentSwitchlayout.value) {
          currentSwitchlayout.value = switchLayoutList.value[0]
        } else {
          currentSwitchlayout.value = switchLayoutList.value.find(
            item => item.name === currentSwitchlayout.value.name
          )
        }
      }
    }

    // 模式列表
    const modeList = ref([
      {
        name: 'auto',
        icon: markRaw(IconMdiThemeLightDark)
      },
      {
        name: 'light',
        icon: markRaw(IconMaterialSymbolsWbSunnyRounded)
      },
      {
        name: 'dark',
        icon: markRaw(IconMaterialSymbolsDarkModeRounded)
      }
    ])
    // 当前模式
    const currentMode = ref(null)
    const langueMode = ref(localStorage.getItem('langue') || 'ja-JP')
    const mode = useColorMode({
      attribute: 'arco-theme',
      emitAuto: true,
      selector: 'body',
      langue: langueMode.value?.name,
      initialValue: currentMode.value?.name,
      storageKey: null
    })
    watchEffect(() => (mode.value = currentMode.value?.name))

    // 语言列表
    const langueList = ref([
      {
        name: 'ja-JP',
        icon: 'japan_flag',
        title: '日本语'
      },
      {
        name: 'zh-CN',
        icon: 'china_flag',
        title: '中文简体'
      },
      {
        name: 'en-US',
        icon: 'united_states_of_america_flag',
        title: 'English'
      }
    ])
    watchEffect(() => (mode.value = langueMode.value?.name))
    // 初始化模式
    const initMode = () => {
      if (!currentMode.value) {
        currentMode.value = modeList.value[0]
      } else {
        currentMode.value = modeList.value.find(
          item => item.name === currentMode.value.name
        )
      }
      if (!langueMode.value) {
        langueMode.value = langueList.value[0]
      } else {
        langueMode.value = langueList.value.find(
          item => item.name === langueMode.value.name
        )
      }
    }

    return {
      currentMode,
      langueMode,
      modeList,
      langueList,
      initMode,

      currentSwitchlayout,
      switchLayoutList,
      initSwitchLayout
    }
  },
  {
    persist: {
      key: `${getConfig('appCode')}-pinia-system`,
      enabled: true,
      storage: window.localStorage,
      paths: ['currentSwitchlayout.name', 'currentMode.name']
    }
  }
)
