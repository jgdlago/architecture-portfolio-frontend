import { http } from './http'

export interface AdminCategory {
    id: number
    name: string
    slug: string
    sort_order: number
    is_active: boolean
}

export interface AdminProject {
    id: number
    title: string
    slug: string
    short_description: string | null
    category: string | null
    category_slug: string | null
    cover_image_path: string | null
    location: string | null
    year: number | null
    is_featured: boolean
    published_at: string | null
}

export interface AdminMessage {
    id: number
    name: string
    email: string
    message: string
    is_read: boolean
    created_at: string
}

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
    const { data } = await http.get<AdminCategory[]>('/admin/project-categories')
    return data
}

export async function createAdminCategory(payload: {
    name: string
    slug: string
    sort_order?: number
    is_active?: boolean
}): Promise<AdminCategory> {
    const { data } = await http.post<AdminCategory>('/admin/project-categories', payload)
    return data
}

export async function fetchAdminProjects(): Promise<AdminProject[]> {
    const { data } = await http.get<{ data: AdminProject[] }>('/admin/projects')
    return data.data
}

export async function createAdminProject(payload: Record<string, any>): Promise<void> {
    await http.post('/admin/projects', payload)
}

export async function deleteAdminProject(id: number): Promise<void> {
    await http.delete(`/admin/projects/${id}`)
}

export async function fetchAdminMessages(): Promise<AdminMessage[]> {
    const { data } = await http.get<{ data: AdminMessage[] }>('/admin/contact-messages')
    return data.data
}

export async function markMessageAsRead(id: number): Promise<void> {
    await http.put(`/admin/contact-messages/${id}`, { is_read: true })
}

export async function fetchAdminSettings(): Promise<Array<{ id: number; key: string; value: any }>> {
    const { data } = await http.get<Array<{ id: number; key: string; value: any }>>('/admin/site-settings')
    return data
}

export async function upsertAdminSetting(key: string, value: any): Promise<void> {
    await http.post('/admin/site-settings/upsert', { key, value })
}
