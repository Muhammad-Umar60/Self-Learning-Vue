<script setup>
import { ref, computed, watch } from 'vue'
import { useStorage } from '@/composables/useStorage'
import { useLedger } from '@/composables/useLedger'
import { useToast } from '@/composables/useToast'
import { formatCurrency, formatDate, todayISO, TRANSACTION_TYPES, TYPE_META } from '@/utils/formatters'
import BaseModal from '@/components/BaseModal.vue'
import PartyDropdown from '@/components/PartyDropdown.vue'

const { transactions, addTransaction, deleteTransaction, getPartyById } = useStorage()
const { partyBalance } = useLedger()
const { success } = useToast()

const showModal = ref(false)
const showDeleteConfirm = ref(null)
const filterParty = ref('')
const filterType = ref('')
const filterSearch = ref('')

const form = ref({
  partyId: '',
  type: 'Credit Sale',
  amount: '',
  date: todayISO(),
  notes: '',
})
const formErrors = ref({})

const selectedPartyBalance = computed(() => {
  if (!form.value.partyId) return null
  return partyBalance(form.value.partyId)
})

const previewBalance = computed(() => {
  if (!form.value.partyId || !form.value.amount) return null
  const effect = TYPE_META[form.value.type]?.balanceEffect ?? 0
  const current = partyBalance(form.value.partyId)
  return current + effect * Number(form.value.amount)
})

const filteredTx = computed(() => {
  let list = [...transactions.value].sort((a, b) => new Date(b.date) - new Date(a.date) || new Date(b.createdAt) - new Date(a.createdAt))
  if (filterParty.value) list = list.filter(t => t.partyId === filterParty.value)
  if (filterType.value) list = list.filter(t => t.type === filterType.value)
  if (filterSearch.value) {
    const q = filterSearch.value.toLowerCase()
    list = list.filter(t => {
      const party = getPartyById(t.partyId)
      return (party?.name || '').toLowerCase().includes(q) || (t.notes || '').toLowerCase().includes(q)
    })
  }
  return list.map(t => ({ ...t, partyName: getPartyById(t.partyId)?.name ?? 'Unknown' }))
})

const typeColors = {
  'Credit Sale': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Credit Purchase': 'bg-red-50 text-red-600 border-red-100',
  'Payment Received': 'bg-blue-50 text-blue-700 border-blue-100',
  'Payment Paid': 'bg-purple-50 text-purple-700 border-purple-100',
}

const amountColor = (type) => TYPE_META[type]?.balanceEffect > 0 ? 'text-emerald-600' : 'text-red-500'
const amountSign = (type) => TYPE_META[type]?.balanceEffect > 0 ? '+' : '-'

const validate = () => {
  formErrors.value = {}
  if (!form.value.partyId) formErrors.value.partyId = 'Select a party'
  if (!form.value.amount || Number(form.value.amount) <= 0) formErrors.value.amount = 'Enter valid amount'
  if (!form.value.date) formErrors.value.date = 'Date required'
  return Object.keys(formErrors.value).length === 0
}

const submit = () => {
  if (!validate()) return
  addTransaction({ ...form.value, amount: Number(form.value.amount) })
  success(`Transaction added — Rs ${formatCurrency(form.value.amount)}`)
  form.value = { partyId: form.value.partyId, type: form.value.type, amount: '', date: todayISO(), notes: '' }
  formErrors.value = {}
  showModal.value = false
}

const doDelete = () => {
  deleteTransaction(showDeleteConfirm.value.id)
  success('Transaction deleted')
  showDeleteConfirm.value = null
}

const openAdd = () => {
  form.value = { partyId: '', type: 'Credit Sale', amount: '', date: todayISO(), notes: '' }
  formErrors.value = {}
  showModal.value = true
}

const balanceColor = (bal) => bal > 0 ? 'text-emerald-600' : bal < 0 ? 'text-red-500' : 'text-gray-500'
</script>

