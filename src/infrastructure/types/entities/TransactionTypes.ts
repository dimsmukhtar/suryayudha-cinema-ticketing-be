export type queryGetMyTransactions = {
  type?: 'booking' | 'payment'
}

// filter by user email, order_id, status, transaction_time

export type queryGetAllTransactions = {
  email?: string
  order_id?: string
  status?: 'pending' | 'settlement' | 'cancelled'
  date?: string
}
