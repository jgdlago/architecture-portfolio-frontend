<script setup lang="ts">
import { fetchAdminSettings, upsertAdminSetting } from '@/api/admin'
import type { ThemeColors, ThemePalette, ThemeTypography } from '@/api/theme'
import { applyThemeSettings, getDefaultThemeSettings } from '@/composables/useCustomTheme'
import { useToast } from '@/composables/useToast'
import { getApiErrorMessage, getFieldErrors } from '@/utils/apiErrors'
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, ref } from 'vue'

type SiteSettingItem = {
    id: number
    key: string
    value: unknown
}

const COLOR_FIELDS: Array<{ key: keyof ThemePalette; label: string }> = [
    { key: 'background', label: 'Fundo' },
    { key: 'surface', label: 'Superficie' },
    { key: 'surface_elevated', label: 'Superficie elevada' },
    { key: 'primary_text', label: 'Texto principal' },
    { key: 'contrast_gold', label: 'Contraste dourado' },
    { key: 'contrast_brown', label: 'Contraste marrom' },
    { key: 'accent', label: 'Acento' },
    { key: 'hero_text', label: 'Texto do hero' },
]

const HEADING_FONTS = [
    'Playfair Display',
    'Cormorant Garamond',
    'Lora',
    'Merriweather',
    'DM Serif Display',
]

const BODY_FONTS = [
    'Inter',
    'Open Sans',
    'Source Sans 3',
    'Roboto',
    'Lato',
]

const toast = useToast()
const isLoading = ref(true)
const isSaving = ref(false)
const showResetModal = ref(false)
const previewMode = ref<'light' | 'dark'>('light')
const fieldErrors = ref<Record<string, string>>({})

const defaults = getDefaultThemeSettings()
const themeColors = ref<ThemeColors>(JSON.parse(JSON.stringify(defaults.colors)) as ThemeColors)
const themeTypography = ref<ThemeTypography>({ ...defaults.typography })
const activePreviewPalette = computed(() => themeColors.value[previewMode.value])

const previewStyles = computed(() => ({
    '--preview-bg': activePreviewPalette.value.background,
    '--preview-surface': activePreviewPalette.value.surface,
    '--preview-text': activePreviewPalette.value.primary_text,
    '--preview-accent': activePreviewPalette.value.accent,
    '--preview-heading-font': `"${themeTypography.value.font_heading}", serif`,
    '--preview-body-font': `"${themeTypography.value.font_body}", sans-serif`,
}))

function getError(path: string): string | undefined {
    return fieldErrors.value[path]
}

function loadFromSettings(settings: SiteSettingItem[]): void {
    const map = settings.reduce<Record<string, unknown>>((acc, setting) => {
        acc[setting.key] = setting.value
        return acc
    }, {})

    const result = applyThemeSettings(
        map.theme_colors ?? defaults.colors,
        map.theme_typography ?? defaults.typography,
    )

    themeColors.value = JSON.parse(JSON.stringify(result.colors)) as ThemeColors
    themeTypography.value = { ...result.typography }
}

async function load(): Promise<void> {
    isLoading.value = true

    try {
        const settings = await fetchAdminSettings()
        loadFromSettings(settings as SiteSettingItem[])
    } catch (error) {
        toast.error(getApiErrorMessage(error, 'Erro ao carregar configuracoes de aparencia.'))
        const result = applyThemeSettings(defaults.colors, defaults.typography)
        themeColors.value = JSON.parse(JSON.stringify(result.colors)) as ThemeColors
        themeTypography.value = { ...result.typography }
    } finally {
        isLoading.value = false
    }
}

async function save(): Promise<void> {
    isSaving.value = true
    fieldErrors.value = {}

    try {
        await upsertAdminSetting('theme_colors', themeColors.value)
        await upsertAdminSetting('theme_typography', themeTypography.value)

        applyThemeSettings(themeColors.value, themeTypography.value)
        toast.success('Aparencia atualizada com sucesso.')
    } catch (error) {
        fieldErrors.value = getFieldErrors(error)
        toast.error(getApiErrorMessage(error, 'Erro ao salvar configuracoes de aparencia.'))
    } finally {
        isSaving.value = false
    }
}

function resetDefaults(): void {
    const nextDefaults = getDefaultThemeSettings()
    themeColors.value = nextDefaults.colors
    themeTypography.value = nextDefaults.typography
    applyThemeSettings(themeColors.value, themeTypography.value)
}

function openResetModal(): void {
    showResetModal.value = true
}

function closeResetModal(): void {
    showResetModal.value = false
}

