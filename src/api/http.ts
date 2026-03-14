import axios from 'axios'

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

const bootToken = localStorage.getItem('portfolio_token')

if (bootToken) {
    http.defaults.headers.common.Authorization = `Bearer ${bootToken}`
}

export function resolveMediaUrl(path: string | null | undefined): string {
    if (!path) {
        return ''
    }

    if (/^https?:\/\//i.test(path)) {
        return path
    }

    const apiBaseUrl = String(import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
    const appBaseUrl = apiBaseUrl.replace(/\/api$/i, '')
    const normalizedPath = path.startsWith('/') ? path : `/storage/${path}`

    return `${appBaseUrl}${normalizedPath}`
}
