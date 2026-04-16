import { ref, watch } from 'vue'
import { generateId, todayISO } from '@/utils/formatters'

const PARTIES_KEY = 'ledger_parties'
const TRANSACTIONS_KEY = 'ledger_transactions'

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const save = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

const DEMO_PARTIES = [
  { id: 'p1', name: 'Ali Traders', phone: '0300-1234567', address: 'Main Bazaar, Lahore', createdAt: todayISO() },
  { id: 'p2', name: 'Bashir & Sons', phone: '0321-9876543', address: 'Industrial Area, Karachi', createdAt: todayISO() },
  { id: 'p3', name: 'Cheema Battery House', phone: '0333-5556677', address: 'GT Road, Gujranwala', createdAt: todayISO() },
]

const DEMO_TRANSACTIONS = [
  { id: 't1', partyId: 'p1', type: 'Credit Sale', amount: 25000, date: '2025-03-01', notes: '5x 100Ah batteries', createdAt: new Date().toISOString() },
  { id: 't2', partyId: 'p2', type: 'Credit Purchase', amount: 18000, date: '2025-03-05', notes: 'Lead scrap purchase', createdAt: new Date().toISOString() },
  { id: 't3', partyId: 'p1', type: 'Payment Received', amount: 10000, date: '2025-03-10', notes: 'Partial payment', createdAt: new Date().toISOString() },
  { id: 't4', partyId: 'p3', type: 'Credit Sale', amount: 42000, date: '2025-03-12', notes: '8x batteries', createdAt: new Date().toISOString() },
  { id: 't5', partyId: 'p2', type: 'Payment Paid', amount: 8000, date: '2025-03-15', notes: 'Paid via cash', createdAt: new Date().toISOString() },
]

const parties = ref(load(PARTIES_KEY, null) ?? DEMO_PARTIES)
const transactions = ref(load(TRANSACTIONS_KEY, null) ?? DEMO_TRANSACTIONS)

watch(parties, (v) => save(PARTIES_KEY, v), { deep: true })
watch(transactions, (v) => save(TRANSACTIONS_KEY, v), { deep: true })

export function useStorage() {
  const addParty = (data) => {
    const party = { id: generateId(), createdAt: todayISO(), ...data }
    parties.value.unshift(party)
    return party
  }

  const updateParty = (id, data) => {
    const idx = parties.value.findIndex(p => p.id === id)
    if (idx !== -1) parties.value[idx] = { ...parties.value[idx], ...data }
  }

  const deleteParty = (id) => {
    parties.value = parties.value.filter(p => p.id !== id)
    transactions.value = transactions.value.filter(t => t.partyId !== id)
  }

  const addTransaction = (data) => {
    const tx = { id: generateId(), createdAt: new Date().toISOString(), ...data }
    transactions.value.unshift(tx)
    return tx
  }

  const deleteTransaction = (id) => {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  const getPartyById = (id) => parties.value.find(p => p.id === id)

  const getTransactionsByParty = (partyId) =>
    transactions.value.filter(t => t.partyId === partyId)
      .sort((a, b) => new Date(a.date) - new Date(b.date))

  return {
    parties,
    transactions,
    addParty,
    updateParty,
    deleteParty,
    addTransaction,
    deleteTransaction,
    getPartyById,
    getTransactionsByParty,
  }
}
