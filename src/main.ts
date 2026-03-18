import '@/assets/styles/theme.css'
import { loadAndApplyTheme } from '@/composables/useCustomTheme'
import '@/style.css'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { useAuthStore } from './stores/auth'

registerSW({
    immediate: true,
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const auth = useAuthStore(pinia)

Promise.all([auth.bootstrap(), loadAndApplyTheme()]).finally(() => {
    app.mount('#app')
})
