<script setup lang="ts">
import AdminCategories from '@/components/admin/AdminCategories.vue'
import AdminCustomization from '@/components/admin/AdminCustomization.vue'
import AdminDashboard from '@/components/admin/AdminDashboard.vue'
import AdminMessages from '@/components/admin/AdminMessages.vue'
import AdminProfile from '@/components/admin/AdminProfile.vue'
import AdminProjects from '@/components/admin/AdminProjects.vue'
import AdminSettings from '@/components/admin/AdminSettings.vue'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/auth'
import {
    Bars3Icon,
    Cog6ToothIcon,
    FolderIcon,
    HomeIcon,
    InboxIcon,
    MoonIcon,
    RectangleGroupIcon,
    SunIcon,
    SwatchIcon,
    UserCircleIcon,
    XMarkIcon,
} from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()
const { isDark, toggle } = useTheme()

const activeTab = ref<'dashboard' | 'projects' | 'categories' | 'messages' | 'settings' | 'customization' | 'profile'>('dashboard')
const mobileMenuOpen = ref(false)

const navItems: Array<{ key: typeof activeTab.value; label: string; icon: any }> = [
    { key: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { key: 'projects', label: 'Projetos', icon: FolderIcon },
    { key: 'categories', label: 'Categorias', icon: RectangleGroupIcon },
    { key: 'messages', label: 'Mensagens', icon: InboxIcon },
    { key: 'settings', label: 'Conteudo', icon: Cog6ToothIcon },
    { key: 'customization', label: 'Aparencia', icon: SwatchIcon },
    { key: 'profile', label: 'Perfil', icon: UserCircleIcon },
]

const doLogout = async () => {
    await auth.logout()
    await router.push('/login')
}

const selectTab = (tab: typeof activeTab.value) => {
    activeTab.value = tab
    mobileMenuOpen.value = false
}
</script>

<template>
    <main class="admin-page">
        <button class="mobile-trigger" @click="mobileMenuOpen = true" aria-label="Abrir menu administrativo">
            <Bars3Icon />
            <span>Menu</span>
        </button>

        <aside class="sidebar" :class="{ open: mobileMenuOpen }">
            <div class="sidebar-head">
                <h1>Painel</h1>
                <p>{{ auth.user?.name || 'Administrador' }}</p>
                <button class="sidebar-close" @click="mobileMenuOpen = false" aria-label="Fechar menu">
                    <XMarkIcon />
                </button>
            </div>

            <nav class="sidebar-nav">
                <button v-for="item in navItems" :key="item.key" :class="{ active: activeTab === item.key }" @click="selectTab(item.key)">
                    <component :is="item.icon" />
                    <span>{{ item.label }}</span>
                </button>
            </nav>

            <button class="logout" @click="doLogout">Sair</button>
        </aside>

        <div v-if="mobileMenuOpen" class="sidebar-overlay" @click="mobileMenuOpen = false" />

        <section class="content-area">
            <header class="content-header">
                <div class="content-header-row">
                    <h2>{{ navItems.find((item) => item.key === activeTab)?.label }}</h2>
                    <button class="theme-toggle" @click="toggle($event)" aria-label="Alternar tema">
                        <SunIcon v-if="isDark" />
                        <MoonIcon v-else />
                    </button>
                </div>
                <p>Gerencie projetos, categorias, mensagens e configuracoes do site.</p>
            </header>

            <div class="tab-content">
                <AdminDashboard v-if="activeTab === 'dashboard'" />
                <AdminProjects v-else-if="activeTab === 'projects'" />
                <AdminCategories v-else-if="activeTab === 'categories'" />
                <AdminMessages v-else-if="activeTab === 'messages'" />
                <AdminSettings v-else-if="activeTab === 'settings'" />
                <AdminCustomization v-else-if="activeTab === 'customization'" />
                <AdminProfile v-else />
            </div>
        </section>
    </main>
</template>

<style scoped>
.admin-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    gap: var(--space-6);
    padding: var(--space-6);
    max-width: var(--container-xl);
    margin: 0 auto;
}

.mobile-trigger {
    display: none;
    align-self: start;
    justify-self: start;
}

