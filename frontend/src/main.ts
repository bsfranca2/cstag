import { createApp } from 'vue'
import App from './app.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import TheMask from 'vue-the-mask'

import './style/index.scss'

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import locale from 'element-plus/lib/locale/lang/pt-br'
import 'dayjs/locale/pt-br'

const app = createApp(App)

app.use(store)
  .use(router)
  .use(ElementPlus, { locale })

app.use(TheMask as any)

app.mount('#app')
