<script setup>
import { useToast } from '@/composables/useToast'
const { toasts, remove } = useToast()

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
}
const colors = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 min-w-[280px]">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm shadow-lg cursor-pointer"
          :class="colors[t.type]"
          @click="remove(t.id)"
        >
          <span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {{ icons[t.type] }}
          </span>
          {{ t.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to { opacity: 0; transform: translateX(100%); }
</style>
