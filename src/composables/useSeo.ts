interface SeoPayload {
    title: string
    description: string
    image?: string | null
    path?: string
}

function ensureMetaTag(attribute: 'name' | 'property', value: string): HTMLMetaElement {
    let tag = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement | null

    if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attribute, value)
        document.head.appendChild(tag)
    }

    return tag
}

function ensureCanonicalTag(): HTMLLinkElement {
    let tag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null

    if (!tag) {
        tag = document.createElement('link')
        tag.setAttribute('rel', 'canonical')
        document.head.appendChild(tag)
    }

    return tag
}

export function applySeo(payload: SeoPayload): void {
    const { title, description, image, path } = payload

    document.title = title

    ensureMetaTag('name', 'description').setAttribute('content', description)
    ensureMetaTag('property', 'og:title').setAttribute('content', title)
    ensureMetaTag('property', 'og:description').setAttribute('content', description)
    ensureMetaTag('property', 'og:type').setAttribute('content', 'website')
    ensureMetaTag('name', 'twitter:card').setAttribute('content', image ? 'summary_large_image' : 'summary')
    ensureMetaTag('name', 'twitter:title').setAttribute('content', title)
    ensureMetaTag('name', 'twitter:description').setAttribute('content', description)

    if (image) {
        ensureMetaTag('property', 'og:image').setAttribute('content', image)
        ensureMetaTag('name', 'twitter:image').setAttribute('content', image)
    }

    const canonical = ensureCanonicalTag()
    const canonicalUrl = path ? `${window.location.origin}${path}` : window.location.href
    canonical.setAttribute('href', canonicalUrl)
}
