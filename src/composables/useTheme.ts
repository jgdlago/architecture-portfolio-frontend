import { onMounted, ref } from 'vue'

const isDark = ref(false)

export function useTheme() {
    const toggle = () => {
        isDark.value = !isDark.value
        updateTheme()
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