<template>
  <div class="p-6 space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Transactions</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ transactions.length }} total records</p>
      </div>
      <button @click="openAdd" class="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2.5 rounded-xl transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Add Transaction
      </button>
    </div>

    <!-- Filters row -->
    <div class="flex flex-wrap gap-3">
      <div class="flex-1 min-w-48 relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input v-model="filterSearch" type="text" placeholder="Search by party or note..." class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"/>
      </div>
      <select v-model="filterType" class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-white text-gray-600">
        <option value="">All Types</option>
        <option v-for="t in Object.values(TRANSACTION_TYPES)" :key="t" :value="t">{{ t }}</option>
      </select>
      <button v-if="filterParty || filterType || filterSearch" @click="filterParty=''; filterType=''; filterSearch=''" class="px-3 py-2 text-xs border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
        Clear Filters
      </button>
    </div>

    <!-- Transactions Table -->
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div v-if="filteredTx.length === 0" class="py-16 text-center">
        <p class="text-gray-400 text-sm">No transactions found</p>
        <button @click="openAdd" class="mt-3 text-sm text-blue-500 hover:text-blue-600">Add first transaction →</button>
      </div>
      <div class="overflow-x-auto" v-else>
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 text-left">
              <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Party</th>
              <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
              <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Notes</th>
              <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Amount</th>
              <th class="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="tx in filteredTx" :key="tx.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{{ formatDate(tx.date) }}</td>
              <td class="px-5 py-3.5">
                <p class="text-sm font-medium text-gray-800">{{ tx.partyName }}</p>
              </td>
              <td class="px-5 py-3.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border" :class="typeColors[tx.type]">
                  {{ tx.type }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-sm text-gray-500 hidden md:table-cell max-w-xs truncate">{{ tx.notes || '—' }}</td>
              <td class="px-5 py-3.5 text-right">
                <span class="text-sm font-semibold" :class="amountColor(tx.type)">
                  {{ amountSign(tx.type) }}Rs {{ formatCurrency(tx.amount) }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-right">
                <button @click="showDeleteConfirm = tx" class="text-xs text-red-400 hover:text-red-600 font-medium">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Transaction Modal -->
    <BaseModal v-if="showModal" title="Add Transaction" max-width="max-w-md" @close="showModal = false">
      <div class="space-y-4">
        <!-- Party -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1.5">Party *</label>
          <PartyDropdown v-model="form.partyId" />
          <p v-if="formErrors.partyId" class="text-xs text-red-500 mt-1">{{ formErrors.partyId }}</p>
          <!-- Balance preview -->
          <div v-if="form.partyId" class="mt-2 flex items-center gap-2 text-xs">
            <span class="text-gray-400">Current balance:</span>
            <span class="font-medium" :class="balanceColor(selectedPartyBalance)">
              {{ selectedPartyBalance === 0 ? 'Clear' : (selectedPartyBalance > 0 ? 'Rs ' : '-Rs ') + formatCurrency(selectedPartyBalance) }}
            </span>
          </div>
        </div>

        <!-- Type -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1.5">Transaction Type *</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="t in Object.values(TRANSACTION_TYPES)" :key="t"
              @click="form.type = t"
              class="px-3 py-2 text-xs rounded-xl border transition-all text-left"
              :class="form.type === t ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <!-- Amount -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1.5">Amount (Rs) *</label>
          <input
            v-model="form.amount"
            type="number"
            placeholder="0"
            min="1"
            class="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            :class="formErrors.amount ? 'border-red-400' : 'border-gray-200'"
          />
          <p v-if="formErrors.amount" class="text-xs text-red-500 mt-1">{{ formErrors.amount }}</p>
        </div>

        <!-- Date -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1.5">Date *</label>
          <input v-model="form.date" type="date" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"/>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1.5">Notes (optional)</label>
          <input v-model="form.notes" type="text" placeholder="e.g. 5x 100Ah batteries" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"/>
        </div>

        <!-- After-transaction preview -->
        <div v-if="previewBalance !== null" class="bg-gray-50 rounded-xl p-3 text-xs">
          <p class="text-gray-500 mb-1">After this transaction, balance will be:</p>
          <p class="font-semibold text-base" :class="balanceColor(previewBalance)">
            {{ previewBalance === 0 ? 'Clear (Rs 0)' : (previewBalance > 0 ? 'Rs ' : '-Rs ') + formatCurrency(previewBalance) }}
            <span class="text-xs font-normal ml-1" :class="previewBalance > 0 ? 'text-emerald-500' : previewBalance < 0 ? 'text-red-400' : 'text-gray-400'">
              {{ previewBalance > 0 ? '(Receivable)' : previewBalance < 0 ? '(Payable)' : '' }}
            </span>
          </p>
        </div>
      </div>
      <template #footer>
        <button @click="showModal = false" class="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
        <button @click="submit" class="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors">Add Transaction</button>
      </template>
    </BaseModal>

    <!-- Delete Confirm -->
    <BaseModal v-if="showDeleteConfirm" title="Delete Transaction?" @close="showDeleteConfirm = null">
      <p class="text-sm text-gray-600">Delete this <strong>{{ showDeleteConfirm.type }}</strong> of <strong>Rs {{ formatCurrency(showDeleteConfirm.amount) }}</strong>? This cannot be undone.</p>
      <template #footer>
        <button @click="showDeleteConfirm = null" class="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
        <button @click="doDelete" class="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-xl">Delete</button>
      </template>
    </BaseModal>
  </div>
</template>
