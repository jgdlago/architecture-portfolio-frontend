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
    updateProjectImage,
    uploadFile,
    type AdminCategory,
    type AdminProject,
    type AdminProjectDetail,
    type AdminProjectImage,
} from '@/api/admin'
import { resolveMediaUrl } from '@/api/http'
import ImageUploader from '@/components/admin/ImageUploader.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useToast } from '@/composables/useToast'
import { getApiErrorMessage, getFieldErrors, type FieldErrors } from '@/utils/apiErrors'
import { computed, onMounted, ref } from 'vue'

interface PendingImage {
    path: string
    url: string
    isCover: boolean
}

const toast = useToast()

const projects = ref<AdminProject[]>([])
const categories = ref<AdminCategory[]>([])
const isLoading = ref(true)
const isSaving = ref(false)
const isUploadingGallery = ref(false)

const editingProject = ref<AdminProjectDetail | null>(null)
const projectImages = ref<AdminProjectImage[]>([])
const pendingImages = ref<PendingImage[]>([])
const showForm = ref(false)
const fieldErrors = ref<FieldErrors>({})
const deletingProjectId = ref<number | null>(null)

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
    }
}

const isEditing = computed(() => Boolean(editingProject.value))

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

const clearErrors = () => {
    fieldErrors.value = {}
}

const setFieldError = (error: unknown) => {
    fieldErrors.value = getFieldErrors(error)
}

const openNew = () => {
    editingProject.value = null
    form.value = emptyForm()
    pendingImages.value = []
    projectImages.value = []
    clearErrors()
    showForm.value = true
}

const openEdit = async (project: AdminProject) => {
    clearErrors()
    pendingImages.value = []

    try {
        const full = await fetchAdminProject(project.id)
        editingProject.value = full
        form.value = {
            title: full.title,
            slug: full.slug,
            short_description: full.short_description ?? '',
            description: full.description ?? '',
            project_category_id: full.category?.id ?? '',
            cover_image_path: full.cover_image_path ?? '',
            location: full.location ?? '',
            year: full.year ?? '',
            area_m2: full.area_m2 ?? '',
            is_featured: full.is_featured,
        }
        projectImages.value = full.images ?? []
        showForm.value = true
    } catch (error) {
        toast.error(getApiErrorMessage(error, 'Erro ao carregar projeto.'))
    }
}

const cancelEdit = () => {
    showForm.value = false
    editingProject.value = null
    pendingImages.value = []
    clearErrors()
}

const persistPendingImages = async (projectId: number) => {
    if (!pendingImages.value.length) {
        return
    }

    const created = await Promise.all(
        pendingImages.value.map((img, index) =>
            addProjectImage(projectId, {
                image_path: img.path,
                sort_order: index,
                is_cover: img.isCover,
            })
        )
    )

    projectImages.value = created
}

const submitProject = async () => {
    if (!form.value.title) {
        return
    }

    isSaving.value = true
    clearErrors()

    try {
        const payload: Record<string, unknown> = {
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
        }

        if (editingProject.value) {
            await updateAdminProject(editingProject.value.id, payload)
            toast.success('Projeto atualizado.')
        } else {
            const created = await createAdminProject(payload)
            await persistPendingImages(created.id)
            toast.success('Projeto criado com sucesso.')
        }

        showForm.value = false
        await loadProjects()
    } catch (error) {
        setFieldError(error)
        toast.error(getApiErrorMessage(error, 'Erro ao salvar projeto.'))
    } finally {
        isSaving.value = false
    }
}

const askRemoveProject = (id: number) => {
    deletingProjectId.value = id
}

const removeProjectConfirmed = async () => {
    const id = deletingProjectId.value
    if (!id) return

    try {
        await deleteAdminProject(id)
        toast.success('Projeto excluído.')
        await loadProjects()
    } catch (error) {
        toast.error(getApiErrorMessage(error, 'Erro ao excluir projeto.'))
    } finally {
        deletingProjectId.value = null
    }
}

