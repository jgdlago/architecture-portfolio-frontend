import axios from 'axios'

export type FieldErrors = Record<string, string>

export function getFieldErrors(error: unknown): FieldErrors {
    if (!axios.isAxiosError(error)) {
        return {}
    }

    const payload = error.response?.data as { errors?: Record<string, string[] | string> } | undefined
    const errors = payload?.errors

    if (!errors) {
        return {}
    }

    const result: FieldErrors = {}

    for (const [field, messages] of Object.entries(errors)) {
        if (Array.isArray(messages) && messages.length > 0) {
            const firstMessage = messages[0]
            if (firstMessage) {
                result[field] = firstMessage
            }
            continue
        }

        if (typeof messages === 'string') {
            result[field] = messages
        }
    }

    return result
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (!axios.isAxiosError(error)) {
        return fallback
    }

    const payload = error.response?.data as { message?: string; errors?: Record<string, string[] | string> } | undefined

    const fieldErrors = getFieldErrors(error)
    const firstFieldError = Object.values(fieldErrors)[0]

    return firstFieldError || payload?.message || fallback
}
