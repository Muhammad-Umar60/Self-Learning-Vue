<script setup>
import { useLedger } from '@/composables/useLedger'
import { useStorage } from '@/composables/useStorage'
import { formatCurrency, formatDate, TYPE_META } from '@/utils/formatters'
import { useRouter } from 'vue-router'

const { totalReceivable, totalPayable, netBalance, recentTransactions, partiesWithBalance } = useLedger()
const { parties } = useStorage()
const router = useRouter()

const typeColors = {
  'Credit Sale': 'bg-emerald-100 text-emerald-700',
  'Credit Purchase': 'bg-red-100 text-red-700',
  'Payment Received': 'bg-blue-100 text-blue-700',
  'Payment Paid': 'bg-purple-100 text-purple-700',
}

const topParties = computed => partiesWithBalance.value
  .filter(p => p.balance !== 0)
  .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
  .slice(0, 5)
</script>

<template>
  <div class="p-6 space-y-6">

    <!-- Page title -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-sm text-gray-500 mt-0.5">Overview of your business finances</p>
      </div>
      <button
        @click="router.push('/transactions')"
        class="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2.5 rounded-xl transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Add Transaction
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <p class="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">Total Receivable</p>
        <p class="text-2xl font-bold text-emerald-600">Rs {{ formatCurrency(totalReceivable) }}</p>
        <p class="text-xs text-gray-400 mt-1">They owe us</p>
        <div class="mt-3 h-1 rounded-full bg-emerald-100">
          <div class="h-1 rounded-full bg-emerald-500" :style="`width: ${totalReceivable + totalPayable > 0 ? (totalReceivable / (totalReceivable + totalPayable)) * 100 : 50}%`"></div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <p class="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">Total Payable</p>
        <p class="text-2xl font-bold text-red-500">Rs {{ formatCurrency(totalPayable) }}</p>
        <p class="text-xs text-gray-400 mt-1">We owe them</p>
        <div class="mt-3 h-1 rounded-full bg-red-100">
          <div class="h-1 rounded-full bg-red-500" :style="`width: ${totalReceivable + totalPayable > 0 ? (totalPayable / (totalReceivable + totalPayable)) * 100 : 50}%`"></div>
        </div>
      </div>

      <div class="rounded-2xl border p-5" :class="netBalance >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'">
        <p class="text-xs font-medium uppercase tracking-wide mb-3" :class="netBalance >= 0 ? 'text-emerald-600' : 'text-red-500'">Net Balance</p>
        <p class="text-2xl font-bold" :class="netBalance >= 0 ? 'text-emerald-700' : 'text-red-600'">
          {{ netBalance >= 0 ? '+' : '-' }}Rs {{ formatCurrency(netBalance) }}
        </p>
        <p class="text-xs mt-1" :class="netBalance >= 0 ? 'text-emerald-500' : 'text-red-400'">
          {{ netBalance >= 0 ? 'Net receivable' : 'Net payable' }}
        </p>
        <div class="mt-3 flex gap-1 items-center text-xs" :class="netBalance >= 0 ? 'text-emerald-600' : 'text-red-500'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          {{ parties.length }} parties total
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Recent Transactions -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 class="text-sm font-semibold text-gray-800">Recent Transactions</h2>
          <RouterLink to="/transactions" class="text-xs text-blue-500 hover:text-blue-600">View all →</RouterLink>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-if="recentTransactions.length === 0" class="py-10 text-center text-sm text-gray-400">
            No transactions yet
          </div>
          <div
            v-for="tx in recentTransactions"
            :key="tx.id"
            class="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <p class="text-sm font-medium text-gray-800 truncate">{{ tx.partyName }}</p>
                <span class="text-xs px-2 py-0.5 rounded-full flex-shrink-0" :class="typeColors[tx.type]">
                  {{ tx.type }}
                </span>
              </div>
              <p class="text-xs text-gray-400">{{ formatDate(tx.date) }} {{ tx.notes ? '· ' + tx.notes : '' }}</p>
            </div>
            <p class="text-sm font-semibold flex-shrink-0"
              :class="tx.meta?.balanceEffect > 0 ? 'text-emerald-600' : 'text-red-500'">
              {{ tx.meta?.balanceEffect > 0 ? '+' : '-' }}Rs {{ formatCurrency(tx.amount) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Top Parties -->
      <div class="bg-white rounded-2xl border border-gray-100">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 class="text-sm font-semibold text-gray-800">Party Balances</h2>
          <RouterLink to="/parties" class="text-xs text-blue-500 hover:text-blue-600">View all →</RouterLink>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-if="partiesWithBalance.filter(p => p.balance !== 0).length === 0" class="py-10 text-center text-sm text-gray-400">
            No balances yet
          </div>
          <div
            v-for="p in partiesWithBalance.filter(p => p.balance !== 0).sort((a,b) => Math.abs(b.balance) - Math.abs(a.balance)).slice(0, 6)"
            :key="p.id"
            class="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 cursor-pointer"
            @click="router.push('/ledger?party=' + p.id)"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                :class="p.balance > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'">
                {{ p.name.charAt(0).toUpperCase() }}
              </div>
              <p class="text-sm font-medium text-gray-800">{{ p.name }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold" :class="p.balance > 0 ? 'text-emerald-600' : 'text-red-500'">
                Rs {{ formatCurrency(p.balance) }}
              </p>
              <p class="text-xs" :class="p.balance > 0 ? 'text-emerald-400' : 'text-red-300'">
                {{ p.balance > 0 ? 'Receivable' : 'Payable' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
