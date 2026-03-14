<script setup lang="ts">
import { fetchAdminSettings, uploadFile, upsertAdminSetting } from '@/api/admin'
import { resolveMediaUrl } from '@/api/http'
import { useToast } from '@/composables/useToast'
import { getApiErrorMessage } from '@/utils/apiErrors'
import { onMounted, ref } from 'vue'

type SiteSettingItem = {
    id: number
    key: string
    value: unknown
}

const toast = useToast()
const isLoading = ref(true)
const isSaving = ref(false)

const hero = ref({ title: '', subtitle: '', image_path: '' })
const about = ref({ text: '', image_path: '' })
const contact = ref({ title: '', description: '', instagram_url: '', linkedin_url: '', email: '', whatsapp_url: '' })
const footer = ref({ brand_name: '', brand_subtitle: '', email: '', phone: '', city: '', instagram_url: '', linkedin_url: '', copyright: '', cau: '' })
const process = ref({ title: '', steps: [] as Array<{ title: string; description: string }> })
const experience = ref({ title: '', subtitle: '', blocks: [] as Array<{ title: string; items: string[] }> })

const activeSection = ref<'hero' | 'about' | 'contact' | 'footer' | 'process' | 'experience'>('hero')
const sectionLabels: Record<typeof activeSection.value, string> = {
    hero: 'Banner Principal',
    about: 'Sobre',
    process: 'Processo',
    experience: 'Experiência',
    contact: 'Contato',
    footer: 'Rodapé',
}

const load = async () => {
    isLoading.value = true
    try {
        const settings = await fetchAdminSettings()
        const map = (settings as SiteSettingItem[]).reduce<Record<string, unknown>>((acc, setting) => {
            acc[setting.key] = setting.value
            return acc
        }, {})

        if (map.hero && typeof map.hero === 'object') Object.assign(hero.value, map.hero)
        if (map.about && typeof map.about === 'object') Object.assign(about.value, map.about)
        if (map.contact && typeof map.contact === 'object') Object.assign(contact.value, map.contact)
        if (map.footer && typeof map.footer === 'object') Object.assign(footer.value, map.footer)
        if (map.process && typeof map.process === 'object') {
            const processValue = map.process as { title?: string; steps?: Array<{ title: string; description: string }> }
            process.value.title = processValue.title ?? ''
            process.value.steps = processValue.steps ?? []
        }
        if (map.experience && typeof map.experience === 'object') {
            const experienceValue = map.experience as {
                title?: string
                subtitle?: string
                blocks?: Array<{ title?: string; items?: string[] }>
            }

            experience.value.title = experienceValue.title ?? ''
            experience.value.subtitle = experienceValue.subtitle ?? ''
            experience.value.blocks = (experienceValue.blocks ?? []).map((b) => ({
                title: b.title ?? '',
                items: b.items ?? [],
            }))
        }
    } finally {
        isLoading.value = false
    }
}

const save = async (key: string, value: any) => {
    isSaving.value = true
    try {
        await upsertAdminSetting(key, value)
        toast.success(`"${key}" salvo com sucesso.`)
    } catch (error) {
        toast.error(getApiErrorMessage(error, `Erro ao salvar "${key}".`))
    } finally {
        isSaving.value = false
    }
}

// Process helpers
const addStep = () => process.value.steps.push({ title: '', description: '' })
const removeStep = (i: number) => process.value.steps.splice(i, 1)

// Experience helpers
const addBlock = () => experience.value.blocks.push({ title: '', items: [''] })
const removeBlock = (i: number) => experience.value.blocks.splice(i, 1)
const addBlockItem = (block: { items: string[] }) => block.items.push('')
const removeBlockItem = (block: { items: string[] }, i: number) => block.items.splice(i, 1)

// Image upload
const isUploadingAbout = ref(false)
const uploadAboutImage = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    isUploadingAbout.value = true
    try {
        const result = await uploadFile(file, 'about')
        about.value.image_path = result.path
    } catch (error) {
        toast.error(getApiErrorMessage(error, 'Erro ao enviar imagem.'))
    } finally {
        isUploadingAbout.value = false
    }
}

const isUploadingHero = ref(false)
const uploadHeroImage = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    isUploadingHero.value = true
    try {
        const result = await uploadFile(file, 'hero')
        hero.value.image_path = result.path
    } catch (error) {
        toast.error(getApiErrorMessage(error, 'Erro ao enviar imagem do banner.'))
    } finally {
        isUploadingHero.value = false
    }
}

onMounted(load)
</script>

