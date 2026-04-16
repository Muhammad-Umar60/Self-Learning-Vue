import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardPage from '@/pages/DashboardPage.vue'
import PartiesPage from '@/pages/PartiesPage.vue'
import TransactionsPage from '@/pages/TransactionsPage.vue'
import LedgerPage from '@/pages/LedgerPage.vue'

const routes = [
  { path: '/', name: 'dashboard', component: DashboardPage },
  { path: '/parties', name: 'parties', component: PartiesPage },
  { path: '/transactions', name: 'transactions', component: TransactionsPage },
  { path: '/ledger', name: 'ledger', component: LedgerPage },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
