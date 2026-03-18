import axios from 'axios'

const TOKEN_KEY = 'portfolio_token'

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

const bootToken = localStorage.getItem('portfolio_token')

if (bootToken) {
    http.defaults.headers.common.Authorization = `Bearer ${bootToken}`
}

http.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status

        if (status === 401) {
            localStorage.removeItem(TOKEN_KEY)
            delete http.defaults.headers.common.Authorization
        }

        return Promise.reject(error)
    },
)

export function resolveMediaUrl(path: string | null | undefined): string {
    if (!path) {
        return ''
    }

    if (/^https?:\/\//i.test(path)) {
        return path
    }

    const storageUrl = import.meta.env.VITE_STORAGE_URL
    if (storageUrl) {
        const normalizedPath = path.startsWith('/') ? path.slice(1) : path
        return `${String(storageUrl).replace(/\/$/, '')}/${normalizedPath}`
    }

    const apiBaseUrl = String(import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
    const appBaseUrl = apiBaseUrl.replace(/\/api$/i, '')
    const normalizedPath = path.startsWith('/') ? path : `/storage/${path}`

    return `${appBaseUrl}${normalizedPath}`
}
