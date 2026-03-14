import { http } from './http'

export interface HomeProjectItem {
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
}

export interface HomePayload {
    settings: Record<string, any>
    featured_projects: {
        data: HomeProjectItem[]
    }
}

export async function fetchHomeContent(): Promise<HomePayload> {
    const { data } = await http.get<HomePayload>('/home')
    return data
}
