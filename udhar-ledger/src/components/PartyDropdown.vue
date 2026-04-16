<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStorage } from '@/composables/useStorage'
import { useLedger } from '@/composables/useLedger'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: 'Search party...' },
})
const emit = defineEmits(['update:modelValue'])

const { parties } = useStorage()
const { partyBalance } = useLedger()

const query = ref('')
const open = ref(false)
const inputRef = ref(null)

const selectedParty = computed(() => parties.value.find(p => p.id === props.modelValue))

const filtered = computed(() => {
  if (!query.value) return parties.value
  const q = query.value.toLowerCase()
  return parties.value.filter(p => p.name.toLowerCase().includes(q) || (p.phone && p.phone.includes(q)))
})

const select = (party) => {
  emit('update:modelValue', party.id)
  query.value = ''
  open.value = false
}

const clear = () => {
  emit('update:modelValue', '')
  query.value = ''
}

const onFocus = () => { open.value = true }

const onClickOutside = (e) => {
  if (inputRef.value && !inputRef.value.contains(e.target)) open.value = false
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))

const balanceColor = (bal) => bal > 0 ? 'text-emerald-600' : bal < 0 ? 'text-red-500' : 'text-gray-400'
const balanceLabel = (bal) => bal > 0 ? `+Rs ${formatCurrency(bal)}` : bal < 0 ? `-Rs ${formatCurrency(bal)}` : 'No balance'
</script>

<template>
  <div class="relative" ref="inputRef">
    <div
      class="flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-white cursor-text"
      :class="open ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'"
      @click="inputRef?.querySelector('input')?.focus()"
    >
      <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>

      <template v-if="selectedParty && !open">
        <span class="flex-1 text-sm font-medium text-gray-800">{{ selectedParty.name }}</span>
        <span class="text-xs" :class="balanceColor(partyBalance(selectedParty.id))">
          {{ balanceLabel(partyBalance(selectedParty.id)) }}
        </span>
        <button @click.stop="clear" class="text-gray-300 hover:text-gray-500">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </template>
      <template v-else>
        <input
          class="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
          :placeholder="selectedParty ? selectedParty.name : placeholder"
          v-model="query"
          @focus="onFocus"
        />
      </template>
    </div>

    <Transition name="dropdown">
      <div v-if="open" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-52 overflow-y-auto">
        <div v-if="filtered.length === 0" class="px-4 py-3 text-sm text-gray-400 text-center">No parties found</div>
        <button
          v-for="p in filtered"
          :key="p.id"
          @mousedown.prevent="select(p)"
          class="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
          :class="modelValue === p.id ? 'bg-blue-50' : ''"
        >
          <div>
            <p class="text-sm font-medium text-gray-800">{{ p.name }}</p>
            <p v-if="p.phone" class="text-xs text-gray-400">{{ p.phone }}</p>
          </div>
          <span class="text-xs font-medium" :class="balanceColor(partyBalance(p.id))">
            {{ balanceLabel(partyBalance(p.id)) }}
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
