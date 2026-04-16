import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  const show = (message, type = 'success', duration = 3000) => {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  const success = (msg) => show(msg, 'success')
  const error = (msg) => show(msg, 'error')
  const info = (msg) => show(msg, 'info')
  const remove = (id) => { toasts.value = toasts.value.filter(t => t.id !== id) }

  return { toasts, success, error, info, remove }
}
