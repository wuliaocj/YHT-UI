/// <reference types="vite/client" />

// 声明.vue文件模块，解决TS无法识别Vue组件的问题
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}