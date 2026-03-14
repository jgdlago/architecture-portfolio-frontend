<script setup lang="ts">
import { fetchDashboardStats, type DashboardStats } from '@/api/admin'
import { onMounted, ref } from 'vue'

const stats = ref<DashboardStats | null>(null)
const isLoading = ref(true)

onMounted(async () => {
    try {
        stats.value = await fetchDashboardStats()
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <div v-if="isLoading" class="loading">Carregando métricas...</div>

    <div v-else-if="stats" class="dashboard">
        <div class="cards">
            <div class="card">
                <span class="card-value">{{ stats.projects.total }}</span>
                <span class="card-label">Projetos Totais</span>
                <small>{{ stats.projects.published }} publicados · {{ stats.projects.drafts }} rascunhos</small>
            </div>
            <div class="card">
                <span class="card-value">{{ stats.messages.unread }}</span>
                <span class="card-label">Mensagens não lidas</span>
                <small>{{ stats.messages.total }} total</small>
            </div>
            <div class="card">
                <span class="card-value">{{ stats.visits.last_7_days }}</span>
                <span class="card-label">Visitantes únicos (7 dias)</span>
                <small>
                    {{ stats.visits.last_30_days }} únicos nos últimos 30 dias
                    <template v-if="stats.visits.page_views_last_30_days !== undefined">
                        · {{ stats.visits.page_views_last_30_days }} page views
                    </template>
                </small>
            </div>
        </div>

        <div class="panels">
            <div class="panel">
                <h3>Mensagens Recentes</h3>
                <ul v-if="stats.messages.recent.length" class="recent-list">
                    <li v-for="msg in stats.messages.recent" :key="msg.id">
                        <strong>{{ msg.name }}</strong> — {{ msg.email }}
                        <p>{{ msg.message.substring(0, 100) }}{{ msg.message.length > 100 ? '...' : '' }}</p>
                        <small>{{ new Date(msg.created_at).toLocaleString('pt-BR') }}</small>
                    </li>
                </ul>
                <p v-else class="empty">Nenhuma mensagem não lida.</p>
            </div>

            <div class="panel">
                <h3>Páginas Mais Acessadas (30 dias)</h3>
                <ul v-if="stats.visits.top_pages.length" class="top-pages">
                    <li v-for="page in stats.visits.top_pages" :key="page.page">
                        <span>{{ page.page }}</span>
                        <span class="badge">{{ page.unique_visitors ?? page.views }} únicos</span>
                    </li>
                </ul>
                <p v-else class="empty">Nenhum dado de acesso ainda.</p>
            </div>
        </div>

        <div v-if="stats.visits.daily.length" class="panel">
            <h3>Visitantes únicos por dia (30 dias)</h3>
            <div class="chart">
                <div v-for="day in stats.visits.daily" :key="day.date" class="bar-group">
                    <div class="bar"
                        :style="{ height: Math.max(4, ((day.unique_visitors ?? day.views) / Math.max(...stats!.visits.daily.map(d => d.unique_visitors ?? d.views))) * 100) + '%' }">
                    </div>
                    <small>{{ day.date.slice(5) }}</small>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.loading {
    padding: 2rem;
    color: var(--contrast-brown);
}

.dashboard {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

.card {
    background: color-mix(in srgb, var(--background) 90%, black 10%);
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    border-radius: 10px;
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
}

.card-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--contrast-gold);
}

.card-label {
    font-size: 0.85rem;
    font-weight: 600;
    margin-top: 0.2rem;
}

.card small {
    font-size: 0.75rem;
    color: var(--contrast-brown);
    margin-top: 0.3rem;
}

.panels {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
}

.panel {
    background: color-mix(in srgb, var(--background) 93%, black 7%);
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    border-radius: 10px;
    padding: 1.2rem;
}

.panel h3 {
    margin: 0 0 1rem;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--contrast-gold);
}

.recent-list,
.top-pages {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.recent-list li {
    border-bottom: 1px solid color-mix(in srgb, var(--contrast-brown) 15%, transparent);
    padding-bottom: 0.6rem;
}

.recent-list p {
    margin: 0.3rem 0;
    font-size: 0.85rem;
    color: var(--contrast-brown);
}

.recent-list small {
    color: var(--contrast-brown);
    font-size: 0.75rem;
}

.top-pages li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
}

.badge {
    background: color-mix(in srgb, var(--contrast-gold) 25%, transparent);
    color: var(--contrast-gold);
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
}

.empty {
    color: var(--contrast-brown);
    font-size: 0.85rem;
}

.chart {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 120px;
    overflow-x: auto;
}

.bar-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-width: 18px;
    height: 100%;
    justify-content: flex-end;
}

.bar {
    width: 100%;
    background: var(--contrast-gold);
    border-radius: 3px 3px 0 0;
    min-height: 4px;
}

.bar-group small {
    font-size: 0.55rem;
    color: var(--contrast-brown);
    margin-top: 2px;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    max-height: 35px;
}
</style>
