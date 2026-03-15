<script setup lang="ts">
import {
    fetchAdminAccount,
    updateAdminAccount,
    updateAdminAccountPassword,
    type AdminAccount,
} from '@/api/admin'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { getApiErrorMessage, getFieldErrors, type FieldErrors } from '@/utils/apiErrors'
import { onMounted, ref } from 'vue'

const auth = useAuthStore()
const toast = useToast()

const isLoading = ref(true)
const isSavingProfile = ref(false)
const isSavingPassword = ref(false)

const profileErrors = ref<FieldErrors>({})
const passwordErrors = ref<FieldErrors>({})

const profileForm = ref({
    name: '',
    email: '',
    cau: '',
    current_password: '',
})

const passwordForm = ref({
    current_password: '',
    password: '',
    password_confirmation: '',
})

const hydrateProfileForm = (user: AdminAccount | null) => {
    profileForm.value.name = user?.name ?? ''
    profileForm.value.email = user?.email ?? ''
    profileForm.value.cau = user?.cau ?? ''
    profileForm.value.current_password = ''
}

const load = async () => {
    isLoading.value = true

    try {
        if (auth.user) {
            hydrateProfileForm(auth.user)
            return
        }

        const user = await fetchAdminAccount()
        auth.user = user
        hydrateProfileForm(user)
    } catch (error) {
        toast.error(getApiErrorMessage(error, 'Erro ao carregar dados do perfil.'))
    } finally {
        isLoading.value = false
    }
}

const submitProfile = async () => {
    isSavingProfile.value = true
    profileErrors.value = {}

    try {
        const updated = await updateAdminAccount({
            name: profileForm.value.name,
            email: profileForm.value.email,
            cau: profileForm.value.cau || null,
            current_password: profileForm.value.current_password || undefined,
        })

        auth.user = updated
        hydrateProfileForm(updated)
        toast.success('Perfil atualizado com sucesso.')
    } catch (error) {
        profileErrors.value = getFieldErrors(error)
        toast.error(getApiErrorMessage(error, 'Erro ao atualizar perfil.'))
    } finally {
        isSavingProfile.value = false
    }
}

const submitPassword = async () => {
    isSavingPassword.value = true
    passwordErrors.value = {}

    try {
        await updateAdminAccountPassword({
            current_password: passwordForm.value.current_password,
            password: passwordForm.value.password,
            password_confirmation: passwordForm.value.password_confirmation,
        })

        passwordForm.value.current_password = ''
        passwordForm.value.password = ''
        passwordForm.value.password_confirmation = ''

        toast.success('Senha atualizada com sucesso.')
    } catch (error) {
        passwordErrors.value = getFieldErrors(error)
        toast.error(getApiErrorMessage(error, 'Erro ao atualizar senha.'))
    } finally {
        isSavingPassword.value = false
    }
}

onMounted(load)
</script>

<template>
    <section class="profile-admin">
        <div v-if="isLoading" class="loading">Carregando perfil...</div>

        <template v-else>
            <form class="card" @submit.prevent="submitProfile">
                <header>
                    <h2>Perfil do Usuario</h2>
                    <p>Atualize seus dados de acesso do painel administrativo.</p>
                </header>

                <div class="grid">
                    <label class="field">
                        <span>Nome</span>
                        <input v-model="profileForm.name" type="text" autocomplete="name" required />
                        <small v-if="profileErrors.name" class="error">{{ profileErrors.name }}</small>
                    </label>

                    <label class="field">
                        <span>E-mail</span>
                        <input v-model="profileForm.email" type="email" autocomplete="email" required />
                        <small v-if="profileErrors.email" class="error">{{ profileErrors.email }}</small>
                    </label>

                    <label class="field">
                        <span>CAU</span>
                        <input v-model="profileForm.cau" type="text" maxlength="15" />
                        <small v-if="profileErrors.cau" class="error">{{ profileErrors.cau }}</small>
                    </label>

                    <label class="field">
                        <span>Senha atual (obrigatoria ao mudar e-mail)</span>
                        <input
                            v-model="profileForm.current_password"
                            type="password"
                            autocomplete="current-password"
                        />
                        <small v-if="profileErrors.current_password" class="error">{{ profileErrors.current_password }}</small>
                    </label>
                </div>

                <button class="btn-save" type="submit" :disabled="isSavingProfile">
                    {{ isSavingProfile ? 'Salvando...' : 'Salvar perfil' }}
                </button>
            </form>

            <form class="card" @submit.prevent="submitPassword">
                <header>
                    <h2>Trocar Senha</h2>
                    <p>Informe sua senha atual para confirmar a alteracao.</p>
                </header>

                <div class="grid">
                    <label class="field">
                        <span>Senha atual</span>
                        <input
                            v-model="passwordForm.current_password"
                            type="password"
                            autocomplete="current-password"
                            required
                        />
                        <small v-if="passwordErrors.current_password" class="error">{{ passwordErrors.current_password }}</small>
                    </label>

                    <label class="field">
                        <span>Nova senha</span>
                        <input
                            v-model="passwordForm.password"
                            type="password"
                            autocomplete="new-password"
                            minlength="8"
                            required
                        />
                        <small v-if="passwordErrors.password" class="error">{{ passwordErrors.password }}</small>
                    </label>

                    <label class="field">
                        <span>Confirmar nova senha</span>
                        <input
                            v-model="passwordForm.password_confirmation"
                            type="password"
                            autocomplete="new-password"
                            minlength="8"
                            required
                        />
                    </label>
                </div>

                <button class="btn-save" type="submit" :disabled="isSavingPassword">
                    {{ isSavingPassword ? 'Salvando...' : 'Atualizar senha' }}
                </button>
            </form>
        </template>
    </section>
</template>

<style scoped>
.profile-admin {
    display: grid;
    gap: var(--space-6);
}

.loading {
    color: var(--contrast-brown);
    font-size: var(--text-sm);
}

.card {
    background: color-mix(in srgb, var(--background) 96%, black 4%);
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 14%, transparent);
    border-radius: 14px;
    padding: var(--space-5);
    display: grid;
    gap: var(--space-4);
}

.card header h2 {
    margin: 0;
    font-size: var(--text-lg);
}

.card header p {
    margin: var(--space-1) 0 0;
    color: var(--contrast-brown);
    font-size: var(--text-sm);
}

.grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
}

.field {
    display: grid;
    gap: var(--space-1);
}

.field span {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--primary-text);
}

.field input {
    width: 100%;
    border: 1px solid color-mix(in srgb, var(--contrast-brown) 20%, transparent);
    background: var(--background);
    border-radius: 10px;
    padding: 0.6rem 0.75rem;
    color: var(--primary-text);
}

.error {
    color: #c74141;
    font-size: 0.78rem;
}

.btn-save {
    justify-self: flex-start;
    border: none;
    border-radius: 10px;
    padding: 0.6rem 1rem;
    background: var(--contrast-gold);
    color: #2b2620;
    font-weight: 700;
    cursor: pointer;
}

.btn-save:disabled {
    opacity: 0.7;
    cursor: wait;
}

@media (max-width: 900px) {
    .grid {
        grid-template-columns: 1fr;
    }
}
</style>
