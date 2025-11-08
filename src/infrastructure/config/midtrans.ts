import midtransClient from 'midtrans-client'

export const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'PRODUCTION',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
})
