import { createApp } from 'vue'
import pinia from './stores'
import router, { setupAuthGuards } from './router'
import i18n from './locales'
import { useAppStore } from './stores/useAppStore'
import App from './App.vue'
import './styles/main.scss'
import 'vant/lib/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)

const appStore = useAppStore()
appStore.initLocale()

// Setup auth guards
setupAuthGuards(router)

app.mount('#app')
