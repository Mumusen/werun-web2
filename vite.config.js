/*
 * @LastEditors: isboyjc
 * @Description: Vite 项目配置
 * @Date: 2022-09-17 14:35:02
 * @LastEditTime: 2022-11-24 01:20:18
 * @Author: isboyjc
 */
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// API自动引入插件
import AutoImport from 'unplugin-auto-import/vite'
// 组件自动引入插件
import Components from 'unplugin-vue-components/vite'
// ArcoVue、VueUse 组件和指令自动引入解析器
import {
  ArcoResolver,
  VueUseComponentsResolver,
  VueUseDirectiveResolver
} from 'unplugin-vue-components/resolvers'
// icon 插件
import Icons from 'unplugin-icons/vite'
// icon 自动引入解析器
import IconsResolver from 'unplugin-icons/resolver'
// icon 加载 loader
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
// Unocss 插件
import Unocss from 'unocss/vite'
// Unocss 默认预设
import presetUno from '@unocss/preset-uno'
// Unocss 属性模式预设
import presetAttributify from '@unocss/preset-attributify'
// Unocss 指令插件
import transformerDirective from '@unocss/transformer-directives'
// 去除打印
import { terser } from 'rollup-plugin-terser'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, './')
  return {
    base: viteEnv.VITE_BASE,
    // css: {
    //   preprocessorOptions: {
    //     less: {
    //       modifyVars: {
    //         'arcoblue-6': '#67b74e'
    //         // 'dark-primary-6': `rgb(var(~'@{arco-cssvars-prefix}-green-6'))`
    //       },
    //       javascriptEnabled: true
    //     }
    //   }
    // },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'color-primary-6': '#746CE8',
            'link-6': '#746CE8'
          }
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: '8081',
      open: true,
      // 端口占用直接退出
      strictPort: true,
      // 本地服务 CORS 是否开启
      cors: true,
      proxy: {
        [viteEnv.VITE_BASE_URL]: {
          target: viteEnv.VITE_BASE_SERVER_URL,
          // 允许跨域
          changeOrigin: true,
          rewrite: path => path.replace(viteEnv.VITE_BASE_URL, '/')
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static/assets',
      // sourcemap: true,
      // 规定触发警告的 chunk 大小，消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      // 静态资源打包到dist下的不同目录
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    plugins: [
      vue(),
      // 使用Unocss
      Unocss({
        // 预设
        presets: [presetUno(), presetAttributify()],
        // 指令转换插件
        transformers: [transformerDirective()],
        // 自定义规则
        rules: []
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        imports: ['vue', 'pinia', 'vue-router', '@vueuse/core'],
        // 生成相应的自动导入json文件。
        // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
        resolvers: [ArcoResolver()]
      }),
      Components({
        // imports 指定组件所在位置，默认为 src/components
        dirs: ['src/components/', 'src/views/', 'src/layout'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          ArcoResolver({
            importStyle: 'less',
            sideEffect: true
          }),
          VueUseComponentsResolver(),
          VueUseDirectiveResolver(),
          IconsResolver({
            // icon自动引入的组件前缀 - 为了统一组件icon组件名称格式
            prefix: 'icon',
            // 自定义的icon模块集合
            customCollections: ['user', 'home']
          })
        ]
      }),
      Icons({
        compiler: 'vue3',
        customCollections: {
          // user图标集，给svg文件设置fill="currentColor"属性，使图标的颜色具有适应性
          user: FileSystemIconLoader('src/assets/svg/user', svg =>
            svg.replace(/^<svg /, '<svg fill="currentColor" ')
          ),
          // home 模块图标集
          home: FileSystemIconLoader('src/assets/svg/home', svg =>
            svg.replace(/^<svg /, '<svg fill="currentColor" ')
          )
        },
        autoInstall: true
      }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['debugger']
        }
      })
    ]
  }
})
