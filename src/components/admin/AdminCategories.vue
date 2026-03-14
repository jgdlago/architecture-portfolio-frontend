<script setup lang="ts">
import {
    createAdminCategory,
    deleteAdminCategory,
    fetchAdminCategories,
    type AdminCategory,
} from '@/api/admin'
import { useToast } from '@/composables/useToast'
import { onMounted, ref } from 'vue'

const toast = useToast()
const categories = ref<AdminCategory[]>([])
const isLoading = ref(true)
const isSaving = ref(false)
const form = ref({ name: '', slug: '' })

const load = async () => {
    isLoading.value = true
    try {
        categories.value = await fetchAdminCategories()
    } finally {
        isLoading.value = false
    }
}

const submit = async () => {
    if (!form.value.name || !form.value.slug) return
    isSaving.value = true
    try {
        await createAdminCategory({ name: form.value.name, slug: form.value.slug, is_active: true })
        form.value = { name: '', slug: '' }
        categories.value = await fetchAdminCategories()
        toast.success('Categoria criada.')
    } catch {
        toast.error('Erro ao criar categoria.')
    } finally {
        isSaving.value = false
    }
}

const remove = async (id: number) => {
    if (!confirm('Excluir esta categoria?')) return
    try {
        await deleteAdminCategory(id)
        categories.value = categories.value.filter(c => c.id !== id)
        toast.success('Categoria excluída.')
    } catch {
        toast.error('Erro ao excluir categoria.')
    }
}

const autoSlug = () => {
    form.value.slug = form.value.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
}

onMounted(load)
</script>

<template>
    <div v-if="isLoading" class="loading">Carregando categorias...</div>

    <div v-else>
        <h2>Nova Categoria</h2>
        <form class="inline-form" @submit.prevent="submit">
            <input v-model="form.name" @input="autoSlug" placeholder="Nome da categoria" required />
            <input v-model="form.slug" placeholder="slug" required />
            <button :disabled="isSaving">{{ isSaving ? 'Salvando...' : 'Criar' }}</button>
        </form>

        <h3>Categorias cadastradas</h3>
        <div v-if="!categories.length" class="empty">Nenhuma categoria.</div>

        <ul class="list">
            <li v-for="cat in categories" :key="cat.id">
                <div>
                    <strong>{{ cat.name }}</strong>
                    <small>{{ cat.slug }}</small>
                </div>
                <button class="danger" @click="remove(cat.id)">Excluir</button>
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

.inline-form {
    display: flex;
    gap: 0.6rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.inline-form input {
    flex: 1;
    min-width: 150px;
    padding: 0.6rem 0.8rem;
    border-radius: 6px;
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 40%, transparent);
    background: var(--background);
    color: var(--primary-text);
}

.inline-form button,
button {
    border: none;
    border-radius: 6px;
    padding: 0.6rem 1rem;
    background: var(--contrast-gold);
    color: var(--primary-text);
    font-weight: 600;
    cursor: pointer;
}

h2 {
    font-size: 1rem;
    margin: 0 0 0.8rem;
}

h3 {
    font-size: 0.85rem;
    margin: 0 0 0.5rem;
    color: var(--contrast-brown);
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0.8rem;
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    border-radius: 6px;
}

.list small {
    color: var(--contrast-brown);
    display: block;
    font-size: 0.75rem;
}

button.danger {
    background: color-mix(in srgb, #b83333 25%, transparent);
    color: #b83333;
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
}
</style>
