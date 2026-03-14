<script setup lang="ts">
import AdminCategories from '@/components/admin/AdminCategories.vue'
import AdminDashboard from '@/components/admin/AdminDashboard.vue'
import AdminMessages from '@/components/admin/AdminMessages.vue'
import AdminProjects from '@/components/admin/AdminProjects.vue'
import AdminSettings from '@/components/admin/AdminSettings.vue'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()

const activeTab = ref<'dashboard' | 'projects' | 'categories' | 'messages' | 'settings'>('dashboard')

const doLogout = async () => {
    await auth.logout()
    await router.push('/login')
}
</script>

<template>
    <main class="admin-page">
        <header class="topbar">
            <div>
                <h1>Painel Administrativo</h1>
                <p>Gerencie projetos, categorias, mensagens e conteúdo.</p>
            </div>
            <button class="logout" @click="doLogout">Sair</button>
        </header>

        <nav class="tabs">
            <button :class="{ active: activeTab === 'dashboard' }" @click="activeTab = 'dashboard'">Dashboard</button>
            <button :class="{ active: activeTab === 'projects' }" @click="activeTab = 'projects'">Projetos</button>
            <button :class="{ active: activeTab === 'categories' }" @click="activeTab = 'categories'">Categorias</button>
            <button :class="{ active: activeTab === 'messages' }" @click="activeTab = 'messages'">Mensagens</button>
            <button :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'">Conteúdo</button>
        </nav>

        <section class="tab-content">
            <AdminDashboard v-if="activeTab === 'dashboard'" />
            <AdminProjects v-else-if="activeTab === 'projects'" />
            <AdminCategories v-else-if="activeTab === 'categories'" />
            <AdminMessages v-else-if="activeTab === 'messages'" />
            <AdminSettings v-else />
        </section>
    </main>
</template>

<style scoped>
.admin-page {
    padding: var(--space-8);
    max-width: 1240px;
    margin: 0 auto;
}

.topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-4);
    margin-bottom: var(--space-4);
    padding: var(--space-4) var(--space-6);
    background: color-mix(in srgb, var(--background) 94%, black 6%);
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 16%, transparent);
    border-radius: 14px;
    box-shadow: var(--shadow-sm);
}

.topbar h1 {
    margin: 0;
    font-size: var(--text-xl);
}

.topbar p {
    margin: var(--space-1) 0 0;
    font-size: var(--text-sm);
    color: var(--contrast-brown);
}

.logout {
    border: none;
    border-radius: 10px;
    padding: 0.55rem 1rem;
    background: color-mix(in srgb, #b83333 25%, transparent);
    color: #b83333;
    font-weight: 600;
    cursor: pointer;
}

.tabs {
    display: flex;
    gap: var(--space-2);
    margin-bottom: var(--space-6);
    overflow-x: auto;
    padding-bottom: var(--space-1);
}

.tabs button {
    border: none;
    border-radius: 999px;
    padding: 0.6rem 1rem;
    font-size: var(--text-sm);
    font-weight: 600;
    white-space: nowrap;
    background: color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    color: var(--primary-text);
    cursor: pointer;
    transition: background var(--transition-fast), transform var(--transition-fast);
}

.tabs button.active {
    background: var(--contrast-gold);
}

.tabs button:hover {
    transform: translateY(-1px);
}

.tab-content {
    background: color-mix(in srgb, var(--background) 94%, black 6%);
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 15%, transparent);
    border-radius: 16px;
    padding: var(--space-6);
    box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
    .admin-page {
        padding: var(--space-4);
    }

    .topbar {
        flex-direction: column;
        align-items: flex-start;
        padding: var(--space-4);
    }

    .tab-content {
        padding: var(--space-4);
    }
}
</style>
