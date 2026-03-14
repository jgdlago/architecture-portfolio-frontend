<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
    createAdminCategory,
    createAdminProject,
    deleteAdminProject,
    fetchAdminCategories,
    fetchAdminMessages,
    fetchAdminProjects,
    fetchAdminSettings,
    markMessageAsRead,
    upsertAdminSetting,
    type AdminCategory,
    type AdminMessage,
    type AdminProject,
} from '../../api/admin'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const activeTab = ref<'projects' | 'categories' | 'messages' | 'settings'>('projects')
const isLoading = ref(true)
const isSaving = ref(false)

const projects = ref<AdminProject[]>([])
const categories = ref<AdminCategory[]>([])
const messages = ref<AdminMessage[]>([])
const settings = ref<Record<string, any>>({})

const categoryForm = ref({ name: '', slug: '' })
const projectForm = ref({
  title: '',
  slug: '',
  short_description: '',
  description: '',
  project_category_id: '',
  cover_image_path: '',
  location: '',
  year: '',
  is_featured: false,
  published_at: '',
})

const settingsText = computed({
  get: () => JSON.stringify(settings.value, null, 2),
  set: (value: string) => {
    try {
      settings.value = JSON.parse(value)
    } catch {
      // Keep previous state while user types incomplete JSON
    }
  },
})

const loadAll = async () => {
  isLoading.value = true

  try {
    const [projectData, categoryData, messageData, settingData] = await Promise.all([
      fetchAdminProjects(),
      fetchAdminCategories(),
      fetchAdminMessages(),
      fetchAdminSettings(),
    ])

    projects.value = projectData
    categories.value = categoryData
    messages.value = messageData

    settings.value = settingData.reduce((acc: Record<string, any>, item: { key: string; value: any }) => {
      acc[item.key] = item.value
      return acc
    }, {} as Record<string, any>)
  } finally {
    isLoading.value = false
  }
}

const submitCategory = async () => {
  if (!categoryForm.value.name || !categoryForm.value.slug) {
    return
  }

  isSaving.value = true
  try {
    await createAdminCategory({
      name: categoryForm.value.name,
      slug: categoryForm.value.slug,
      is_active: true,
    })
    categoryForm.value = { name: '', slug: '' }
    categories.value = await fetchAdminCategories()
  } finally {
    isSaving.value = false
  }
}

const submitProject = async () => {
  if (!projectForm.value.title || !projectForm.value.slug) {
    return
  }

  isSaving.value = true
  try {
    await createAdminProject({
      title: projectForm.value.title,
      slug: projectForm.value.slug,
      short_description: projectForm.value.short_description || null,
      description: projectForm.value.description || null,
      project_category_id: projectForm.value.project_category_id ? Number(projectForm.value.project_category_id) : null,
      cover_image_path: projectForm.value.cover_image_path || null,
      location: projectForm.value.location || null,
      year: projectForm.value.year ? Number(projectForm.value.year) : null,
      is_featured: projectForm.value.is_featured,
      published_at: projectForm.value.published_at || null,
    })

    projectForm.value = {
      title: '',
      slug: '',
      short_description: '',
      description: '',
      project_category_id: '',
      cover_image_path: '',
      location: '',
      year: '',
      is_featured: false,
      published_at: '',
    }

    projects.value = await fetchAdminProjects()
  } finally {
    isSaving.value = false
  }
}

const removeProject = async (id: number) => {
  await deleteAdminProject(id)
  projects.value = await fetchAdminProjects()
}

const setMessageRead = async (id: number) => {
  await markMessageAsRead(id)
  messages.value = await fetchAdminMessages()
}

const saveSettings = async () => {
  isSaving.value = true
  try {
    const entries = Object.entries(settings.value)

    for (const [key, value] of entries) {
      await upsertAdminSetting(key, value)
    }
  } finally {
    isSaving.value = false
  }
}

const doLogout = async () => {
  await auth.logout()
  await router.push('/login')
}

onMounted(loadAll)
</script>