const uploadGalleryImage = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    isUploadingGallery.value = true

    try {
        const result = await uploadFile(file, 'projects')

        if (editingProject.value) {
            const image = await addProjectImage(editingProject.value.id, {
                image_path: result.path,
                sort_order: projectImages.value.length,
            })
            projectImages.value.push(image)
        } else {
            pendingImages.value.push({
                path: result.path,
                url: resolveMediaUrl(result.path),
                isCover: pendingImages.value.length === 0 && !form.value.cover_image_path,
            })

            if (!form.value.cover_image_path) {
                form.value.cover_image_path = result.path
            }
        }

        toast.success('Imagem adicionada.')
    } catch (error) {
        toast.error(getApiErrorMessage(error, 'Erro ao enviar imagem.'))
    } finally {
        isUploadingGallery.value = false
        input.value = ''
    }
}

const removeImage = async (image: AdminProjectImage) => {
    if (!editingProject.value) return

    try {
        await deleteProjectImage(editingProject.value.id, image.id)
        projectImages.value = projectImages.value.filter((i) => i.id !== image.id)

        if (form.value.cover_image_path === image.image_path) {
            form.value.cover_image_path = ''
        }

        toast.success('Imagem removida.')
    } catch (error) {
        toast.error(getApiErrorMessage(error, 'Erro ao remover imagem.'))
    }
}

const removePendingImage = (imagePath: string) => {
    pendingImages.value = pendingImages.value.filter((img) => img.path !== imagePath)

    if (form.value.cover_image_path === imagePath) {
        const next = pendingImages.value[0]
        form.value.cover_image_path = next?.path ?? ''
        pendingImages.value = pendingImages.value.map((img, idx) => ({
            ...img,
            isCover: idx === 0 && Boolean(next),
        }))
    }
}

const setCoverImage = async (image: AdminProjectImage) => {
    if (!editingProject.value) {
        return
    }

    try {
        await updateProjectImage(editingProject.value.id, image.id, { is_cover: true })

        projectImages.value = projectImages.value.map((img) => ({
            ...img,
            is_cover: img.id === image.id,
        }))

        form.value.cover_image_path = image.image_path
        toast.success('Imagem definida como capa.')
    } catch (error) {
        toast.error(getApiErrorMessage(error, 'Erro ao definir imagem de capa.'))
    }
}

const setPendingCoverImage = (imagePath: string) => {
    pendingImages.value = pendingImages.value.map((img) => ({
        ...img,
        isCover: img.path === imagePath,
    }))
    form.value.cover_image_path = imagePath
}

const errorFor = (field: string): string => fieldErrors.value[field] || ''

onMounted(loadProjects)
</script>

