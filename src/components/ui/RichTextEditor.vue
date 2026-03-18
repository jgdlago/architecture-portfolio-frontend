<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    minHeight?: string
  }>(),
  {
    modelValue: '',
    placeholder: 'Digite aqui...',
    minHeight: '180px',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref<HTMLDivElement | null>(null)
const isFocused = ref(false)
const isSyncing = ref(false)

const editorStyle = computed(() => ({
  minHeight: props.minHeight,
}))

const syncFromModel = () => {
  if (!editorRef.value || isFocused.value) {
    return
  }

  const normalized = props.modelValue || ''
  if (editorRef.value.innerHTML !== normalized) {
    isSyncing.value = true
    editorRef.value.innerHTML = normalized
    isSyncing.value = false
  }
}

const emitContent = () => {
  if (!editorRef.value || isSyncing.value) {
    return
  }

  emit('update:modelValue', editorRef.value.innerHTML)
}

const exec = (command: string, value?: string) => {
  editorRef.value?.focus()
  document.execCommand(command, false, value)
  emitContent()
}

const setHeading = (tag: 'p' | 'h2' | 'h3') => {
  exec('formatBlock', tag.toUpperCase())
}

const addLink = () => {
  const url = window.prompt('URL do link')
  if (!url) {
    return
  }

  exec('createLink', url)
}

onMounted(() => {
  syncFromModel()
})

watch(
  () => props.modelValue,
  () => {
    syncFromModel()
  },
)

onBeforeUnmount(() => {
  emitContent()
})
</script>

<template>
  <div class="editor-shell">
    <div class="toolbar" role="toolbar" aria-label="Editor de texto">
      <button type="button" @click="setHeading('p')">P</button>
      <button type="button" @click="setHeading('h2')">H2</button>
      <button type="button" @click="setHeading('h3')">H3</button>
      <button type="button" @click="exec('bold')"><strong>B</strong></button>
      <button type="button" @click="exec('italic')"><em>I</em></button>
      <button type="button" @click="exec('insertUnorderedList')">Lista</button>
      <button type="button" @click="addLink">Link</button>
      <button type="button" @click="exec('removeFormat')">Limpar</button>
    </div>

    <div
      ref="editorRef"
      class="editor"
      :style="editorStyle"
      contenteditable="true"
      :data-placeholder="placeholder"
      @focus="isFocused = true"
      @blur="isFocused = false; emitContent()"
      @input="emitContent"
    />
  </div>
</template>

<style scoped>
.editor-shell {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: color-mix(in srgb, var(--surface) 96%, transparent);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding: 0.45rem;
  border-bottom: 1px solid color-mix(in srgb, var(--contrast-brown) 22%, transparent);
}

.toolbar button {
  border: 1px solid color-mix(in srgb, var(--contrast-brown) 30%, transparent);
  background: color-mix(in srgb, var(--surface-elevated) 90%, transparent);
  color: var(--primary-text);
  border-radius: 6px;
  padding: 0.32rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
}

.toolbar button:hover {
  border-color: color-mix(in srgb, var(--contrast-gold) 62%, transparent);
}

.editor {
  padding: 0.7rem 0.8rem;
  outline: none;
  line-height: 1.7;
}

.editor:empty::before {
  content: attr(data-placeholder);
  color: color-mix(in srgb, var(--contrast-brown) 70%, transparent);
}

.editor :deep(h2) {
  font-size: 1.4rem;
  margin: 0.65rem 0;
}

.editor :deep(h3) {
  font-size: 1.12rem;
  margin: 0.55rem 0;
}

.editor :deep(p) {
  margin: 0.45rem 0;
}

.editor :deep(ul) {
  margin: 0.35rem 0;
  padding-left: 1.25rem;
}
</style>
