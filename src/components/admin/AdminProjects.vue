<script setup lang="ts">
import {
    addProjectImage,
    createAdminProject,
    deleteAdminProject,
    deleteProjectImage,
    fetchAdminCategories,
    fetchAdminProject,
    fetchAdminProjects,
    updateAdminProject,
    uploadFile,
    type AdminCategory,
    type AdminProject,
    type AdminProjectImage,
} from '@/api/admin'
import { resolveMediaUrl } from '@/api/http'
import ImageUploader from '@/components/admin/ImageUploader.vue'
import { useToast } from '@/composables/useToast'
import { onMounted, ref } from 'vue'

const toast = useToast()

const projects = ref<AdminProject[]>([])
const categories = ref<AdminCategory[]>([])
const isLoading = ref(true)
const isSaving = ref(false)

const editingProject = ref<AdminProject | null>(null)
const projectImages = ref<AdminProjectImage[]>([])
const showForm = ref(false)

const form = ref(emptyForm())

function emptyForm() {
    return {
        title: '',
        slug: '',
        short_description: '',
        description: '',
        project_category_id: '' as string | number,
        cover_image_path: '',
        location: '',
        year: '' as string | number,
        area_m2: '' as string | number,
        is_featured: false,
        published_at: '',
    }
}

const loadProjects = async () => {
    isLoading.value = true
    try {
        const [p, c] = await Promise.all([fetchAdminProjects(), fetchAdminCategories()])
        projects.value = p
        categories.value = c
    } finally {
        isLoading.value = false
    }
}

const openNew = () => {
    editingProject.value = null
    form.value = emptyForm()
    projectImages.value = []
    showForm.value = true
}

const openEdit = async (project: AdminProject) => {
    try {
        const full = await fetchAdminProject(project.id)
        editingProject.value = full
        form.value = {
            title: full.title,
            slug: full.slug,
            short_description: full.short_description ?? '',
            description: full.description ?? '',
            project_category_id: full.category_slug ? categories.value.find(c => c.slug === full.category_slug)?.id ?? '' : '',
            cover_image_path: full.cover_image_path ?? '',
            location: full.location ?? '',
            year: full.year ?? '',
            area_m2: full.area_m2 ?? '',
            is_featured: full.is_featured,
            published_at: full.published_at ? full.published_at.slice(0, 16) : '',
        }
        projectImages.value = full.images ?? []
        showForm.value = true
    } catch {
        toast.error('Erro ao carregar projeto.')
    }
}

const cancelEdit = () => {
    showForm.value = false
    editingProject.value = null
}

const submitProject = async () => {
    if (!form.value.title) return
    isSaving.value = true
    try {
        const payload: Record<string, any> = {
            title: form.value.title,
            slug: form.value.slug || null,
            short_description: form.value.short_description || null,
            description: form.value.description || null,
            project_category_id: form.value.project_category_id ? Number(form.value.project_category_id) : null,
            cover_image_path: form.value.cover_image_path || null,
            location: form.value.location || null,
            year: form.value.year ? Number(form.value.year) : null,
            area_m2: form.value.area_m2 ? Number(form.value.area_m2) : null,
            is_featured: form.value.is_featured,
            published_at: form.value.published_at || null,
        }

        if (editingProject.value) {
            await updateAdminProject(editingProject.value.id, payload)
            toast.success('Projeto atualizado.')
        } else {
            await createAdminProject(payload)
            toast.success('Projeto criado.')
        }
        showForm.value = false
        await loadProjects()
    } catch {
        toast.error('Erro ao salvar projeto.')
    } finally {
        isSaving.value = false
    }
}

const removeProject = async (id: number) => {
    if (!confirm('Excluir este projeto?')) return
    try {
        await deleteAdminProject(id)
        toast.success('Projeto excluído.')
        await loadProjects()
    } catch {
        toast.error('Erro ao excluir projeto.')
    }
}

// Image management
const isUploadingGallery = ref(false)