<template>
    <div v-if="isLoading" class="loading">Carregando projetos...</div>

    <div v-else>
        <div v-if="showForm" class="form-panel">
            <div class="form-header">
                <h2>{{ isEditing ? 'Editar Projeto' : 'Novo Projeto' }}</h2>
                <button class="btn-text" @click="cancelEdit">Cancelar</button>
            </div>

            <form class="project-form" @submit.prevent="submitProject">
                <div class="form-grid">
                    <div class="field">
                        <label>Título *</label>
                        <input v-model="form.title" required />
                        <small v-if="errorFor('title')" class="field-error">{{ errorFor('title') }}</small>
                    </div>

                    <div class="field">
                        <label>Slug <small>(auto se vazio)</small></label>
                        <input v-model="form.slug" placeholder="gerado-automaticamente" />
                        <small v-if="errorFor('slug')" class="field-error">{{ errorFor('slug') }}</small>
                    </div>

                    <div class="field">
                        <label>Categoria</label>
                        <select v-model="form.project_category_id">
                            <option value="">Sem categoria</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                        </select>
                        <small v-if="errorFor('project_category_id')" class="field-error">{{ errorFor('project_category_id') }}</small>
                    </div>

                    <div class="field">
                        <label>Local</label>
                        <input v-model="form.location" placeholder="Ex: Passo Fundo, RS" />
                    </div>

                    <div class="field">
                        <label>Ano</label>
                        <input v-model="form.year" type="number" min="1900" max="2100" />
                        <small v-if="errorFor('year')" class="field-error">{{ errorFor('year') }}</small>
                    </div>

                    <div class="field">
                        <label>Área (m2)</label>
                        <input v-model="form.area_m2" type="number" step="0.01" min="0" />
                        <small v-if="errorFor('area_m2')" class="field-error">{{ errorFor('area_m2') }}</small>
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
                    <small v-if="errorFor('short_description')" class="field-error">{{ errorFor('short_description') }}</small>
                </div>

                <div class="field">
                    <label>Descrição completa</label>
                    <textarea v-model="form.description" rows="4"></textarea>
                    <small v-if="errorFor('description')" class="field-error">{{ errorFor('description') }}</small>
                </div>

                <div class="field">
                    <label>Imagem de Capa</label>
                    <ImageUploader v-model="form.cover_image_path" folder="projects" />
                    <small class="field-help">Você também pode escolher uma capa na galeria abaixo.</small>
                </div>

                <div class="field">
                    <label>Galeria de Imagens</label>
                    <div class="gallery-grid">
                        <template v-if="isEditing">
                            <div v-for="img in projectImages" :key="img.id" class="gallery-item">
                                <img :src="resolveMediaUrl(img.image_path)" :alt="img.alt_text || 'Imagem'" />
                                <div class="gallery-actions">
                                    <button
                                        type="button"
                                        class="cover-btn"
                                        :class="{ active: img.is_cover || form.cover_image_path === img.image_path }"
                                        @click="setCoverImage(img)"
                                    >
                                        {{ img.is_cover || form.cover_image_path === img.image_path ? 'Capa' : 'Definir capa' }}
                                    </button>
                                    <button type="button" class="remove-img" @click="removeImage(img)">Excluir</button>
                                </div>
                            </div>
                        </template>

                        <template v-else>
                            <div v-for="img in pendingImages" :key="img.path" class="gallery-item">
                                <img :src="img.url" alt="Imagem" />
                                <div class="gallery-actions">
                                    <button
                                        type="button"
                                        class="cover-btn"
                                        :class="{ active: img.isCover }"
                                        @click="setPendingCoverImage(img.path)"
                                    >
                                        {{ img.isCover ? 'Capa' : 'Definir capa' }}
                                    </button>
                                    <button type="button" class="remove-img" @click="removePendingImage(img.path)">Excluir</button>
                                </div>
                            </div>
                        </template>

                        <label class="add-image" :class="{ disabled: isUploadingGallery }">
                            {{ isUploadingGallery ? 'Enviando...' : '+ Adicionar' }}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                :disabled="isUploadingGallery"
                                @change="uploadGalleryImage"
                            />
                        </label>
                    </div>
                    <small v-if="!isEditing" class="field-help">As imagens enviadas agora serão vinculadas ao projeto após clicar em criar.</small>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-primary" :disabled="isSaving">
                        {{ isSaving ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar projeto' }}
                    </button>
                </div>
            </form>
        </div>

        <div v-else>
            <div class="list-header">
                <h2>Projetos</h2>
                <button class="btn-primary" @click="openNew">+ Novo Projeto</button>
            </div>

            <div v-if="!projects.length" class="empty">
                <strong>Nenhum projeto cadastrado</strong>
                <p>Use "Novo Projeto" para publicar o primeiro item do portfólio.</p>
            </div>

            <ul class="project-list">
                <li v-for="project in projects" :key="project.id" class="project-item">
                    <div class="project-thumb">
                        <img v-if="project.cover_image_path" :src="resolveMediaUrl(project.cover_image_path)" :alt="project.title" />
                        <div v-else class="no-image">Sem imagem</div>
                    </div>
                    <div class="project-info">
                        <strong>{{ project.title }}</strong>
                        <small>{{ project.category || 'Sem categoria' }} · {{ project.location || '—' }} · {{ project.year || '—' }}</small>
                        <div class="tags">
                            <span v-if="project.is_featured" class="tag featured">Destaque</span>
                            <span v-if="project.published_at" class="tag published">Publicado</span>
                            <span v-else class="tag draft">Rascunho</span>
                        </div>
                    </div>
                    <div class="project-actions">
                        <button @click="openEdit(project)">Editar</button>
                        <button class="danger" @click="askRemoveProject(project.id)">Excluir</button>
                    </div>
                </li>
            </ul>

            <ConfirmDialog
                :open="deletingProjectId !== null"
                title="Excluir projeto"
                message="Esta ação remove o projeto e não pode ser desfeita. Deseja continuar?"
                confirm-text="Excluir"
                :danger="true"
                @confirm="removeProjectConfirmed"
                @cancel="deletingProjectId = null"
            />
        </div>
    </div>
</template>

<style scoped>
.loading,
.empty {
    padding: 1rem;
    color: var(--contrast-brown);
}

.empty {
    background: color-mix(in srgb, var(--contrast-brown) 10%, transparent);
    border: 1px dashed color-mix(in srgb, var(--contrast-brown) 25%, transparent);
    border-radius: 10px;
}

.empty p {
    margin: 0.35rem 0 0;
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
    font-size: 1.2rem;
}

.btn-primary {
    border: none;
    border-radius: 10px;
    padding: 0.65rem 1.2rem;
    background: var(--contrast-gold);
    color: var(--primary-text);
    font-weight: 700;
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
    gap: 0.75rem;
}

.project-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.9rem;
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    border-radius: 10px;
    background: color-mix(in srgb, var(--background) 94%, black 6%);
}

.project-thumb {
    width: 96px;
    height: 72px;
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
    font-size: 0.7rem;
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
    padding: 0.14rem 0.55rem;
    border-radius: 999px;
    font-weight: 700;
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
    border-radius: 8px;
    padding: 0.45rem 0.8rem;
    font-size: 0.8rem;
    background: color-mix(in srgb, var(--contrast-brown) 25%, transparent);
    color: var(--primary-text);
    cursor: pointer;
}

.project-actions button.danger {
    background: color-mix(in srgb, #b83333 25%, transparent);
    color: #b83333;
}

.form-panel {
    background: color-mix(in srgb, var(--background) 94%, black 6%);
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    border-radius: 14px;
    padding: 1.25rem;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.85rem;
    margin-bottom: 0.8rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 0.7rem;
}

.field label {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--contrast-brown);
}

.field input,
.field select,
.field textarea {
    width: 100%;
    padding: 0.65rem 0.8rem;
    border-radius: 8px;
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

.field-error {
    color: #c0392b;
    font-size: 0.76rem;
}

.field-help {
    color: var(--contrast-brown);
    font-size: 0.76rem;
}

.form-actions {
    margin-top: 1rem;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 0.7rem;
}

.gallery-item {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    background: color-mix(in srgb, var(--background) 92%, black 8%);
}

.gallery-item img {
    width: 100%;
    height: 120px;
    object-fit: cover;
}

.gallery-actions {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.4rem;
    padding: 0.45rem;
}

.cover-btn,
.remove-img {
    border: none;
    border-radius: 6px;
    padding: 0.35rem 0.45rem;
    font-size: 0.75rem;
    cursor: pointer;
}

.cover-btn {
    background: color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    color: var(--primary-text);
}

.cover-btn.active {
    background: var(--contrast-gold);
    font-weight: 700;
}

.remove-img {
    background: color-mix(in srgb, #b83333 25%, transparent);
    color: #b83333;
}

.add-image {
    min-height: 160px;
    display: grid;
    place-items: center;
    border: 2px dashed color-mix(in srgb, var(--contrast-brown) 35%, transparent);
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--contrast-brown);
    cursor: pointer;
    padding: 0.5rem;
    text-align: center;
}

.add-image.disabled {
    opacity: 0.5;
    pointer-events: none;
}

.add-image input {
    display: none;
}

@media (max-width: 900px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 650px) {
    .project-item {
        flex-direction: column;
        align-items: flex-start;
    }

    .project-thumb {
        width: 100%;
        height: 140px;
    }

    .project-actions {
        width: 100%;
    }
}
</style>
