<script setup lang="ts">
import { uploadFile } from '@/api/admin';
import { resolveMediaUrl } from '@/api/http';
import { useToast } from '@/composables/useToast';
import { ref } from 'vue';

const props = defineProps<{
    modelValue?: string | null
    folder?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
    uploaded: [data: { path: string; url: string }]
}>()

const isUploading = ref(false)
const previewUrl = ref('')
const toast = useToast()

const handleFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    isUploading.value = true
    try {
        const result = await uploadFile(file, props.folder ?? 'uploads')
        previewUrl.value = result.url
        emit('update:modelValue', result.path)
        emit('uploaded', result)
    } catch {
        toast.error('Erro ao enviar imagem. Tente novamente.')
    } finally {
        isUploading.value = false
        input.value = ''
    }
}

const currentPreview = () => {
    if (previewUrl.value) return previewUrl.value
    if (props.modelValue) return resolveMediaUrl(props.modelValue)
    return ''
}
</script>

<template>
    <div class="image-uploader">
        <div v-if="currentPreview()" class="preview">
            <img :src="currentPreview()" alt="Preview" />
        </div>
        <label class="upload-btn" :class="{ disabled: isUploading }">
            {{ isUploading ? 'Enviando...' : currentPreview() ? 'Trocar imagem' : 'Selecionar imagem' }}
            <input type="file" accept="image/jpeg,image/png,image/webp" :disabled="isUploading"
                @change="handleFileChange" />
        </label>
    </div>
</template>

<style scoped>
.image-uploader {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.preview {
    border-radius: 8px;
    overflow: hidden;
    max-height: 180px;
}

.preview img {
    width: 100%;
    height: 180px;
    object-fit: cover;
}

.upload-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 1rem;
    border: 1px dashed color-mix(in srgb, var(--contrast-brown) 50%, transparent);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    color: var(--contrast-brown);
    transition: border-color 0.2s;
}

.upload-btn:hover {
    border-color: var(--contrast-gold);
}

.upload-btn.disabled {
    opacity: 0.5;
    pointer-events: none;
}

.upload-btn input {
    display: none;
}
</style>
