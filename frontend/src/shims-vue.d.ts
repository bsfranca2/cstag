declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ElForm extends HTMLFormElement {
  validate: (cb?: (valid: boolean) => Promise<void> | void) => void
}

declare module 'vue-good-table'