function confirmResetDefaults(): void {
    resetDefaults()
    closeResetModal()
    toast.info('Valores padrao aplicados localmente. Salve para persistir no site.')
}

onMounted(load)
</script>

<template>
    <section class="customization">
        <div class="customization-head">
            <h2>Aparencia</h2>
            <p>Defina paleta de cores e tipografia do portfolio.</p>
        </div>

        <div v-if="isLoading" class="loading">Carregando personalizacao...</div>

        <form v-else class="customization-form" @submit.prevent="save">
            <div class="panel-grid">
                <article class="panel">
                    <h3>Paleta - Tema Claro</h3>
                    <div class="color-list">
                        <label v-for="field in COLOR_FIELDS" :key="`light-${field.key}`" class="color-row">
                            <span>{{ field.label }}</span>
                            <input v-model="themeColors.light[field.key]" type="color" />
                            <input v-model="themeColors.light[field.key]" type="text" class="hex-input" />
                        </label>
                    </div>
                </article>

                <article class="panel">
                    <h3>Paleta - Tema Escuro</h3>
                    <div class="color-list">
                        <label v-for="field in COLOR_FIELDS" :key="`dark-${field.key}`" class="color-row">
                            <span>{{ field.label }}</span>
                            <input v-model="themeColors.dark[field.key]" type="color" />
                            <input v-model="themeColors.dark[field.key]" type="text" class="hex-input" />
                        </label>
                    </div>
                </article>
            </div>

            <article class="panel">
                <h3>Tipografia</h3>
                <div class="typography-grid">
                    <label>
                        <span>Fonte de titulos</span>
                        <select v-model="themeTypography.font_heading">
                            <option v-for="font in HEADING_FONTS" :key="font" :value="font">{{ font }}</option>
                        </select>
                        <small v-if="getError('font_heading')" class="error">{{ getError('font_heading') }}</small>
                    </label>

                    <label>
                        <span>Fonte de textos</span>
                        <select v-model="themeTypography.font_body">
                            <option v-for="font in BODY_FONTS" :key="font" :value="font">{{ font }}</option>
                        </select>
                        <small v-if="getError('font_body')" class="error">{{ getError('font_body') }}</small>
                    </label>

                    <label>
                        <span>Tamanho base</span>
                        <input v-model="themeTypography.font_size_body" type="text" placeholder="1rem" />
                        <small v-if="getError('font_size_body')" class="error">{{ getError('font_size_body') }}</small>
                    </label>

                    <label>
                        <span>Altura de linha</span>
                        <input v-model="themeTypography.line_height_body" type="text" placeholder="1.7" />
                        <small v-if="getError('line_height_body')" class="error">{{ getError('line_height_body') }}</small>
                    </label>
                </div>
            </article>

            <article class="preview" :style="previewStyles">
                <div class="preview-header">
                    <h3>Preview rapido</h3>
                    <div class="theme-switch" role="group" aria-label="Tema do preview">
                        <button type="button" :class="{ active: previewMode === 'light' }" @click="previewMode = 'light'"><SunIcon aria-hidden="true" /><span class="sr-only">Modo claro</span></button>
                        <button type="button" :class="{ active: previewMode === 'dark' }" @click="previewMode = 'dark'"><MoonIcon aria-hidden="true" /><span class="sr-only">Modo escuro</span></button>
                    </div>
                </div>
                <h4>Arquitetura como narrativa espacial</h4>
                <p>
                    Este preview mostra uma aproximacao da combinacao atual entre cores e fontes.
                </p>
                <button type="button" class="preview-button">Botao de exemplo</button>
            </article>

            <div class="actions">
                <button type="button" class="btn-secondary" @click="openResetModal">Restaurar padroes</button>
                <button type="submit" class="btn-primary" :disabled="isSaving">{{ isSaving ? 'Salvando...' : 'Salvar Aparencia' }}</button>
            </div>
        </form>

        <div v-if="showResetModal" class="modal-overlay" @click.self="closeResetModal">
            <div class="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="reset-modal-title">
                <h3 id="reset-modal-title">Restaurar aparencia original?</h3>
                <p>
                    Isso vai substituir as alteracoes atuais no formulario pelos valores padrao.
                    Para refletir no site, voce ainda precisa clicar em "Salvar Aparencia".
                </p>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" @click="closeResetModal">Cancelar</button>
                    <button type="button" class="btn-danger" @click="confirmResetDefaults">Restaurar</button>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.customization {
    display: grid;
    gap: var(--space-6);
}

.customization-head h2 {
    margin: 0;
    font-family: var(--font-family-heading);
    font-size: clamp(1.5rem, 3vw, 2rem);
}

