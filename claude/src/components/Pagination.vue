<!-- ============================================================
  Pagination.vue
  LEARNING #1: Reusable Pagination Component

  Concepts demonstrated:
   - Props: currentPage, totalPages
   - Emits: 'update:currentPage' for v-model support
   - Computed page range generation
   - Disabled states for prev/next buttons
============================================================ -->

<template>
  <div class="pagination" v-if="totalPages > 1">

    <!-- Previous Button -->
    <button
      class="page-btn"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      ← Prev
    </button>

    <!-- Page Number Buttons -->
    <!-- pageRange is a computed array like [1, 2, 3, '...', 8] -->
    <template v-for="page in pageRange" :key="page">
      <!-- Ellipsis separator -->
      <span v-if="page === '...'" class="page-ellipsis">…</span>

      <!-- Page number button -->
      <button
        v-else
        class="page-btn"
        :class="{ active: page === currentPage }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
    </template>

    <!-- Next Button -->
    <button
      class="page-btn"
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
    >
      Next →
    </button>

  </div>
</template>

<script setup>
import { computed } from 'vue'

// ---- PROPS ----
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

// ---- EMITS ----
// Using Vue's v-model pattern: 'update:modelValue' allows v-model binding
// But here we use a named event for clarity
const emit = defineEmits(['update:currentPage'])

// ---- COMPUTED: Smart page range with ellipsis ----
// LEARNING #2: computed() used inside a LEARNING #1 component
// Shows: [1, 2, 3, '...', 10] or [1, '...', 4, 5, 6, '...', 10]
const pageRange = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const delta = 1   // pages to show around current

  const range = []

  // Always show first page
  range.push(1)

  if (current - delta > 2) range.push('...')

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }

  if (current + delta < total - 1) range.push('...')

  // Always show last page (if more than 1 page)
  if (total > 1) range.push(total)

  return range
})

// ---- ACTION: Emit page change to parent ----
const changePage = (page) => {
  if (page < 1 || page > props.totalPages) return
  emit('update:currentPage', page)
}
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 48px;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: var(--card-bg);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

.page-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.page-ellipsis {
  color: var(--text-muted);
  font-size: 16px;
  padding: 0 4px;
}
</style>
