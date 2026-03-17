import { onMounted, onUnmounted } from 'vue'

type RevealOptions = {
    threshold?: number
    rootMargin?: string
    once?: boolean
}

export function useScrollReveal(options: RevealOptions = {}) {
    let observer: IntersectionObserver | null = null

    const threshold = options.threshold ?? 0.15
    const rootMargin = options.rootMargin ?? '0px 0px -8% 0px'
    const once = options.once ?? true

    const observe = (selector = '.reveal-fade, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right') => {
        const nodes = document.querySelectorAll<HTMLElement>(selector)

        if (!nodes.length || !observer) {
            return
        }

        nodes.forEach((node, index) => {
            if (!node.style.transitionDelay) {
                node.style.transitionDelay = `${Math.min(index * 50, 300)}ms`
            }
            observer?.observe(node)
        })
    }

    onMounted(() => {
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed')
                        if (once) {
                            observer?.unobserve(entry.target)
                        }
                    } else if (!once) {
                        entry.target.classList.remove('revealed')
                    }
                })
            },
            { threshold, rootMargin },
        )

        observe()
    })

    onUnmounted(() => {
        observer?.disconnect()
        observer = null
    })

    return {
        observe,
    }
}
