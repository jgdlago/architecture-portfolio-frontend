import { http } from '@/api/http'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const pageNames: Record<string, string> = {
    '/': 'Home',
    '/projects': 'Projetos',
    '/about': 'Sobre',
    '/contact': 'Contato',
    '/login': 'Login',
}

function getPageName(path: string): string {
    if (path.startsWith('/projects/')) return 'Projeto Detalhe'
    return pageNames[path] ?? path
}

export function usePageTracking() {
    const route = useRoute()

    const track = (path: string) => {
        const page = getPageName(path)
        http.post('/track-visit', { page, path }).catch(() => { })
    }

    onMounted(() => track(route.path))

    watch(() => route.path, (newPath) => {
        track(newPath)
    })
}
