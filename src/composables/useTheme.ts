import { onMounted, ref } from 'vue'

const isDark = ref(false)
let transitionTimer: number | null = null

export function useTheme() {
    const toggle = (event?: MouseEvent) => {
        startThemeTransition(event)
        isDark.value = !isDark.value
        updateTheme()
    }

    const startThemeTransition = (event?: MouseEvent) => {
        const html = document.documentElement
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (reduceMotion) {
            return
        }

        const originX = event?.clientX ?? window.innerWidth / 2
        const originY = event?.clientY ?? window.innerHeight / 2

        html.style.setProperty('--theme-origin-x', `${originX}px`)
        html.style.setProperty('--theme-origin-y', `${originY}px`)

        html.classList.add('theme-transitioning')

        if (transitionTimer !== null) {
            window.clearTimeout(transitionTimer)
        }

        transitionTimer = window.setTimeout(() => {
            html.classList.remove('theme-transitioning')
            transitionTimer = null
        }, 560)
    }

    const updateTheme = () => {
        const html = document.documentElement

        if (isDark.value) {
            html.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            html.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    onMounted(() => {
        const stored = localStorage.getItem('theme')
        isDark.value = stored === 'dark'
        updateTheme()
    })

    return {
        isDark,
        toggle,
    }
}
