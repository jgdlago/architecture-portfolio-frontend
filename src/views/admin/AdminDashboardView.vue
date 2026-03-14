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
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.topbar h1 {
    margin: 0;
    font-size: 1.3rem;
}

.topbar p {
    margin: 0.3rem 0 0;
    font-size: 0.9rem;
    color: var(--contrast-brown);
}

.logout {
    border: none;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    background: color-mix(in srgb, #b83333 25%, transparent);
    color: #b83333;
    font-weight: 600;
    cursor: pointer;
}

.tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.tabs button {
    border: none;
    border-radius: 8px;
    padding: 0.55rem 1rem;
    font-size: 0.85rem;
    background: color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    color: var(--primary-text);
    cursor: pointer;
    transition: background 0.2s;
}

.tabs button.active {
    background: var(--contrast-gold);
}

.tab-content {
    background: color-mix(in srgb, var(--background) 95%, black 5%);
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 15%, transparent);
    border-radius: 12px;
    padding: 1.5rem;
}

@media (max-width: 768px) {
    .admin-page {
        padding: 1rem;
    }

    .topbar {
        flex-direction: column;
        align-items: flex-start;
    }

    .tab-content {
        padding: 1rem;
    }
}
</style>
