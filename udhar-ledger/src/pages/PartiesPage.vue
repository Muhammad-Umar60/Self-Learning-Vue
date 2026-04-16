<script setup>
import { ref, computed } from 'vue'
import { useStorage } from '@/composables/useStorage'
import { useLedger } from '@/composables/useLedger'
import { useToast } from '@/composables/useToast'
import { formatCurrency, formatDate } from '@/utils/formatters'
import BaseModal from '@/components/BaseModal.vue'

const { parties, addParty, updateParty, deleteParty } = useStorage()
const { partyBalance } = useLedger()
const { success, error } = useToast()

const search = ref('')
const filter = ref('all')
const showModal = ref(false)
const editingParty = ref(null)
const showDeleteConfirm = ref(null)

const form = ref({ name: '', phone: '', address: '' })
const formErrors = ref({})

const filtered = computed(() => {
  let list = parties.value
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q) || (p.phone && p.phone.includes(q)))
  }
  if (filter.value === 'receivable') list = list.filter(p => partyBalance(p.id) > 0)
  if (filter.value === 'payable') list = list.filter(p => partyBalance(p.id) < 0)
  if (filter.value === 'clear') list = list.filter(p => partyBalance(p.id) === 0)
  return list
})

const openAdd = () => {
  editingParty.value = null
  form.value = { name: '', phone: '', address: '' }
  formErrors.value = {}
  showModal.value = true
}

const openEdit = (party) => {
  editingParty.value = party
  form.value = { name: party.name, phone: party.phone || '', address: party.address || '' }
  formErrors.value = {}
  showModal.value = true
}

const validate = () => {
  formErrors.value = {}
  if (!form.value.name.trim()) formErrors.value.name = 'Name is required'
  return Object.keys(formErrors.value).length === 0
}

const submit = () => {
  if (!validate()) return
  if (editingParty.value) {
    updateParty(editingParty.value.id, form.value)
    success('Party updated successfully')
  } else {
    addParty(form.value)
    success('Party added successfully')
  }
  showModal.value = false
}

const confirmDelete = (party) => {
  showDeleteConfirm.value = party
}

const doDelete = () => {
  deleteParty(showDeleteConfirm.value.id)
  success('Party and all their transactions deleted')
  showDeleteConfirm.value = null
}

const balanceColor = (bal) => bal > 0 ? 'text-emerald-600' : bal < 0 ? 'text-red-500' : 'text-gray-400'
const badgeClass = (bal) => bal > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : bal < 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-400 border-gray-100'
</script>

<template>
  <div class="p-6 space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Parties</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ parties.length }} total parties</p>
      </div>
      <button @click="openAdd" class="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2.5 rounded-xl transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Add Party
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1 relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input v-model="search" type="text" placeholder="Search by name or phone..." class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
      </div>
      <div class="flex gap-2">
        <button v-for="f in [{v:'all',l:'All'},{v:'receivable',l:'Receivable'},{v:'payable',l:'Payable'},{v:'clear',l:'Clear'}]" :key="f.v"
          @click="filter = f.v"
          class="px-3 py-2 text-xs rounded-xl border transition-colors"
          :class="filter === f.v ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'"
        >
          {{ f.l }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div v-if="filtered.length === 0" class="py-16 text-center">
        <p class="text-gray-400 text-sm">No parties found</p>
      </div>
      <table v-else class="w-full">
        <thead>
          <tr class="bg-gray-50 text-left">
            <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Party</th>
            <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Phone</th>
            <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Address</th>
            <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Balance</th>
            <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="p in filtered" :key="p.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  :class="partyBalance(p.id) > 0 ? 'bg-emerald-100 text-emerald-700' : partyBalance(p.id) < 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'">
                  {{ p.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-800">{{ p.name }}</p>
                  <p class="text-xs text-gray-400 md:hidden">{{ p.phone || '—' }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-4 text-sm text-gray-600 hidden md:table-cell">{{ p.phone || '—' }}</td>
            <td class="px-5 py-4 text-sm text-gray-600 hidden lg:table-cell max-w-xs truncate">{{ p.address || '—' }}</td>
            <td class="px-5 py-4 text-right">
              <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border" :class="badgeClass(partyBalance(p.id))">
                {{ partyBalance(p.id) === 0 ? 'Clear' : (partyBalance(p.id) > 0 ? '↑ ' : '↓ ') + 'Rs ' + formatCurrency(partyBalance(p.id)) }}
              </span>
            </td>
            <td class="px-5 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <RouterLink :to="'/ledger?party=' + p.id" class="text-xs text-blue-500 hover:text-blue-700 font-medium">Ledger</RouterLink>
                <button @click="openEdit(p)" class="text-xs text-gray-500 hover:text-gray-700 font-medium">Edit</button>
                <button @click="confirmDelete(p)" class="text-xs text-red-400 hover:text-red-600 font-medium">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <BaseModal v-if="showModal" :title="editingParty ? 'Edit Party' : 'Add New Party'" @close="showModal = false">
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1.5">Name *</label>
          <input v-model="form.name" type="text" placeholder="e.g. Ali Traders" class="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" :class="formErrors.name ? 'border-red-400' : 'border-gray-200'" />
          <p v-if="formErrors.name" class="text-xs text-red-500 mt-1">{{ formErrors.name }}</p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1.5">Phone (optional)</label>
          <input v-model="form.phone" type="text" placeholder="0300-1234567" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1.5">Address (optional)</label>
          <input v-model="form.address" type="text" placeholder="City, Area" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>
      </div>
      <template #footer>
        <button @click="showModal = false" class="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
        <button @click="submit" class="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors">
          {{ editingParty ? 'Save Changes' : 'Add Party' }}
        </button>
      </template>
    </BaseModal>

    <!-- Delete Confirm -->
    <BaseModal v-if="showDeleteConfirm" title="Delete Party?" @close="showDeleteConfirm = null">
      <p class="text-sm text-gray-600">Are you sure you want to delete <strong>{{ showDeleteConfirm.name }}</strong>? This will also delete all their transactions. This cannot be undone.</p>
      <template #footer>
        <button @click="showDeleteConfirm = null" class="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
        <button @click="doDelete" class="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors">Delete</button>
      </template>
    </BaseModal>
  </div>
</template>
