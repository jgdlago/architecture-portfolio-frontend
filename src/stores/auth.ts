import { http } from '@/api/http';
import { defineStore } from 'pinia';

const TOKEN_KEY = 'portfolio_token'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any,
        token: localStorage.getItem(TOKEN_KEY) as string | null,
    }),

    actions: {
        applyToken(token: string | null) {
            this.token = token

            if (token) {
                localStorage.setItem(TOKEN_KEY, token)
                http.defaults.headers.common.Authorization = `Bearer ${token}`
                return
            }

            localStorage.removeItem(TOKEN_KEY)
            delete http.defaults.headers.common.Authorization
        },

        async bootstrap() {
            if (!this.token) {
                return
            }

            this.applyToken(this.token)

            try {
                const response = await http.get('/auth/me')
                this.user = response.data
            } catch {
                this.applyToken(null)
                this.user = null
            }
        },

        async login(data: { email: string; password: string }) {
            const response = await http.post('/auth/login', data)
            this.applyToken(response.data.token)
            this.user = response.data.user
        },

        async logout() {
            if (this.token) {
                await http.post('/auth/logout')
            }

            this.user = null
            this.applyToken(null)
        },
    },
})
