import { http } from './http'

export interface ProjectListItem {
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

export interface ProjectDetail {
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
    additional_info: Record<string, string> | null
    is_featured: boolean
    published_at: string | null
    images: Array<{
        id: number
        image_path: string
        alt_text: string | null
        caption: string | null
        sort_order: number
        is_cover: boolean
    }>
}

interface PaginatedProjects {
    data: ProjectListItem[]
}

export async function fetchProjects(category?: string): Promise<ProjectListItem[]> {
    const { data } = await http.get<PaginatedProjects>('/projects', {
        params: category ? { category, category_slug: category } : undefined,
    })

    return data.data
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectDetail> {
    const { data } = await http.get<{ data: ProjectDetail }>(`/projects/${slug}`)
    return data.data
}
