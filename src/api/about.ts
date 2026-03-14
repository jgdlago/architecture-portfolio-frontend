import { http } from './http'

export interface AboutPayload {
    profile: {
        id: number
        user_id: number
        bio: string | null
        headline: { value: string; label: string } | null
        city: { id: number; name: string; state_abbreviation: string } | null
        years_experience: number | null
        avatar_path: string | null
    } | null
    experiences: Array<{
        id: number
        title: string
        company: string | null
        start_date: string
        end_date: string | null
        is_current: boolean
    }>
    settings: {
        text?: string
        image_path?: string | null
    } | null
    user: {
        name: string
        cau: string | null
    } | null
}

export async function fetchAboutContent(): Promise<AboutPayload> {
    const { data } = await http.get<AboutPayload>('/about')
    return data
}
