import { http } from './http'

export interface ThemePalette {
    background: string
    surface: string
    surface_elevated: string
    primary_text: string
    contrast_gold: string
    contrast_brown: string
    accent: string
    hero_text: string
}

export interface ThemeColors {
    light: ThemePalette
    dark: ThemePalette
}

export interface ThemeTypography {
    font_heading: string
    font_body: string
    font_size_body: string
    line_height_body: string
}

export interface PublicThemePayload {
    theme_colors: ThemeColors | null
    theme_typography: ThemeTypography | null
}

export async function fetchPublicTheme(): Promise<PublicThemePayload> {
    const { data } = await http.get<PublicThemePayload>('/theme')
    return data
}