.customization-head p {
    margin: var(--space-2) 0 0;
    color: var(--contrast-brown);
}

.loading {
    padding: var(--space-8);
    text-align: center;
    border: 1px dashed var(--border);
    border-radius: var(--radius-lg);
    color: var(--contrast-brown);
}

.customization-form {
    display: grid;
    gap: var(--space-5);
}

.panel-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-4);
}

.panel {
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: color-mix(in srgb, var(--surface-elevated) 94%, black 6%);
    padding: var(--space-4);
}

.panel h3 {
    margin: 0 0 var(--space-4);
    font-size: 0.95rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.color-list {
    display: grid;
    gap: var(--space-3);
}

.color-row {
    display: grid;
    grid-template-columns: 1fr 56px 110px;
    gap: var(--space-2);
    align-items: center;
}

.color-row span {
    font-size: 0.85rem;
}

.color-row input[type='color'] {
    width: 100%;
    min-height: 2.2rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: transparent;
}

.hex-input {
    width: 100%;
    min-height: 2.2rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface);
    color: var(--primary-text);
    font-size: 0.8rem;
    padding: 0.45rem 0.55rem;
}

.typography-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-4);
}

.typography-grid label {
    display: grid;
    gap: var(--space-2);
}

.typography-grid span {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.typography-grid select,
.typography-grid input {
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    min-height: 2.4rem;
    padding: 0.45rem 0.65rem;
    background: var(--surface);
    color: var(--primary-text);
}

.error {
    color: #b83333;
    font-size: 0.76rem;
}

.preview {
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--preview-bg);
    color: var(--preview-text);
    padding: var(--space-5);
}

.preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
    margin-bottom: 0.6rem;
}

.preview h3 {
    margin: 0;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--contrast-gold);
}

.theme-switch {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem;
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 30%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--surface) 94%, transparent);
}

.theme-switch button {
    border: 1px solid transparent;
    background: transparent;
    color: var(--contrast-brown);
    width: 2rem;
    height: 2rem;
    border-radius: 999px;
    display: grid;
    place-items: center;
    padding: 0;
    cursor: pointer;
    transition: background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
}

.theme-switch button:hover {
    transform: translateY(-1px);
    background: color-mix(in srgb, var(--surface-elevated) 84%, transparent);
}

.theme-switch button.active {
    background: color-mix(in srgb, var(--contrast-gold) 26%, transparent);
    border-color: color-mix(in srgb, var(--contrast-gold) 58%, transparent);
    color: var(--primary-text);
}

.theme-switch button svg {
    width: 1rem;
    height: 1rem;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.preview h4 {
    margin: var(--space-3) 0 0;
    font-family: var(--preview-heading-font);
    font-size: 1.6rem;
}

.preview p {
    margin: var(--space-3) 0 0;
    font-family: var(--preview-body-font);
}

.preview-button {
    margin-top: var(--space-4);
    border: none;
    border-radius: var(--radius-md);
    min-height: 2.4rem;
    padding: 0 var(--space-4);
    background: var(--preview-accent);
    color: #ffffff;
    font-weight: 600;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
}

.btn-secondary,
.btn-primary {
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    min-height: 2.5rem;
    padding: 0 var(--space-4);
    cursor: pointer;
    font-weight: 600;
}

.btn-secondary {
    background: transparent;
    color: var(--primary-text);
}

.btn-primary {
    background: color-mix(in srgb, var(--contrast-gold) 35%, var(--surface));
    color: var(--primary-text);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 180;
    display: grid;
    place-items: center;
    padding: var(--space-4);
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(2px);
}

.confirm-modal {
    width: min(520px, 100%);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: color-mix(in srgb, var(--surface-elevated) 96%, black 4%);
    box-shadow: var(--shadow-xl);
    padding: var(--space-5);
}

.confirm-modal h3 {
    margin: 0;
    font-size: 1.1rem;
}

.confirm-modal p {
    margin: var(--space-3) 0 0;
    color: var(--contrast-brown);
}

.modal-actions {
    margin-top: var(--space-5);
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
}

.btn-danger {
    border: 1px solid color-mix(in srgb, #b83333 72%, transparent);
    border-radius: var(--radius-md);
    min-height: 2.5rem;
    padding: 0 var(--space-4);
    cursor: pointer;
    font-weight: 700;
    background: color-mix(in srgb, #b83333 20%, transparent);
    color: #b83333;
}

@media (max-width: 900px) {
    .panel-grid,
    .typography-grid {
        grid-template-columns: 1fr;
    }
}
</style>
