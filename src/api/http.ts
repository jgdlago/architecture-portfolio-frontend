import axios from 'axios'

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

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
