<script setup lang="ts">
import { fetchAdminSettings, uploadFile, upsertAdminSetting } from '@/api/admin'
import { resolveMediaUrl } from '@/api/http'
import FeaturedProjects from '@/components/home/FeaturedProjects.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import Footer from '@/components/layout/Footer.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import ProcessSection from '@/components/sections/ProcessSection.vue'
import { useToast } from '@/composables/useToast'
import { getApiErrorMessage } from '@/utils/apiErrors'
import { computed, onMounted, ref } from 'vue'

type SiteSettingItem = {
    id: number
    key: string
    value: unknown
}

const toast = useToast()
const isLoading = ref(true)
const isSaving = ref(false)

const hero = ref({ title: '', subtitle: '', image_path: '' })
const navbar = ref({ brand_name: '', brand_role: '', home_label: '', projects_label: '', about_label: '', contact_label: '' })
const about = ref({ text: '', image_path: '' })
const contact = ref({ title: '', description: '', instagram_url: '', linkedin_url: '', email: '', whatsapp_url: '' })
const footer = ref({ brand_name: '', brand_subtitle: '', email: '', phone: '', city: '', instagram_url: '', linkedin_url: '', copyright: '', cau: '' })
const process = ref({ title: '', steps: [] as Array<{ title: string; description: string }> })
const experience = ref({ title: '', subtitle: '', blocks: [] as Array<{ title: string; items: string[] }> })
const featuredProjects = ref({ title: '', description: '' })
const footerServices = ref({ title: 'Serviços', items: [] as string[] })
const seo = ref({ title: '', description: '' })

