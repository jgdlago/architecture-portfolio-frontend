<script setup lang="ts">
import {
    deleteAdminMessage,
    fetchAdminMessages,
    markMessageAsRead,
    type AdminMessage,
} from '@/api/admin'
import { useToast } from '@/composables/useToast'
import { onMounted, ref } from 'vue'

const toast = useToast()
const messages = ref<AdminMessage[]>([])
const isLoading = ref(true)
const expandedId = ref<number | null>(null)

const load = async () => {
    isLoading.value = true
    try {
        messages.value = await fetchAdminMessages()
    } finally {
        isLoading.value = false
    }
}

const toggleExpand = (id: number) => {
    expandedId.value = expandedId.value === id ? null : id
}

const setRead = async (msg: AdminMessage) => {
    try {
        await markMessageAsRead(msg.id)
        msg.is_read = true
        toast.success('Mensagem marcada como lida.')
    } catch {
        toast.error('Erro ao atualizar mensagem.')
    }
}

const remove = async (id: number) => {
    if (!confirm('Excluir esta mensagem?')) return
    try {
        await deleteAdminMessage(id)
        messages.value = messages.value.filter(m => m.id !== id)
        toast.success('Mensagem excluída.')
    } catch {
        toast.error('Erro ao excluir mensagem.')
    }
}

onMounted(load)
</script>

<template>
    <div v-if="isLoading" class="loading">Carregando mensagens...</div>

    <div v-else>
        <h2>Mensagens de Contato</h2>

        <div v-if="!messages.length" class="empty">Nenhuma mensagem recebida.</div>

        <ul class="message-list">
            <li v-for="msg in messages" :key="msg.id" :class="{ unread: !msg.is_read }" @click="toggleExpand(msg.id)">
                <div class="msg-header">
                    <div class="msg-info">
                        <strong>{{ msg.name }}</strong>
                        <span class="msg-email">{{ msg.email }}</span>
                        <span v-if="msg.phone" class="msg-phone">{{ msg.phone }}</span>
                    </div>
                    <div class="msg-meta">
                        <span v-if="!msg.is_read" class="badge unread-badge">Nova</span>
                        <span v-else class="badge read-badge">Lida</span>
                        <small>{{ new Date(msg.created_at).toLocaleString('pt-BR') }}</small>
                    </div>
                </div>

                <div v-if="msg.subject" class="msg-subject">{{ msg.subject }}</div>

                <div v-if="expandedId === msg.id" class="msg-body">
                    <p>{{ msg.message }}</p>
                    <div class="msg-actions">
                        <button v-if="!msg.is_read" @click.stop="setRead(msg)">Marcar como lida</button>
                        <button class="danger" @click.stop="remove(msg.id)">Excluir</button>
                    </div>
                </div>
                <p v-else class="msg-preview">{{ msg.message.substring(0, 120) }}{{ msg.message.length > 120 ? '...' : '' }}</p>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.loading,
.empty {
    padding: 1rem;
    color: var(--contrast-brown);
}

h2 {
    font-size: 1rem;
    margin: 0 0 1rem;
}

.message-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.message-list li {
    padding: 0.8rem;
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.2s;
}

.message-list li:hover {
    border-color: color-mix(in srgb, var(--contrast-brown) 40%, transparent);
}

.message-list li.unread {
    border-left: 3px solid var(--contrast-gold);
}

.msg-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
}

.msg-info {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
}

.msg-email {
    color: var(--contrast-brown);
    font-size: 0.85rem;
}

.msg-phone {
    color: var(--contrast-brown);
    font-size: 0.8rem;
}

.msg-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
}

.msg-meta small {
    color: var(--contrast-brown);
    font-size: 0.75rem;
}

.badge {
    font-size: 0.65rem;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    font-weight: 600;
}

.unread-badge {
    background: color-mix(in srgb, var(--contrast-gold) 25%, transparent);
    color: var(--contrast-gold);
}

.read-badge {
    background: color-mix(in srgb, #2d913f 20%, transparent);
    color: #2d913f;
}

.msg-subject {
    font-weight: 500;
    font-size: 0.9rem;
    margin-top: 0.4rem;
}

.msg-preview {
    margin: 0.4rem 0 0;
    font-size: 0.85rem;
    color: var(--contrast-brown);
}

.msg-body {
    margin-top: 0.6rem;
}

.msg-body p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.6;
}

.msg-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.8rem;
}

.msg-actions button {
    border: none;
    border-radius: 6px;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    background: var(--contrast-gold);
    color: var(--primary-text);
    cursor: pointer;
}

.msg-actions button.danger {
    background: color-mix(in srgb, #b83333 25%, transparent);
    color: #b83333;
}
</style>
