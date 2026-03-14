import { http } from '@/api/http';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any,
        token: null as string | null,
    }),

    actions: {
        async login(data: { email: string; password: string }) {
            const response = await http.post('/auth/login', data)
            this.token = response.data.token
            http.defaults.headers.common.Authorization = `Bearer ${this.token}`
        },

        async logout() {
            await http.post('/auth/logout')
            this.user = null
            this.token = null
            delete http.defaults.headers.common.Authorization
        },
    },
})
