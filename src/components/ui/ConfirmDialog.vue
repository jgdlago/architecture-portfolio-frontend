<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    danger?: boolean
  }>(),
  {
    title: 'Confirmar ação',
    message: 'Tem certeza que deseja continuar?',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    danger: false,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Transition name="dialog-fade">
    <div v-if="open" class="overlay" role="dialog" aria-modal="true" :aria-label="title">
      <div class="dialog">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="actions">
        <button type="button" class="btn-secondary" @click="emit('cancel')">{{ cancelText }}</button>
        <button type="button" :class="['btn-primary', { danger } ]" @click="emit('confirm')">{{ confirmText }}</button>
      </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
  padding: 1rem;
}

.dialog {
  width: min(420px, 100%);
  background: var(--surface-elevated);
  color: var(--primary-text);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-xl);
  padding: var(--space-5);
}

.dialog h3 {
  margin: 0 0 0.4rem;
  font-size: 1rem;
}

.dialog p {
  margin: 0;
  color: var(--contrast-brown);
  line-height: 1.5;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.actions button {
  border: none;
  border-radius: var(--radius-md);
  padding: 0.5rem 0.9rem;
  cursor: pointer;
  font-weight: 600;
}

.btn-secondary {
  background: color-mix(in srgb, var(--contrast-brown) 18%, transparent);
  color: var(--primary-text);
}

.btn-primary {
  background: var(--contrast-gold);
  color: var(--primary-text);
}

.btn-primary.danger {
  background: color-mix(in srgb, #b83333 28%, transparent);
  color: #b83333;
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.22s ease;
}

.dialog-fade-enter-active .dialog,
.dialog-fade-leave-active .dialog {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-from .dialog,
.dialog-fade-leave-to .dialog {
  transform: scale(0.97) translateY(8px);
  opacity: 0;
}
</style>
