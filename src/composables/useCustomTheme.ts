import { fetchPublicTheme, type ThemeColors, type ThemeTypography } from '@/api/theme'

const CUSTOM_THEME_STYLE_ID = 'custom-theme-vars'
const CUSTOM_THEME_FONTS_ID = 'custom-theme-fonts'

const DEFAULT_THEME_COLORS: ThemeColors = {
    light: {
        background: '#ECECEC',
        surface: '#f2f0ec',
        surface_elevated: '#f8f6f1',
        primary_text: '#333333',
        contrast_gold: '#B4A078',
        contrast_brown: '#8C857A',
        accent: '#6C7883',
        hero_text: '#ffffff',
    },
    dark: {
        background: '#1A1A1A',
        surface: '#211f1c',
        surface_elevated: '#2a2723',
        primary_text: '#FFFFFF',
        contrast_gold: '#A0895F',
        contrast_brown: '#6B6354',
        accent: '#5A6978',
        hero_text: '#ffffff',
    },
}

const DEFAULT_THEME_TYPOGRAPHY: ThemeTypography = {
    font_heading: 'Playfair Display',
    font_body: 'Inter',
    font_size_body: '1rem',
    line_height_body: '1.7',
}

const FALLBACK_HEADING_STACK = '"Times New Roman", serif'
const FALLBACK_BODY_STACK = '"Segoe UI", sans-serif'

const FONT_URL_WEIGHTS: Record<string, string> = {
    Inter: 'wght@300;400;500;600;700',
    'Playfair Display': 'wght@400;500;600;700',
    'Cormorant Garamond': 'wght@400;500;600;700',
    Lora: 'wght@400;500;600;700',
    Merriweather: 'wght@300;400;700',
    'DM Serif Display': 'wght@400',
    Roboto: 'wght@300;400;500;700',
    'Open Sans': 'wght@300;400;500;600;700',
    Lato: 'wght@300;400;700',
    'Source Sans 3': 'wght@300;400;500;600;700',
}

function isHexColor(value: unknown): value is string {
    return typeof value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(value)
}

function sanitizePalette(input: unknown, fallback: ThemeColors['light']): ThemeColors['light'] {
    if (!input || typeof input !== 'object') {
        return { ...fallback }
    }

    const source = input as Partial<ThemeColors['light']>

    return {
        background: isHexColor(source.background) ? source.background : fallback.background,
        surface: isHexColor(source.surface) ? source.surface : fallback.surface,
        surface_elevated: isHexColor(source.surface_elevated) ? source.surface_elevated : fallback.surface_elevated,
        primary_text: isHexColor(source.primary_text) ? source.primary_text : fallback.primary_text,
        contrast_gold: isHexColor(source.contrast_gold) ? source.contrast_gold : fallback.contrast_gold,
        contrast_brown: isHexColor(source.contrast_brown) ? source.contrast_brown : fallback.contrast_brown,
        accent: isHexColor(source.accent) ? source.accent : fallback.accent,
        hero_text: isHexColor(source.hero_text) ? source.hero_text : fallback.hero_text,
    }
}

function sanitizeTypography(input: unknown): ThemeTypography {
    if (!input || typeof input !== 'object') {
        return { ...DEFAULT_THEME_TYPOGRAPHY }
    }

    const source = input as Partial<ThemeTypography>

    return {
        font_heading: typeof source.font_heading === 'string' && source.font_heading.trim()
            ? source.font_heading.trim()
            : DEFAULT_THEME_TYPOGRAPHY.font_heading,
        font_body: typeof source.font_body === 'string' && source.font_body.trim()
            ? source.font_body.trim()
            : DEFAULT_THEME_TYPOGRAPHY.font_body,
        font_size_body: typeof source.font_size_body === 'string' && source.font_size_body.trim()
            ? source.font_size_body.trim()
            : DEFAULT_THEME_TYPOGRAPHY.font_size_body,
        line_height_body: typeof source.line_height_body === 'string' && source.line_height_body.trim()
            ? source.line_height_body.trim()
            : DEFAULT_THEME_TYPOGRAPHY.line_height_body,
    }
}