const activeSection = ref<'hero' | 'navbar' | 'about' | 'contact' | 'footer' | 'process' | 'experience' | 'featured' | 'footerServices' | 'seo'>('hero')
const previewTheme = ref<'light' | 'dark'>('light')
const sectionLabels: Record<typeof activeSection.value, string> = {
    hero: 'Banner Principal',
    navbar: 'Navegação',
    featured: 'Projetos Destaque',
    about: 'Sobre',
    process: 'Processo',
    experience: 'Experiência',
    contact: 'Contato',
    footer: 'Rodapé',
    footerServices: 'Serviços Rodapé',
    seo: 'Título da Aba',
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
        if (map.navbar && typeof map.navbar === 'object') Object.assign(navbar.value, map.navbar)
        if (map.about && typeof map.about === 'object') Object.assign(about.value, map.about)
        if (map.contact && typeof map.contact === 'object') Object.assign(contact.value, map.contact)
        if (map.footer && typeof map.footer === 'object') Object.assign(footer.value, map.footer)
        if (map.featured_projects && typeof map.featured_projects === 'object') Object.assign(featuredProjects.value, map.featured_projects)
        if (map.footer_services && typeof map.footer_services === 'object') {
            const footerServicesValue = map.footer_services as { title?: string; items?: string[] }
            footerServices.value.title = footerServicesValue.title ?? 'Serviços'
            footerServices.value.items = footerServicesValue.items ?? []
        }
        if (map.seo && typeof map.seo === 'object') Object.assign(seo.value, map.seo)
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
const addFooterService = () => footerServices.value.items.push('')
const removeFooterService = (i: number) => footerServices.value.items.splice(i, 1)

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

const heroPreviewImage = computed(() => resolveMediaUrl(hero.value.image_path) || '')

onMounted(load)
</script>

<template>
    <div v-if="isLoading" class="loading">Carregando configurações...</div>

    <div v-else class="settings-editor">
        <nav class="section-nav">
            <button v-for="sec in (['hero', 'navbar', 'featured', 'about', 'process', 'experience', 'contact', 'footer', 'footerServices', 'seo'] as const)"
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

            <div class="live-preview">
                <div class="preview-header">
                    <h3>Preview</h3>
                    <div class="theme-switch" role="group" aria-label="Tema do preview">
                        <button type="button" :class="{ active: previewTheme === 'light' }" @click="previewTheme = 'light'">White mode</button>
                        <button type="button" :class="{ active: previewTheme === 'dark' }" @click="previewTheme = 'dark'">Dark mode</button>
                    </div>
                </div>
                <div class="site-preview-shell">
                    <div class="site-preview" :class="{ 'preview-dark': previewTheme === 'dark' }">
                        <HeroSection :title="hero.title || undefined" :subtitle="hero.subtitle || undefined" :background-image="heroPreviewImage" />
                    </div>
                </div>
            </div>
        </form>

        <!-- Navbar -->
        <form v-else-if="activeSection === 'navbar'" class="section-form" @submit.prevent="save('navbar', navbar)">
            <h2>Navegação</h2>
            <p class="section-help">Customize marca e rótulos do menu principal.</p>
            <div class="form-grid">
                <div class="field"><label>Nome da marca</label><input v-model="navbar.brand_name" /></div>
                <div class="field"><label>Subtítulo da marca</label><input v-model="navbar.brand_role" /></div>
                <div class="field"><label>Rótulo Home</label><input v-model="navbar.home_label" /></div>
                <div class="field"><label>Rótulo Projetos</label><input v-model="navbar.projects_label" /></div>
                <div class="field"><label>Rótulo Sobre</label><input v-model="navbar.about_label" /></div>
                <div class="field"><label>Rótulo Contato</label><input v-model="navbar.contact_label" /></div>
            </div>
            <button type="submit" class="btn-save" :disabled="isSaving">Salvar Navegação</button>
        </form>

        <!-- Featured Projects -->
        <form v-else-if="activeSection === 'featured'" class="section-form"
            @submit.prevent="save('featured_projects', featuredProjects)">
            <h2>Projetos em Destaque</h2>
            <p class="section-help">Defina título e descrição da seção exibida na home.</p>
            <div class="field">
                <label>Título</label>
                <input v-model="featuredProjects.title" />
            </div>
            <div class="field">
                <label>Descrição</label>
                <textarea v-model="featuredProjects.description" rows="3"></textarea>
            </div>
            <button type="submit" class="btn-save" :disabled="isSaving">Salvar Projetos Destaque</button>

            <div class="live-preview">
                <div class="preview-header">
                    <h3>Preview</h3>
                    <div class="theme-switch" role="group" aria-label="Tema do preview">
                        <button type="button" :class="{ active: previewTheme === 'light' }" @click="previewTheme = 'light'">White mode</button>
                        <button type="button" :class="{ active: previewTheme === 'dark' }" @click="previewTheme = 'dark'">Dark mode</button>
                    </div>
                </div>
                <div class="site-preview-shell">
                    <div class="site-preview" :class="{ 'preview-dark': previewTheme === 'dark' }">
                        <FeaturedProjects :projects="[]" :title="featuredProjects.title" :description="featuredProjects.description" />
                    </div>
                </div>
            </div>
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

            <div class="live-preview">
                <div class="preview-header">
                    <h3>Preview</h3>
                    <div class="theme-switch" role="group" aria-label="Tema do preview">
                        <button type="button" :class="{ active: previewTheme === 'light' }" @click="previewTheme = 'light'">White mode</button>
                        <button type="button" :class="{ active: previewTheme === 'dark' }" @click="previewTheme = 'dark'">Dark mode</button>
                    </div>
                </div>
                <div class="site-preview-shell">
                    <div class="site-preview" :class="{ 'preview-dark': previewTheme === 'dark' }">
                        <AboutSection :text="about.text || undefined" :image="resolveMediaUrl(about.image_path) || undefined" />
                    </div>
                </div>
            </div>
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

            <div class="live-preview">
                <div class="preview-header">
                    <h3>Preview</h3>
                    <div class="theme-switch" role="group" aria-label="Tema do preview">
                        <button type="button" :class="{ active: previewTheme === 'light' }" @click="previewTheme = 'light'">White mode</button>
                        <button type="button" :class="{ active: previewTheme === 'dark' }" @click="previewTheme = 'dark'">Dark mode</button>
                    </div>
                </div>
                <div class="site-preview-shell">
                    <div class="site-preview" :class="{ 'preview-dark': previewTheme === 'dark' }">
                        <ProcessSection :title="process.title || undefined" :steps="process.steps" />
                    </div>
                </div>
            </div>
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

            <div class="live-preview">
                <div class="preview-header">
                    <h3>Preview</h3>
                    <div class="theme-switch" role="group" aria-label="Tema do preview">
                        <button type="button" :class="{ active: previewTheme === 'light' }" @click="previewTheme = 'light'">White mode</button>
                        <button type="button" :class="{ active: previewTheme === 'dark' }" @click="previewTheme = 'dark'">Dark mode</button>
                    </div>
                </div>
                <div class="site-preview-shell">
                    <div class="site-preview" :class="{ 'preview-dark': previewTheme === 'dark' }">
                        <ExperienceSection :title="experience.title || undefined" :subtitle="experience.subtitle || undefined"
                            :blocks="experience.blocks" />
                    </div>
                </div>
            </div>
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

            <div class="live-preview">
                <div class="preview-header">
                    <h3>Preview</h3>
                    <div class="theme-switch" role="group" aria-label="Tema do preview">
                        <button type="button" :class="{ active: previewTheme === 'light' }" @click="previewTheme = 'light'">White mode</button>
                        <button type="button" :class="{ active: previewTheme === 'dark' }" @click="previewTheme = 'dark'">Dark mode</button>
                    </div>
                </div>
                <div class="site-preview-shell">
                    <div class="site-preview" :class="{ 'preview-dark': previewTheme === 'dark' }">
                        <ContactSection :title="contact.title || undefined" :description="contact.description || undefined"
                            :instagram-url="contact.instagram_url || undefined" :linkedin-url="contact.linkedin_url || undefined"
                            :email="contact.email || undefined" :whatsapp-url="contact.whatsapp_url || undefined" />
                    </div>
                </div>
            </div>
        </form>

        <!-- Footer -->
        <form v-else-if="activeSection === 'footer'" class="section-form" @submit.prevent="save('footer', footer)">
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

            <div class="live-preview">
                <div class="preview-header">
                    <h3>Preview</h3>
                    <div class="theme-switch" role="group" aria-label="Tema do preview">
                        <button type="button" :class="{ active: previewTheme === 'light' }" @click="previewTheme = 'light'">White mode</button>
                        <button type="button" :class="{ active: previewTheme === 'dark' }" @click="previewTheme = 'dark'">Dark mode</button>
                    </div>
                </div>
                <div class="site-preview-shell">
                    <div class="site-preview" :class="{ 'preview-dark': previewTheme === 'dark' }">
                        <Footer :brand-name="footer.brand_name || undefined" :brand-subtitle="footer.brand_subtitle || undefined"
                            :email="footer.email || undefined" :phone="footer.phone || undefined" :city="footer.city || undefined"
                            :instagram-url="footer.instagram_url || undefined" :linkedin-url="footer.linkedin_url || undefined"
                            :copyright-text="footer.copyright || undefined" :cau="footer.cau || undefined"
                            :services-title="footerServices.title || undefined" :services-items="footerServices.items" />
                    </div>
                </div>
            </div>
        </form>

        <!-- Footer Services -->
        <form v-else-if="activeSection === 'footerServices'" class="section-form"
            @submit.prevent="save('footer_services', footerServices)">
            <h2>Serviços no Rodapé</h2>
            <p class="section-help">Personalize o título e a lista de serviços mostrados no rodapé.</p>

            <div class="field">
                <label>Título da seção</label>
                <input v-model="footerServices.title" />
            </div>

            <div class="repeater">
                <h3>Itens</h3>
                <div v-for="(_, i) in footerServices.items" :key="i" class="repeater-item">
                    <input v-model="footerServices.items[i]" placeholder="Nome do serviço" />
                    <button type="button" class="btn-remove" @click="removeFooterService(i)">×</button>
                </div>
                <button type="button" class="btn-add" @click="addFooterService">+ Adicionar serviço</button>
            </div>

            <button type="submit" class="btn-save" :disabled="isSaving">Salvar Serviços do Rodapé</button>
        </form>

        <!-- SEO -->
        <form v-else class="section-form" @submit.prevent="save('seo', seo)">
            <h2>Título da Aba e Google</h2>
            <p class="section-help">Preencha como seu site deve aparecer na aba do navegador e em resultados de busca.</p>
            <div class="field">
                <label>Nome do site (título)</label>
                <input v-model="seo.title" maxlength="255" />
            </div>
            <div class="field">
                <label>Descrição curta do site</label>
                <textarea v-model="seo.description" rows="3" maxlength="320"></textarea>
            </div>
            <button type="submit" class="btn-save" :disabled="isSaving">Salvar Título e Descrição</button>
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

.live-preview {
    margin-top: 1rem;
    border-top: 1px solid color-mix(in srgb, var(--contrast-brown) 18%, transparent);
    padding-top: 0.9rem;
}

.preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
    margin-bottom: 0.6rem;
}