const uploadGalleryImage = async (event: Event) => {
    if (!editingProject.value) return
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    isUploadingGallery.value = true
    try {
        const result = await uploadFile(file, 'projects')
        const image = await addProjectImage(editingProject.value.id, {
            image_path: result.path,
            sort_order: projectImages.value.length,
        })
        projectImages.value.push(image)
        toast.success('Imagem adicionada.')
    } catch {
        toast.error('Erro ao enviar imagem.')
    } finally {
        isUploadingGallery.value = false
        input.value = ''
    }
}

const removeImage = async (image: AdminProjectImage) => {
    if (!editingProject.value) return
    try {
        await deleteProjectImage(editingProject.value.id, image.id)
        projectImages.value = projectImages.value.filter(i => i.id !== image.id)
        toast.success('Imagem removida.')
    } catch {
        toast.error('Erro ao remover imagem.')
    }
}

onMounted(loadProjects)
</script>

<template>
    <div v-if="isLoading" class="loading">Carregando projetos...</div>

    <div v-else>
        <!-- Form -->
        <div v-if="showForm" class="form-panel">
            <div class="form-header">
                <h2>{{ editingProject ? 'Editar Projeto' : 'Novo Projeto' }}</h2>
                <button class="btn-text" @click="cancelEdit">Cancelar</button>
            </div>

            <form class="project-form" @submit.prevent="submitProject">
                <div class="form-grid">
                    <div class="field">
                        <label>Título *</label>
                        <input v-model="form.title" required />
                    </div>
                    <div class="field">
                        <label>Slug <small>(auto se vazio)</small></label>
                        <input v-model="form.slug" placeholder="gerado-automaticamente" />
                    </div>
                    <div class="field">
                        <label>Categoria</label>
                        <select v-model="form.project_category_id">
                            <option value="">Sem categoria</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                {{ cat.name }}
                            </option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Local</label>
                        <input v-model="form.location" placeholder="Ex: Passo Fundo, RS" />
                    </div>
                    <div class="field">
                        <label>Ano</label>
                        <input v-model="form.year" type="number" min="1900" max="2100" />
                    </div>
                    <div class="field">
                        <label>Área (m²)</label>
                        <input v-model="form.area_m2" type="number" step="0.01" min="0" />
                    </div>
                    <div class="field">
                        <label>Publicar em</label>
                        <input v-model="form.published_at" type="datetime-local" />
                    </div>
                    <div class="field checkbox-field">
                        <label>
                            <input v-model="form.is_featured" type="checkbox" />
                            Destaque na Home
                        </label>
                    </div>
                </div>

                <div class="field">
                    <label>Descrição curta</label>
                    <input v-model="form.short_description" placeholder="Resumo do projeto" />
                </div>

                <div class="field">
                    <label>Descrição completa</label>
                    <textarea v-model="form.description" rows="4"></textarea>
                </div>

                <div class="field">
                    <label>Imagem de Capa</label>
                    <ImageUploader v-model="form.cover_image_path" folder="projects" />
                </div>

                <!-- Gallery (only when editing) -->
                <div v-if="editingProject" class="field">
                    <label>Galeria de Imagens</label>
                    <div class="gallery-grid">
                        <div v-for="img in projectImages" :key="img.id" class="gallery-item">
                            <img :src="resolveMediaUrl(img.image_path)" :alt="img.alt_text || 'Imagem'" />
                            <button type="button" class="remove-img" @click="removeImage(img)">×</button>
                        </div>
                        <label class="add-image" :class="{ disabled: isUploadingGallery }">
                            {{ isUploadingGallery ? '...' : '+' }}
                            <input type="file" accept="image/jpeg,image/png,image/webp"
                                :disabled="isUploadingGallery" @change="uploadGalleryImage" />
                        </label>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-primary" :disabled="isSaving">
                        {{ isSaving ? 'Salvando...' : editingProject ? 'Salvar Alterações' : 'Criar Projeto' }}
                    </button>
                </div>
            </form>
        </div>

        <!-- List -->
        <div v-else>
            <div class="list-header">
                <h2>Projetos</h2>
                <button class="btn-primary" @click="openNew">+ Novo Projeto</button>
            </div>

            <div v-if="!projects.length" class="empty">Nenhum projeto cadastrado.</div>

            <ul class="project-list">
                <li v-for="project in projects" :key="project.id" class="project-item">
                    <div class="project-thumb">
                        <img v-if="project.cover_image_path" :src="resolveMediaUrl(project.cover_image_path)"
                            :alt="project.title" />
                        <div v-else class="no-image">Sem imagem</div>
                    </div>
                    <div class="project-info">
                        <strong>{{ project.title }}</strong>
                        <small>{{ project.category || 'Sem categoria' }} · {{ project.location || '—' }} · {{
                            project.year || '—' }}</small>
                        <div class="tags">
                            <span v-if="project.is_featured" class="tag featured">Destaque</span>
                            <span v-if="project.published_at" class="tag published">Publicado</span>
                            <span v-else class="tag draft">Rascunho</span>
                        </div>
                    </div>
                    <div class="project-actions">
                        <button @click="openEdit(project)">Editar</button>
                        <button class="danger" @click="removeProject(project.id)">Excluir</button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.loading,
