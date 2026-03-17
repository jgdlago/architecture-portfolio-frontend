<script setup lang="ts">
import {
    deleteAdminMessage,
    fetchAdminMessages,
    markMessageAsRead,
    type AdminMessage,
} from '@/api/admin'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useToast } from '@/composables/useToast'
import { onMounted, ref } from 'vue'

const toast = useToast()
const messages = ref<AdminMessage[]>([])
const isLoading = ref(true)
const expandedId = ref<number | null>(null)
const deletingId = ref<number | null>(null)

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

const askRemove = (id: number) => {
    deletingId.value = id
}

const removeConfirmed = async () => {
    const id = deletingId.value
    if (!id) return

    try {
        await deleteAdminMessage(id)
        messages.value = messages.value.filter(m => m.id !== id)
        toast.success('Mensagem excluída.')
    } catch {
        toast.error('Erro ao excluir mensagem.')
    } finally {
        deletingId.value = null
    }
}

onMounted(load)
</script>

<template>
    <div v-if="isLoading" class="loading">Carregando mensagens...</div>

    <div v-else>
        <h2>Mensagens de Contato</h2>

        <div v-if="!messages.length" class="empty">
            <strong>Caixa de entrada vazia</strong>
            <p>Nenhuma mensagem recebida até o momento.</p>
        </div>

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
                        <button class="danger" @click.stop="askRemove(msg.id)">Excluir</button>
                    </div>
                </div>
                <p v-else class="msg-preview">{{ msg.message.substring(0, 120) }}{{ msg.message.length > 120 ? '...' : '' }}</p>
            </li>
        </ul>

        <ConfirmDialog
            :open="deletingId !== null"
            title="Excluir mensagem"
            message="Esta ação não pode ser desfeita. Deseja realmente excluir esta mensagem?"
            confirm-text="Excluir"
            :danger="true"
            @confirm="removeConfirmed"
            @cancel="deletingId = null"
        />
    </div>
</template>

<style scoped>
.loading,
.empty {
    padding: var(--space-5);
    color: var(--contrast-brown);
}

.empty {
    background: color-mix(in srgb, var(--surface) 95%, transparent);
    border: 1px dashed var(--border);
    border-radius: var(--radius-lg);
}

.empty p {
    margin: 0.35rem 0 0;
}

h2 {
    margin: 0 0 var(--space-5);
    font-family: var(--font-family-heading);
    font-size: clamp(1.4rem, 3vw, 2rem);
}

.message-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}

.message-list li {
    padding: var(--space-4);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: color-mix(in srgb, var(--surface) 95%, transparent);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
}

.message-list li:hover {
    border-color: color-mix(in srgb, var(--contrast-brown) 42%, transparent);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
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
    background: color-mix(in srgb, var(--contrast-gold) 32%, transparent);
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
    border-radius: var(--radius-md);
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
