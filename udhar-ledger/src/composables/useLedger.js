import { computed } from 'vue'
import { useStorage } from './useStorage'
import { TYPE_META } from '@/utils/formatters'

export function useLedger() {
  const { parties, transactions, getPartyById } = useStorage()

  const partyBalance = (partyId) => {
    return transactions.value
      .filter(t => t.partyId === partyId)
      .reduce((sum, t) => sum + (TYPE_META[t.type]?.balanceEffect ?? 0) * t.amount, 0)
  }

  const partiesWithBalance = computed(() =>
    parties.value.map(p => ({ ...p, balance: partyBalance(p.id) }))
  )

  const totalReceivable = computed(() =>
    partiesWithBalance.value
      .filter(p => p.balance > 0)
      .reduce((s, p) => s + p.balance, 0)
  )

  const totalPayable = computed(() =>
    partiesWithBalance.value
      .filter(p => p.balance < 0)
      .reduce((s, p) => s + Math.abs(p.balance), 0)
  )

  const netBalance = computed(() => totalReceivable.value - totalPayable.value)

  const getLedger = (partyId, fromDate, toDate) => {
    let txs = transactions.value.filter(t => {
      if (partyId && partyId !== 'all' && t.partyId !== partyId) return false
      if (fromDate && t.date < fromDate) return false
      if (toDate && t.date > toDate) return false
      return true
    }).sort((a, b) => new Date(a.date) - new Date(b.date) || new Date(a.createdAt) - new Date(b.createdAt))

    let runningBalance = 0
    return txs.map(t => {
      const meta = TYPE_META[t.type]
      const debit = meta.ledgerCol === 'debit' ? t.amount : 0
      const credit = meta.ledgerCol === 'credit' ? t.amount : 0
      runningBalance += meta.balanceEffect * t.amount
      const party = getPartyById(t.partyId)
      return {
        ...t,
        partyName: party?.name ?? 'Unknown',
        debit,
        credit,
        runningBalance,
      }
    })
  }

  const recentTransactions = computed(() => {
    return [...transactions.value]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(t => ({
        ...t,
        partyName: getPartyById(t.partyId)?.name ?? 'Unknown',
        meta: TYPE_META[t.type],
      }))
  })

  return {
    partyBalance,
    partiesWithBalance,
    totalReceivable,
    totalPayable,
    netBalance,
    getLedger,
    recentTransactions,
  }
}