.preview-header h3 {
    margin: 0;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--contrast-gold);
}

.theme-switch {
    display: inline-flex;
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 30%, transparent);
    border-radius: 999px;
    overflow: hidden;
}

.theme-switch button {
    border: none;
    background: transparent;
    color: var(--contrast-brown);
    font-size: 0.72rem;
    padding: 0.3rem 0.65rem;
    cursor: pointer;
}

.theme-switch button.active {
    background: var(--contrast-gold);
    color: var(--primary-text);
    font-weight: 700;
}

.site-preview-shell {
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 24%, transparent);
    border-radius: 12px;
    overflow: hidden;
    background: color-mix(in srgb, var(--background) 96%, black 4%);
}

.site-preview {
    --background: #ECECEC;
    --primary-text: #333333;
    --contrast-gold: #B4A078;
    --contrast-brown: #8C857A;
    --accent: #6C7883;
    --hero-text: #ffffff;
    --hero-overlay: rgba(0, 0, 0, 0.55);

    height: 420px;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    scrollbar-gutter: stable both-edges;

    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--contrast-brown) 65%, transparent)
        color-mix(in srgb, var(--background) 88%, black 12%);
}

.site-preview.preview-dark {
    --background: #1A1A1A;
    --primary-text: #FFFFFF;
    --contrast-gold: #A0895F;
    --contrast-brown: #6B6354;
    --accent: #5A6978;
    --hero-text: #ffffff;
    --hero-overlay: rgba(0, 0, 0, 0.65);
}

.site-preview :deep(.hero) {
    height: 340px;
}

.site-preview :deep(section) {
    min-width: 0;
}

/* WebKit */
.site-preview::-webkit-scrollbar {
    width: 10px;
}

.site-preview::-webkit-scrollbar-track {
    background: color-mix(in srgb, var(--background) 88%, black 12%);
    border-left: 1px solid color-mix(in srgb, var(--contrast-brown) 18%, transparent);
}

.site-preview::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--contrast-brown) 65%, transparent);
    border-radius: 999px;
    border: 2px solid color-mix(in srgb, var(--background) 88%, black 12%);
}

.site-preview::-webkit-scrollbar-thumb:hover {
    background: color-mix(in srgb, var(--contrast-gold) 62%, var(--contrast-brown) 38%);
}

.site-preview :deep(a),
.site-preview :deep(button),
.site-preview :deep(input),
.site-preview :deep(textarea) {
    pointer-events: none;
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
