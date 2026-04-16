export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount))
}

export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const todayISO = () => new Date().toISOString().split('T')[0]

export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

export const TRANSACTION_TYPES = {
  CREDIT_SALE: 'Credit Sale',
  CREDIT_PURCHASE: 'Credit Purchase',
  PAYMENT_RECEIVED: 'Payment Received',
  PAYMENT_PAID: 'Payment Paid',
}

export const TYPE_META = {
  'Credit Sale': { label: 'Credit Sale', color: 'green', ledgerCol: 'debit', balanceEffect: 1 },
  'Credit Purchase': { label: 'Credit Purchase', color: 'red', ledgerCol: 'credit', balanceEffect: -1 },
  'Payment Received': { label: 'Payment Received', color: 'blue', ledgerCol: 'credit', balanceEffect: -1 },
  'Payment Paid': { label: 'Payment Paid', color: 'purple', ledgerCol: 'debit', balanceEffect: 1 },
}