<template>
    <div v-if="isLoading" class="loading">Carregando configurações...</div>

    <div v-else class="settings-editor">
        <nav class="section-nav">
            <button v-for="sec in (['hero', 'about', 'process', 'experience', 'contact', 'footer'] as const)"
                :key="sec" :class="{ active: activeSection === sec }" @click="activeSection = sec">
                {{ sectionLabels[sec] }}
            </button>
        </nav>

        <!-- Hero -->
        <form v-if="activeSection === 'hero'" class="section-form" @submit.prevent="save('hero', hero)">
            <h2>Banner Principal</h2>
            <p class="section-help">Este conteúdo aparece no topo da página inicial.</p>
            <div class="field">
                <label>Título</label>
                <input v-model="hero.title" />
            </div>
            <div class="field">
                <label>Subtítulo</label>
                <input v-model="hero.subtitle" />
            </div>
            <div class="field">
                <label>Imagem de fundo</label>
                <div v-if="hero.image_path" class="preview-small">
                    <img :src="resolveMediaUrl(hero.image_path)" alt="Banner principal" />
                </div>
                <label class="upload-label" :class="{ disabled: isUploadingHero }">
                    {{ isUploadingHero ? 'Enviando...' : 'Selecionar imagem' }}
                    <input type="file" accept="image/*" @change="uploadHeroImage" />
                </label>
            </div>
            <button type="submit" class="btn-save" :disabled="isSaving">Salvar Banner Principal</button>
        </form>

        <!-- About -->
        <form v-else-if="activeSection === 'about'" class="section-form" @submit.prevent="save('about', about)">
            <h2>Sobre</h2>
            <div class="field">
                <label>Texto</label>
                <textarea v-model="about.text" rows="4"></textarea>
            </div>
            <div class="field">
                <label>Imagem</label>
                <div v-if="about.image_path" class="preview-small">
                    <img :src="resolveMediaUrl(about.image_path)" alt="About" />
                </div>
                <label class="upload-label" :class="{ disabled: isUploadingAbout }">
                    {{ isUploadingAbout ? 'Enviando...' : 'Selecionar imagem' }}
                    <input type="file" accept="image/*" @change="uploadAboutImage" />
                </label>
            </div>
            <button type="submit" class="btn-save" :disabled="isSaving">Salvar Sobre</button>
        </form>

        <!-- Process -->
        <form v-else-if="activeSection === 'process'" class="section-form"
            @submit.prevent="save('process', process)">
            <h2>Processo</h2>
            <div class="field">
                <label>Título da seção</label>
                <input v-model="process.title" />
            </div>
            <div class="repeater">
                <h3>Etapas</h3>
                <div v-for="(step, i) in process.steps" :key="i" class="repeater-item">
                    <input v-model="step.title" placeholder="Título da etapa" />
                    <input v-model="step.description" placeholder="Descrição" />
                    <button type="button" class="btn-remove" @click="removeStep(i)">×</button>
                </div>
                <button type="button" class="btn-add" @click="addStep">+ Adicionar etapa</button>
            </div>
            <button type="submit" class="btn-save" :disabled="isSaving">Salvar Processo</button>
        </form>

        <!-- Experience -->
        <form v-else-if="activeSection === 'experience'" class="section-form"
            @submit.prevent="save('experience', experience)">
            <h2>Experiência / Atuação</h2>
            <div class="field">
                <label>Título</label>
                <input v-model="experience.title" />
            </div>
            <div class="field">
                <label>Subtítulo</label>
                <input v-model="experience.subtitle" />
            </div>
            <div class="repeater">
                <h3>Blocos</h3>
                <div v-for="(block, i) in experience.blocks" :key="i" class="repeater-block">
                    <div class="block-header">
                        <input v-model="block.title" placeholder="Título do bloco" />
                        <button type="button" class="btn-remove" @click="removeBlock(i)">×</button>
                    </div>
                    <div v-for="(_, j) in block.items" :key="j" class="block-item">
                        <input v-model="block.items[j]" placeholder="Item" />
                        <button type="button" class="btn-remove-sm" @click="removeBlockItem(block, j)">×</button>
                    </div>
                    <button type="button" class="btn-add-sm" @click="addBlockItem(block)">+ Item</button>
                </div>
                <button type="button" class="btn-add" @click="addBlock">+ Adicionar bloco</button>
            </div>
            <button type="submit" class="btn-save" :disabled="isSaving">Salvar Experiência</button>
        </form>

        <!-- Contact -->
        <form v-else-if="activeSection === 'contact'" class="section-form"
            @submit.prevent="save('contact', contact)">
            <h2>Contato</h2>
            <div class="form-grid">
                <div class="field"><label>Título</label><input v-model="contact.title" /></div>
                <div class="field"><label>Descrição</label><input v-model="contact.description" /></div>
                <div class="field"><label>Email</label><input v-model="contact.email" type="email" /></div>
                <div class="field"><label>WhatsApp URL</label><input v-model="contact.whatsapp_url" /></div>
                <div class="field"><label>Instagram URL</label><input v-model="contact.instagram_url" /></div>
                <div class="field"><label>LinkedIn URL</label><input v-model="contact.linkedin_url" /></div>
            </div>
            <button type="submit" class="btn-save" :disabled="isSaving">Salvar Contato</button>
        </form>

        <!-- Footer -->
        <form v-else class="section-form" @submit.prevent="save('footer', footer)">
            <h2>Footer</h2>
            <div class="form-grid">
                <div class="field"><label>Nome</label><input v-model="footer.brand_name" /></div>
                <div class="field"><label>Subtítulo</label><input v-model="footer.brand_subtitle" /></div>
                <div class="field"><label>Email</label><input v-model="footer.email" type="email" /></div>
                <div class="field"><label>Telefone</label><input v-model="footer.phone" /></div>
                <div class="field"><label>Cidade</label><input v-model="footer.city" /></div>
                <div class="field"><label>Instagram URL</label><input v-model="footer.instagram_url" /></div>
                <div class="field"><label>LinkedIn URL</label><input v-model="footer.linkedin_url" /></div>
                <div class="field"><label>Copyright</label><input v-model="footer.copyright" /></div>
                <div class="field"><label>CAU</label><input v-model="footer.cau" /></div>
            </div>
            <button type="submit" class="btn-save" :disabled="isSaving">Salvar Footer</button>
        </form>
    </div>