.empty {
    padding: 1rem;
    color: var(--contrast-brown);
}

.list-header,
.form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.list-header h2,
.form-header h2 {
    margin: 0;
    font-size: 1.1rem;
}

.btn-primary {
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    background: var(--contrast-gold);
    color: var(--primary-text);
    font-weight: 600;
    cursor: pointer;
}

.btn-text {
    background: none;
    border: none;
    color: var(--contrast-brown);
    cursor: pointer;
    text-decoration: underline;
}

.project-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.project-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem;
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    border-radius: 8px;
}

.project-thumb {
    width: 80px;
    height: 60px;
    flex-shrink: 0;
    border-radius: 6px;
    overflow: hidden;
}

.project-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.no-image {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    font-size: 0.65rem;
    color: var(--contrast-brown);
    background: color-mix(in srgb, var(--contrast-brown) 15%, transparent);
}

.project-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.project-info small {
    color: var(--contrast-brown);
    font-size: 0.8rem;
}

.tags {
    display: flex;
    gap: 0.4rem;
    margin-top: 0.2rem;
}

.tag {
    font-size: 0.65rem;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    font-weight: 600;
}

.tag.featured {
    background: color-mix(in srgb, var(--contrast-gold) 25%, transparent);
    color: var(--contrast-gold);
}

.tag.published {
    background: color-mix(in srgb, #2d913f 20%, transparent);
    color: #2d913f;
}

.tag.draft {
    background: color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    color: var(--contrast-brown);
}

.project-actions {
    display: flex;
    gap: 0.4rem;
    flex-shrink: 0;
}

.project-actions button {
    border: none;
    border-radius: 6px;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    background: color-mix(in srgb, var(--contrast-brown) 25%, transparent);
    color: var(--primary-text);
    cursor: pointer;
}

.project-actions button.danger {
    background: color-mix(in srgb, #b83333 25%, transparent);
    color: #b83333;
}

/* Form */
.form-panel {
    background: color-mix(in srgb, var(--background) 93%, black 7%);
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    border-radius: 10px;
    padding: 1.2rem;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
    margin-bottom: 0.8rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-bottom: 0.6rem;
}

.field label {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--contrast-brown);
}

.field input,
.field select,
.field textarea {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border-radius: 6px;
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 40%, transparent);
    background: var(--background);
    color: var(--primary-text);
}

.checkbox-field label {
    flex-direction: row;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.checkbox-field input {
    width: auto;
}

.form-actions {
    margin-top: 1rem;
}

/* Gallery */
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 0.5rem;
}

.gallery-item {
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    height: 90px;
}

.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.remove-img {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(184, 51, 51, 0.85);
    color: #fff;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    display: grid;
    place-items: center;
    line-height: 1;
}

.add-image {
    height: 90px;
    display: grid;
    place-items: center;
    border: 2px dashed color-mix(in srgb, var(--contrast-brown) 35%, transparent);
    border-radius: 6px;
    font-size: 1.5rem;
    color: var(--contrast-brown);
    cursor: pointer;
}

.add-image.disabled {
    opacity: 0.5;
    pointer-events: none;
}

.add-image input {
    display: none;
}

@media (max-width: 600px) {
    .form-grid {
        grid-template-columns: 1fr;
    }

    .project-item {
        flex-direction: column;
        align-items: flex-start;
    }

    .project-thumb {
        width: 100%;
        height: 120px;
    }
}
</style>