function ensureStyleTag(id: string): HTMLStyleElement {
    const existing = document.getElementById(id)
    if (existing instanceof HTMLStyleElement) {
        return existing
    }

    const styleTag = document.createElement('style')
    styleTag.id = id
    document.head.appendChild(styleTag)

    return styleTag
}

function ensureLinkTag(id: string): HTMLLinkElement {
    const existing = document.getElementById(id)
    if (existing instanceof HTMLLinkElement) {
        return existing
    }

    const linkTag = document.createElement('link')
    linkTag.id = id
    linkTag.rel = 'stylesheet'
    document.head.appendChild(linkTag)

    return linkTag
}

function quoteFont(font: string): string {
    return `"${font.replace(/"/g, '')}"`
}

function buildFontUrl(fonts: string[]): string {
    const uniqueFonts = [...new Set(fonts.map((font) => font.trim()).filter(Boolean))]
    const families = uniqueFonts
        .map((font) => {
            const weights = FONT_URL_WEIGHTS[font] ?? 'wght@400;500;600;700'
            return `family=${encodeURIComponent(font)}:${weights}`
        })
        .join('&')

    return `https://fonts.googleapis.com/css2?${families}&display=swap`
}

function applyFontLink(typography: ThemeTypography): void {
    const fontsLink = ensureLinkTag(CUSTOM_THEME_FONTS_ID)
    fontsLink.href = buildFontUrl([typography.font_heading, typography.font_body])
}

export function applyThemeSettings(colorsInput: unknown, typographyInput: unknown): {
    colors: ThemeColors
    typography: ThemeTypography
} {
    const colors: ThemeColors = {
        light: sanitizePalette((colorsInput as ThemeColors | null)?.light, DEFAULT_THEME_COLORS.light),
        dark: sanitizePalette((colorsInput as ThemeColors | null)?.dark, DEFAULT_THEME_COLORS.dark),
    }

    const typography = sanitizeTypography(typographyInput)

    const styleTag = ensureStyleTag(CUSTOM_THEME_STYLE_ID)
    styleTag.textContent = `
:root {
  --background: ${colors.light.background};
  --surface: ${colors.light.surface};
  --surface-elevated: ${colors.light.surface_elevated};
  --primary-text: ${colors.light.primary_text};
  --contrast-gold: ${colors.light.contrast_gold};
  --contrast-brown: ${colors.light.contrast_brown};
  --accent: ${colors.light.accent};
  --hero-text: ${colors.light.hero_text};
  --font-family-heading: ${quoteFont(typography.font_heading)}, ${FALLBACK_HEADING_STACK};
  --font-family-base: ${quoteFont(typography.font_body)}, ${FALLBACK_BODY_STACK};
  --font-size-body: ${typography.font_size_body};
  --line-height-body: ${typography.line_height_body};
}

.dark {
  --background: ${colors.dark.background};
  --surface: ${colors.dark.surface};
  --surface-elevated: ${colors.dark.surface_elevated};
  --primary-text: ${colors.dark.primary_text};
  --contrast-gold: ${colors.dark.contrast_gold};
  --contrast-brown: ${colors.dark.contrast_brown};
  --accent: ${colors.dark.accent};
  --hero-text: ${colors.dark.hero_text};
}
`.trim()

    applyFontLink(typography)

    return { colors, typography }
}

export async function loadAndApplyTheme(): Promise<void> {
    try {
        const payload = await fetchPublicTheme()
        applyThemeSettings(payload.theme_colors, payload.theme_typography)
    } catch {
        // Keep static CSS defaults if theme API is unavailable.
    }
}

export function getDefaultThemeSettings(): { colors: ThemeColors; typography: ThemeTypography } {
    return {
        colors: JSON.parse(JSON.stringify(DEFAULT_THEME_COLORS)) as ThemeColors,
        typography: { ...DEFAULT_THEME_TYPOGRAPHY },
    }
}
