<script setup lang="ts">
import { fetchDashboardStats, type DashboardStats } from '@/api/admin'
import {
    ChartBarIcon,
    FolderOpenIcon,
    InboxStackIcon,
} from '@heroicons/vue/24/outline'
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
    <section v-if="isLoading" class="dashboard-loading">
        <div v-for="index in 3" :key="index" class="skeleton skeleton-image" style="min-height: 120px;" />
    </section>

    <div v-else-if="stats" class="dashboard">
        <div class="cards">
            <div class="card">
                <FolderOpenIcon class="card-icon" />
                <span class="card-value">{{ stats.projects.total }}</span>
                <span class="card-label">Projetos totais</span>
                <small>{{ stats.projects.published }} publicados · {{ stats.projects.drafts }} rascunhos</small>
            </div>
            <div class="card">
                <InboxStackIcon class="card-icon" />
                <span class="card-value">{{ stats.messages.unread }}</span>
                <span class="card-label">Mensagens não lidas</span>
                <small>{{ stats.messages.total }} no total</small>
            </div>
            <div class="card">
                <ChartBarIcon class="card-icon" />
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
                <h3>Mensagens recentes</h3>
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
                <h3>Páginas mais acessadas (30 dias)</h3>
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
.dashboard-loading {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-4);
}

.dashboard {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
}

.cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-4);
}

.card {
    position: relative;
    background: color-mix(in srgb, var(--surface) 95%, black 5%);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-4) var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    box-shadow: var(--shadow-sm);
    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
}

.card-icon {
    width: 18px;
    height: 18px;
    color: var(--contrast-brown);
    margin-bottom: var(--space-1);
}

.card-value {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
    color: var(--contrast-gold);
}

.card-label {
    font-size: 0.85rem;
    font-weight: 600;
    line-height: 1.3;
}

.card small {
    font-size: 0.75rem;
    color: var(--contrast-brown);
    margin-top: var(--space-2);
    line-height: 1.45;
}

.panels {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
}

.panel {
    background: color-mix(in srgb, var(--surface) 94%, black 6%);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    box-shadow: var(--shadow-sm);
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
    height: 130px;
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
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--contrast-gold) 90%, white 10%),
        color-mix(in srgb, var(--contrast-gold) 72%, var(--contrast-brown) 28%)
    );
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

@media (max-width: 900px) {
    .cards {
        grid-template-columns: 1fr;
    }

    .dashboard-loading {
        grid-template-columns: 1fr;
    }
}
</style>
