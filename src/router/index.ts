import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { guestOnly: true },
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('@/views/admin/AdminDashboardView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/projects',
        name: 'projects',
        component: () => import('@/views/ProjectsView.vue'),
    },
    {
        path: '/projects/:slug',
        name: 'project-detail',
        component: () => import('@/views/ProjectDetailView.vue'),
    },
    {
        path: '/about',
        name: 'about',
        redirect: { path: '/', hash: '#about' },
    },
    {
        path: '/contact',
        name: 'contact',
        redirect: { path: '/', hash: '#contact' },
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            }
        }

        return {
            top: 0,
            behavior: 'smooth',
        }
    },
})

router.beforeEach((to) => {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.token) {
        return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.meta.guestOnly && auth.token) {
        return { name: 'admin' }
    }

    return true
})
