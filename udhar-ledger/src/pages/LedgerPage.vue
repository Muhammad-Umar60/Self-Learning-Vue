<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStorage } from '@/composables/useStorage'
import { useLedger } from '@/composables/useLedger'
import { formatCurrency, formatDate, todayISO } from '@/utils/formatters'

const route = useRoute()
const { parties } = useStorage()
const { getLedger, partyBalance } = useLedger()

const selectedParty = ref('all')
const fromDate = ref('')
const toDate = ref(todayISO())
const exporting = ref(false)

onMounted(() => {
  if (route.query.party) selectedParty.value = route.query.party
})

const ledgerRows = computed(() => getLedger(
  selectedParty.value === 'all' ? null : selectedParty.value,
  fromDate.value || null,
  toDate.value || null
))

const summary = computed(() => {
  const rows = ledgerRows.value
  return {
    totalDebit: rows.reduce((s, r) => s + r.debit, 0),
    totalCredit: rows.reduce((s, r) => s + r.credit, 0),
    closingBalance: rows.length > 0 ? rows[rows.length - 1].runningBalance : 0,
  }
})

const selectedPartyName = computed(() => {
  if (selectedParty.value === 'all') return 'All Parties'
  return parties.value.find(p => p.id === selectedParty.value)?.name ?? 'Unknown'
})

const balanceColor = (bal) => bal > 0 ? 'text-emerald-600' : bal < 0 ? 'text-red-500' : 'text-gray-500'
const balanceLabel = (bal) => {
  if (bal === 0) return 'Rs 0 (Clear)'
  return (bal > 0 ? '' : '-') + 'Rs ' + formatCurrency(bal) + (bal > 0 ? ' (Receivable)' : ' (Payable)')
}

const typeShort = {
  'Credit Sale': 'CR Sale',
  'Credit Purchase': 'CR Purchase',
  'Payment Received': 'Pmt Recv',
  'Payment Paid': 'Pmt Paid',
}