.sidebar {
    position: sticky;
    top: var(--space-6);
    align-self: start;
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: var(--space-6);
    min-height: calc(100vh - var(--space-12));
    padding: var(--space-6);
    background: color-mix(in srgb, var(--surface-elevated) 95%, black 5%);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
}

.sidebar-head {
    position: relative;
}

.sidebar-head h1 {
    margin: 0;
    font-family: var(--font-family-heading);
    font-size: 1.8rem;
}

.sidebar-head p {
    margin: var(--space-2) 0 0;
    font-size: var(--text-sm);
    color: var(--contrast-brown);
}

.sidebar-close {
    display: none;
}

.sidebar-nav {
    display: grid;
    gap: var(--space-2);
}

.sidebar-nav button {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    width: 100%;
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    padding: 0.62rem 0.7rem;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 600;
    background: transparent;
    color: var(--primary-text);
    cursor: pointer;
    transition: background var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
}

.sidebar-nav button svg {
    width: 17px;
    height: 17px;
    color: var(--contrast-brown);
}

.sidebar-nav button.active {
    background: color-mix(in srgb, var(--contrast-gold) 24%, transparent);
    border-color: color-mix(in srgb, var(--contrast-gold) 60%, transparent);
}

.sidebar-nav button.active svg {
    color: var(--contrast-gold);
}

.sidebar-nav button:hover {
    transform: translateX(2px);
    border-color: var(--border);
}

.logout {
    border: none;
    border-radius: var(--radius-md);
    padding: 0.62rem 0.9rem;
    background: color-mix(in srgb, #b83333 26%, transparent);
    color: #b83333;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.72rem;
    cursor: pointer;
}

.content-area {
    min-width: 0;
}

.content-header {
    margin-bottom: var(--space-4);
}

.content-header h2 {
    margin: 0;
    font-family: var(--font-family-heading);
    font-size: clamp(1.8rem, 3.5vw, 2.4rem);
}

.content-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
}

.theme-toggle {
    display: inline-grid;
    place-items: center;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: color-mix(in srgb, var(--surface) 95%, transparent);
    color: var(--primary-text);
    width: 2.1rem;
    height: 2.1rem;
    padding: 0;
    cursor: pointer;
    transition: transform var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast);
}

.theme-toggle svg {
    width: 15px;
    height: 15px;
}

.theme-toggle:hover {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--contrast-gold) 62%, transparent);
    background: color-mix(in srgb, var(--contrast-gold) 14%, var(--surface));
}

.content-header p {
    margin: var(--space-2) 0 0;
    color: var(--contrast-brown);
    font-size: var(--text-sm);
}

.tab-content {
    background: color-mix(in srgb, var(--surface-elevated) 96%, black 4%);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    box-shadow: var(--shadow-lg);
}

.sidebar-overlay {
    display: none;
}

@media (max-width: 1024px) {
    .admin-page {
        grid-template-columns: 1fr;
        padding: var(--space-4);
    }

    .mobile-trigger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: color-mix(in srgb, var(--surface) 95%, transparent);
        padding: 0.45rem 0.85rem;
        color: var(--primary-text);
        width: auto;
        min-height: 2.25rem;
        max-height: 2.25rem;
        white-space: nowrap;
        flex: 0 0 auto;
        align-self: start;
        justify-self: start;
        cursor: pointer;
    }

    .mobile-trigger svg {
        width: 16px;
        height: 16px;
    }

    .sidebar {
        position: fixed;
        inset: 0 auto 0 0;
        width: min(320px, 88vw);
        z-index: 140;
        min-height: 100vh;
        border-radius: 0;
        transform: translateX(-102%);
        transition: transform 0.35s ease;
        top: 0;
    }

    .sidebar.open {
        transform: translateX(0);
    }

    .sidebar-close {
        position: absolute;
        right: 0;
        top: 0;
        width: 2rem;
        height: 2rem;
        display: grid;
        place-items: center;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: transparent;
        color: var(--primary-text);
    }

    .sidebar-close svg {
        width: 15px;
        height: 15px;
    }

    .sidebar-overlay {
        display: block;
        position: fixed;
        inset: 0;
        z-index: 130;
        background: rgba(0, 0, 0, 0.36);
        backdrop-filter: blur(2px);
    }

    .tab-content {
        padding: var(--space-4);
    }

    .tab-content {
        padding: var(--space-4);
    }
}
</style>
