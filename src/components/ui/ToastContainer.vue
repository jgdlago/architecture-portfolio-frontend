<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const { toasts } = useToast()
</script>

<template>
    <Teleport to="body">
        <div class="toast-container">
            <TransitionGroup name="toast">
                <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type">
                    {{ toast.message }}
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<style scoped>
.toast-container {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    pointer-events: none;
}

.toast {
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #fff;
    pointer-events: auto;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    max-width: 380px;
}

.toast.success {
    background: #2d913f;
}

.toast.error {
    background: #b83333;
}

.toast.info {
    background: var(--accent, #6C7883);
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(60px);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(60px);
}
</style>