</template>

<style scoped>
.loading {
    padding: 1rem;
    color: var(--contrast-brown);
}

.settings-editor {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.section-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.section-nav button {
    border: none;
    border-radius: 6px;
    padding: 0.45rem 0.8rem;
    font-size: 0.8rem;
    background: color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    color: var(--primary-text);
    cursor: pointer;
}

.section-nav button.active {
    background: var(--contrast-gold);
}

.section-form {
    background: color-mix(in srgb, var(--background) 93%, black 7%);
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    border-radius: 10px;
    padding: 1.2rem;
}

.section-form h2 {
    margin: 0 0 1rem;
    font-size: 1rem;
}

.section-help {
    margin: -0.4rem 0 1rem;
    font-size: 0.82rem;
    color: var(--contrast-brown);
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-bottom: 0.5rem;
}

.field label {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--contrast-brown);
}

.field input,
.field textarea {
    width: 100%;
    padding: 0.55rem 0.7rem;
    border-radius: 6px;
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 40%, transparent);
    background: var(--background);
    color: var(--primary-text);
}

.btn-save {
    margin-top: 0.8rem;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    background: var(--contrast-gold);
    color: var(--primary-text);
    font-weight: 600;
    cursor: pointer;
}

/* Repeater */
.repeater {
    margin-top: 0.5rem;
}

.repeater h3 {
    font-size: 0.85rem;
    margin: 0 0 0.5rem;
    color: var(--contrast-brown);
}

.repeater-item {
    display: flex;
    gap: 0.4rem;
    margin-bottom: 0.4rem;
}

.repeater-item input {
    flex: 1;
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 40%, transparent);
    background: var(--background);
    color: var(--primary-text);
}

.repeater-block {
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    border-radius: 8px;
    padding: 0.6rem;
    margin-bottom: 0.5rem;
}

.block-header {
    display: flex;
    gap: 0.4rem;
    margin-bottom: 0.4rem;
}

.block-header input {
    flex: 1;
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 40%, transparent);
    background: var(--background);
    color: var(--primary-text);
    font-weight: 600;
}

.block-item {
    display: flex;
    gap: 0.3rem;
    margin-bottom: 0.3rem;
}

.block-item input {
    flex: 1;
    padding: 0.4rem;
    border-radius: 4px;
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 30%, transparent);
    background: var(--background);
    color: var(--primary-text);
    font-size: 0.85rem;
}

.btn-remove,
.btn-remove-sm {
    background: color-mix(in srgb, #b83333 25%, transparent);
    color: #b83333;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 28px;
    font-size: 1rem;
    flex-shrink: 0;
}

.btn-add,
.btn-add-sm {
    border: 1px dashed color-mix(in srgb, var(--contrast-brown) 40%, transparent);
    background: none;
    color: var(--contrast-brown);
    border-radius: 6px;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    cursor: pointer;
    margin-top: 0.3rem;
}

.preview-small {
    width: 120px;
    height: 80px;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 0.3rem;
}

.preview-small img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.upload-label {
    display: inline-flex;
    padding: 0.4rem 0.8rem;
    border: 1px dashed color-mix(in srgb, var(--contrast-brown) 40%, transparent);
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    color: var(--contrast-brown);
}

.upload-label.disabled {
    opacity: 0.5;
    pointer-events: none;
}

.upload-label input {
    display: none;
}

@media (max-width: 600px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}
</style>
