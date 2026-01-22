import { createApp } from 'vue'
import pinia from './stores'
import router from './router'
import App from './App.vue'
import './styles/main.scss'
import 'vant/lib/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