<template>
  <main class="admin-page">
    <header class="topbar">
      <div>
        <h1>Painel Administrativo</h1>
        <p>Gerencie projetos, categorias, mensagens e conteudo institucional.</p>
      </div>
      <button class="logout" @click="doLogout">Sair</button>
    </header>

    <nav class="tabs">
      <button :class="{ active: activeTab === 'projects' }" @click="activeTab = 'projects'">Projetos</button>
      <button :class="{ active: activeTab === 'categories' }" @click="activeTab = 'categories'">Categorias</button>
      <button :class="{ active: activeTab === 'messages' }" @click="activeTab = 'messages'">Mensagens</button>
      <button :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'">Conteudo</button>
    </nav>

    <p v-if="isLoading">Carregando dados do painel...</p>

    <section v-else-if="activeTab === 'projects'" class="section">
      <h2>Novo Projeto</h2>
      <form class="grid" @submit.prevent="submitProject">
        <input v-model="projectForm.title" placeholder="Titulo" required />
        <input v-model="projectForm.slug" placeholder="Slug" required />
        <input v-model="projectForm.short_description" placeholder="Descricao curta" />
        <input v-model="projectForm.cover_image_path" placeholder="Caminho da imagem de capa" />
        <input v-model="projectForm.location" placeholder="Local" />
        <input v-model="projectForm.year" placeholder="Ano" type="number" />
        <input v-model="projectForm.published_at" type="datetime-local" />
        <select v-model="projectForm.project_category_id">
          <option value="">Sem categoria</option>
          <option v-for="category in categories" :key="category.id" :value="String(category.id)">
            {{ category.name }}
          </option>
        </select>
        <label class="checkbox">
          <input v-model="projectForm.is_featured" type="checkbox" />
          Destaque na Home
        </label>
        <textarea v-model="projectForm.description" placeholder="Descricao completa"></textarea>
        <button :disabled="isSaving">{{ isSaving ? 'Salvando...' : 'Salvar Projeto' }}</button>
      </form>

      <h3>Projetos cadastrados</h3>
      <ul class="list">
        <li v-for="project in projects" :key="project.id">
          <div>
            <strong>{{ project.title }}</strong>
            <small>{{ project.category || 'Sem categoria' }} | {{ project.slug }}</small>
          </div>
          <button class="danger" @click="removeProject(project.id)">Excluir</button>
        </li>
      </ul>
    </section>

    <section v-else-if="activeTab === 'categories'" class="section">
      <h2>Nova Categoria</h2>
      <form class="inline" @submit.prevent="submitCategory">
        <input v-model="categoryForm.name" placeholder="Nome" required />
        <input v-model="categoryForm.slug" placeholder="Slug" required />
        <button :disabled="isSaving">{{ isSaving ? 'Salvando...' : 'Salvar Categoria' }}</button>
      </form>

      <ul class="list">
        <li v-for="category in categories" :key="category.id">
          <div>
            <strong>{{ category.name }}</strong>
            <small>{{ category.slug }}</small>
          </div>
        </li>
      </ul>
    </section>

    <section v-else-if="activeTab === 'messages'" class="section">
      <h2>Mensagens de Contato</h2>
      <ul class="list messages">
        <li v-for="message in messages" :key="message.id">
          <div>
            <strong>{{ message.name }} - {{ message.email }}</strong>
            <p>{{ message.message }}</p>
            <small>{{ new Date(message.created_at).toLocaleString('pt-BR') }}</small>
          </div>
          <button v-if="!message.is_read" @click="setMessageRead(message.id)">Marcar como lida</button>
          <span v-else class="badge">Lida</span>
        </li>
      </ul>
    </section>

    <section v-else class="section">
      <h2>Conteudo Institucional (JSON)</h2>
      <p>Edite chaves como hero, about, contact, footer, process, experience.</p>
      <textarea class="json" v-model="settingsText"></textarea>
      <button :disabled="isSaving" @click="saveSettings">
        {{ isSaving ? 'Salvando...' : 'Salvar Conteudo' }}
      </button>
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
}

.topbar p {
  margin: 0.3rem 0 0;
  color: var(--contrast-brown);
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.4rem;
}

.tabs button,
button {
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  background: color-mix(in srgb, var(--contrast-brown) 25%, transparent);
  color: var(--primary-text);
  cursor: pointer;
}

.tabs button.active {
  background: var(--contrast-gold);
}

.section {
  background: color-mix(in srgb, var(--background) 93%, black 7%);
  border: 1px solid color-mix(in srgb, var(--contrast-brown) 30%, transparent);
  border-radius: 12px;
  padding: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
  margin-bottom: 1.2rem;
}

.inline {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

input,
select,
textarea {
  width: 100%;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--contrast-brown) 45%, transparent);
  background: var(--background);
  color: var(--primary-text);
  padding: 0.7rem 0.8rem;
}

textarea {
  min-height: 110px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox input {
  width: auto;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.list li {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  border: 1px solid color-mix(in srgb, var(--contrast-brown) 20%, transparent);
  border-radius: 8px;
  padding: 0.8rem;
}

.list small {
  color: var(--contrast-brown);
}

.messages p {
  margin: 0.4rem 0;
}

.badge {
  background: color-mix(in srgb, #2d913f 25%, transparent);
  color: #2d913f;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.78rem;
}

button.danger {
  background: color-mix(in srgb, #b83333 30%, transparent);
  color: #b83333;
}

.json {
  min-height: 340px;
  font-family: Consolas, monospace;
  margin-bottom: 0.8rem;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .inline {
    flex-direction: column;
  }
}
</style>
