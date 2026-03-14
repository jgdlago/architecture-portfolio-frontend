import { http } from '@/api/http'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const VISITOR_STORAGE_KEY = 'portfolio_visitor_id'

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

function createVisitorId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID()
    }

    return `v-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
}

function getVisitorId(): string {
    const current = localStorage.getItem(VISITOR_STORAGE_KEY)
    if (current) {
        return current
    }

    const created = createVisitorId()
    localStorage.setItem(VISITOR_STORAGE_KEY, created)
    return created
}

export function usePageTracking() {
    const route = useRoute()
    const visitorId = getVisitorId()

    const track = (path: string) => {
        const page = getPageName(path)
        http.post('/track-visit', { page, path, visitor_id: visitorId }, {
            headers: {
                'X-Visitor-Id': visitorId,
            },
        }).catch(() => { })
    }

    onMounted(() => track(route.path))

    watch(() => route.path, (newPath) => {
        track(newPath)
    })
}
