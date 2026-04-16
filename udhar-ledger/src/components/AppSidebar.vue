<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps({ open: Boolean })
defineEmits(['close'])

const route = useRoute()

const links = [
  { name: 'dashboard', label: 'Dashboard', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'parties', label: 'Parties', path: '/parties', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { name: 'transactions', label: 'Transactions', path: '/transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { name: 'ledger', label: 'Ledger / Report', path: '/ledger', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
]

const isActive = (path) => route.path === path
</script>

<template>
  <aside class="flex flex-col h-full bg-[#0f172a] text-white w-64">
    <!-- Logo -->
    <div class="px-6 py-5 border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-bold text-white leading-tight">Udhar Ledger</p>
          <p class="text-xs text-white/40">Battery & Lead Trading</p>
        </div>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <RouterLink
        v-for="link in links"
        :key="link.name"
        :to="link.path"
        @click="$emit('close')"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
        :class="isActive(link.path)
          ? 'bg-blue-500 text-white font-medium'
          : 'text-white/60 hover:text-white hover:bg-white/10'"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="link.icon"/>
        </svg>
        {{ link.label }}
      </RouterLink>
    </nav>

    <!-- Footer -->
    <div class="px-6 py-4 border-t border-white/10 text-xs text-white/30">
      Data saved locally in browser
    </div>
  </aside>
</template>