const exportPDF = async () => {
  exporting.value = true
  try {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    const primaryColor = [37, 99, 235]
    const W = 210
    let y = 0

    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, W, 35, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('UDHAR LEDGER', 14, 14)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Battery & Lead Trading', 14, 21)
    doc.setFontSize(8)
    doc.text(`Party: ${selectedPartyName.value}`, 14, 29)
    doc.text(`Period: ${fromDate.value ? formatDate(fromDate.value) : 'All time'} to ${formatDate(toDate.value)}`, 100, 29)
    y = 45

    doc.setTextColor(50, 50, 50)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    const hdrs = ['Date', 'Party', 'Description', 'Debit (Rs)', 'Credit (Rs)', 'Balance (Rs)']
    const cols = [14, 38, 70, 120, 148, 173]
    const rowH = 7

    doc.setFillColor(245, 247, 250)
    doc.rect(14, y - 4, W - 28, rowH, 'F')
    hdrs.forEach((h, i) => doc.text(h, cols[i], y))
    y += rowH

    doc.setFont('helvetica', 'normal')
    ledgerRows.value.forEach((row, idx) => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      if (idx % 2 === 0) {
        doc.setFillColor(252, 252, 253)
        doc.rect(14, y - 4, W - 28, rowH, 'F')
      }
      doc.setTextColor(80, 80, 80)
      doc.text(formatDate(row.date), cols[0], y)
      doc.text((row.partyName || '').slice(0, 14), cols[1], y)
      doc.text((typeShort[row.type] || row.type || '').slice(0, 20), cols[2], y)

      if (row.debit > 0) {
        doc.setTextColor(16, 185, 129)
        doc.text(formatCurrency(row.debit), cols[3], y)
      } else doc.text('—', cols[3], y)

      doc.setTextColor(80, 80, 80)
      if (row.credit > 0) {
        doc.setTextColor(239, 68, 68)
        doc.text(formatCurrency(row.credit), cols[4], y)
      } else doc.text('—', cols[4], y)

      doc.setTextColor(row.runningBalance >= 0 ? 16 : 220, row.runningBalance >= 0 ? 185 : 38, row.runningBalance >= 0 ? 129 : 38)
      doc.text((row.runningBalance >= 0 ? '' : '-') + formatCurrency(row.runningBalance), cols[5], y)
      y += rowH
    })

    y += 4
    doc.setDrawColor(...primaryColor)
    doc.line(14, y, W - 14, y)
    y += 6
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(50, 50, 50)
    doc.text('TOTALS', cols[0], y)
    doc.setTextColor(16, 185, 129)
    doc.text(formatCurrency(summary.value.totalDebit), cols[3], y)
    doc.setTextColor(239, 68, 68)
    doc.text(formatCurrency(summary.value.totalCredit), cols[4], y)
    doc.setTextColor(...(summary.value.closingBalance >= 0 ? [16, 185, 129] : [239, 68, 68]))
    doc.text((summary.value.closingBalance >= 0 ? '' : '-') + formatCurrency(summary.value.closingBalance), cols[5], y)

    y += 10
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(160, 160, 160)
    doc.text(`Generated on ${new Date().toLocaleString('en-PK')}`, 14, y)

    doc.save(`ledger-${selectedPartyName.value.replace(/\s+/g, '-')}-${todayISO()}.pdf`)
  } catch (e) {
    alert('PDF export failed. Make sure jspdf is installed: npm install jspdf')
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <div class="p-6 space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Ledger / Report</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ ledgerRows.length }} entries</p>
      </div>
      <button
        @click="exportPDF"
        :disabled="exporting || ledgerRows.length === 0"
        class="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm px-4 py-2.5 rounded-xl transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        {{ exporting ? 'Exporting...' : 'Download PDF' }}
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-gray-100 p-5">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Party</label>
          <select v-model="selectedParty" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-white">
            <option value="all">All Parties</option>
            <option v-for="p in parties" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">From Date</label>
          <input v-model="fromDate" type="date" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">To Date</label>
          <input v-model="toDate" type="date" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Total Debit</p>
        <p class="text-xl font-bold text-emerald-600">Rs {{ formatCurrency(summary.totalDebit) }}</p>
        <p class="text-xs text-gray-400 mt-1">Money receivable / payable reduced</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Total Credit</p>
        <p class="text-xl font-bold text-red-500">Rs {{ formatCurrency(summary.totalCredit) }}</p>
        <p class="text-xs text-gray-400 mt-1">Money payable / receivable reduced</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Closing Balance</p>
        <p class="text-xl font-bold" :class="balanceColor(summary.closingBalance)">
          {{ balanceLabel(summary.closingBalance) }}
        </p>
      </div>
    </div>

    <!-- Ledger Table -->
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
        <p class="text-sm font-semibold text-gray-800">{{ selectedPartyName }} — Ledger</p>
        <p class="text-xs text-gray-400">{{ fromDate ? formatDate(fromDate) + ' → ' : 'All time → ' }}{{ formatDate(toDate) }}</p>
      </div>

      <div v-if="ledgerRows.length === 0" class="py-16 text-center text-sm text-gray-400">
        No transactions in selected range
      </div>

      <div class="overflow-x-auto" v-else>
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 text-left">
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Party</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Debit (Rs)</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Credit (Rs)</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Balance (Rs)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="(row, i) in ledgerRows" :key="row.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{{ formatDate(row.date) }}</td>
              <td class="px-4 py-3.5 text-sm text-gray-700 hidden lg:table-cell">{{ row.partyName }}</td>
              <td class="px-4 py-3.5">
                <p class="text-sm text-gray-800">{{ row.type }}</p>
                <p v-if="row.notes" class="text-xs text-gray-400 mt-0.5">{{ row.notes }}</p>
              </td>
              <td class="px-4 py-3.5 text-right">
                <span v-if="row.debit > 0" class="text-sm font-medium text-emerald-600">{{ formatCurrency(row.debit) }}</span>
                <span v-else class="text-sm text-gray-300">—</span>
              </td>
              <td class="px-4 py-3.5 text-right">
                <span v-if="row.credit > 0" class="text-sm font-medium text-red-500">{{ formatCurrency(row.credit) }}</span>
                <span v-else class="text-sm text-gray-300">—</span>
              </td>
              <td class="px-4 py-3.5 text-right">
                <span class="text-sm font-semibold" :class="balanceColor(row.runningBalance)">
                  {{ row.runningBalance === 0 ? '0' : (row.runningBalance > 0 ? '' : '-') + formatCurrency(row.runningBalance) }}
                </span>
                <p class="text-xs mt-0.5" :class="row.runningBalance > 0 ? 'text-emerald-400' : row.runningBalance < 0 ? 'text-red-300' : 'text-gray-300'">
                  {{ row.runningBalance > 0 ? 'Receivable' : row.runningBalance < 0 ? 'Payable' : 'Clear' }}
                </p>
              </td>
            </tr>
          </tbody>
          <!-- Totals row -->
          <tfoot>
            <tr class="bg-gray-50 font-semibold">
              <td class="px-4 py-3.5 text-sm text-gray-700" colspan="3">Total</td>
              <td class="px-4 py-3.5 text-right text-sm text-emerald-600">{{ formatCurrency(summary.totalDebit) }}</td>
              <td class="px-4 py-3.5 text-right text-sm text-red-500">{{ formatCurrency(summary.totalCredit) }}</td>
              <td class="px-4 py-3.5 text-right text-sm" :class="balanceColor(summary.closingBalance)">
                {{ summary.closingBalance === 0 ? '0' : (summary.closingBalance > 0 ? '' : '-') + formatCurrency(summary.closingBalance) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
