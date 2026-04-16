<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import BaseToast from '@/components/BaseToast.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">

    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar — desktop always visible, mobile as drawer -->
    <div
      class="fixed lg:relative inset-y-0 left-0 z-40 transition-transform duration-300 lg:translate-x-0 flex-shrink-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <AppSidebar @close="sidebarOpen = false" />
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Mobile topbar -->
      <div class="lg:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-100">
        <button @click="sidebarOpen = true" class="p-2 rounded-xl hover:bg-gray-100">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <p class="font-bold text-gray-800 text-sm">Udhar Ledger</p>
        </div>
      </div>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>

  </div>

  <BaseToast />
</template>
