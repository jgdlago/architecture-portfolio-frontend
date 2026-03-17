import { http, resolveMediaUrl } from './http'

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
    description: string | null
    category: string | null
    category_slug: string | null
    cover_image_path: string | null
    location: string | null
    year: number | null
    area_m2: string | null
    is_featured: boolean
    published_at: string | null
}

export interface AdminProjectDetail {
    id: number
    title: string
    slug: string
    short_description: string | null
    description: string | null
    category: {
        id: number
        name: string
        slug: string
    } | null
    cover_image_path: string | null
    location: string | null
    year: number | null
    area_m2: string | null
    is_featured: boolean
    published_at: string | null
    images?: AdminProjectImage[]
}

export interface AdminProjectImage {
    id: number
    image_path: string
    alt_text: string | null
    caption: string | null
    sort_order: number
    is_cover: boolean
}

export interface AdminMessage {
    id: number
    name: string
    email: string
    phone: string | null
    subject: string | null
    message: string
    is_read: boolean
    created_at: string
}

export interface DashboardStats {
    projects: { published: number; drafts: number; total: number }
    messages: {
        unread: number
        total: number
        recent: Array<{ id: number; name: string; email: string; subject: string | null; message: string; created_at: string }>
    }
    visits: {
        last_7_days: number
        last_30_days: number
        page_views_last_7_days?: number
        page_views_last_30_days?: number
        top_pages: Array<{ page: string; views: number; unique_visitors?: number }>
        daily: Array<{ date: string; views: number; unique_visitors?: number }>
    }
}

export interface AdminAccount {
    id: number
    name: string
    email: string
    cau: string | null
}

// Dashboard
export async function fetchDashboardStats(): Promise<DashboardStats> {
    const { data } = await http.get<DashboardStats>('/admin/dashboard/stats')
    return data
}

// Account
export async function fetchAdminAccount(): Promise<AdminAccount> {
    const { data } = await http.get<AdminAccount>('/auth/me')
    return data
}

export async function updateAdminAccount(payload: {
    name: string
    email: string
    cau?: string | null
    current_password?: string
}): Promise<AdminAccount> {
    const { data } = await http.put<{ user: AdminAccount }>('/admin/account', payload)
    return data.user
}

export async function updateAdminAccountPassword(payload: {
    current_password: string
    password: string
    password_confirmation: string
}): Promise<void> {
    await http.put('/admin/account/password', payload)
}

// Categories
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

export async function deleteAdminCategory(id: number): Promise<void> {
    await http.delete(`/admin/project-categories/${id}`)
}

// Projects
export async function fetchAdminProjects(): Promise<AdminProject[]> {
    const { data } = await http.get<{ data: AdminProject[] }>('/admin/projects')
    return data.data
}

export async function fetchAdminProject(id: number): Promise<AdminProjectDetail> {
    const { data } = await http.get<{ data: AdminProjectDetail }>(`/admin/projects/${id}`)
    return data.data
}

export async function createAdminProject(payload: Record<string, any>): Promise<AdminProject> {
    const { data } = await http.post<{ data: AdminProject }>('/admin/projects', payload)
    return data.data
}

export async function updateAdminProject(id: number, payload: Record<string, any>): Promise<AdminProject> {
    const { data } = await http.put<{ data: AdminProject }>(`/admin/projects/${id}`, payload)
    return data.data
}

export async function deleteAdminProject(id: number): Promise<void> {
    await http.delete(`/admin/projects/${id}`)
}

// Project Images
export async function fetchProjectImages(projectId: number): Promise<AdminProjectImage[]> {
    const { data } = await http.get<{ data: AdminProjectImage[] }>(`/admin/projects/${projectId}/images`)
    return data.data
}

export async function addProjectImage(projectId: number, payload: Record<string, any>): Promise<AdminProjectImage> {
    const { data } = await http.post<{ data: AdminProjectImage }>(`/admin/projects/${projectId}/images`, payload)
    return data.data
}

export async function updateProjectImage(
    projectId: number,
    imageId: number,
    payload: Record<string, any>
): Promise<AdminProjectImage> {
    const { data } = await http.put<{ data: AdminProjectImage }>(`/admin/projects/${projectId}/images/${imageId}`, payload)
    return data.data
}

export async function deleteProjectImage(projectId: number, imageId: number): Promise<void> {
    await http.delete(`/admin/projects/${projectId}/images/${imageId}`)
}

// File Upload
export async function uploadFile(file: File, folder?: string): Promise<{ path: string; url: string }> {
    const formData = new FormData()
    formData.append('file', file)
    if (folder) formData.append('folder', folder)
    const { data } = await http.post<{ path: string; url: string }>('/admin/upload', formData)
    return {
        path: data.path,
        url: resolveMediaUrl(data.path || data.url),
    }
}

export async function deleteFile(path: string): Promise<void> {
    await http.delete('/admin/upload', { data: { path } })
}

// Messages
export async function fetchAdminMessages(): Promise<AdminMessage[]> {
    const { data } = await http.get<{ data: AdminMessage[] }>('/admin/contact-messages')
    return data.data
}

export async function markMessageAsRead(id: number): Promise<void> {
    await http.put(`/admin/contact-messages/${id}`, { is_read: true })
}

export async function deleteAdminMessage(id: number): Promise<void> {
    await http.delete(`/admin/contact-messages/${id}`)
}

// Settings
export async function fetchAdminSettings(): Promise<Array<{ id: number; key: string; value: any }>> {
    const { data } = await http.get<Array<{ id: number; key: string; value: any }>>('/admin/site-settings')
    return data
}

export async function upsertAdminSetting(key: string, value: any): Promise<void> {
    await http.post('/admin/site-settings/upsert', { key, value })
}
