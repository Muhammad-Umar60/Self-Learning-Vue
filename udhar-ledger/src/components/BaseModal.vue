<script setup>
defineProps({ title: String, maxWidth: { type: String, default: 'max-w-lg' } })
defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="$emit('close')">
      <div :class="['bg-white rounded-2xl shadow-2xl w-full', maxWidth]">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 class="text-base font-semibold text-gray-800">{{ title }}</h3>
          <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="px-6 py-5"><slot /></div>
        <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3"><slot name="footer" /></div>
      </div>
    </div>
  </Teleport>
</template>
