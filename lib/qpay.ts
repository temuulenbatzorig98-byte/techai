const QPAY_BASE = 'https://merchant.qpay.mn/v2'

let accessToken: string | null = null
let tokenExpiry = 0

async function getToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) return accessToken

  const res = await fetch(`${QPAY_BASE}/auth/token`, {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(`${process.env.QPAY_USERNAME}:${process.env.QPAY_PASSWORD}`).toString('base64'),
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) throw new Error('QPAY auth failed')

  const data = await res.json()
  accessToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return accessToken!
}

export interface QPAYInvoiceParams {
  invoiceCode: string
  senderInvoiceNo: string
  invoiceReceiverCode: string
  invoiceDescription: string
  amount: number
  callbackUrl: string
}

export async function createQPAYInvoice(params: QPAYInvoiceParams) {
  const token = await getToken()
  const res = await fetch(`${QPAY_BASE}/invoice`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      invoice_code: params.invoiceCode,
      sender_invoice_no: params.senderInvoiceNo,
      invoice_receiver_code: params.invoiceReceiverCode,
      invoice_description: params.invoiceDescription,
      amount: params.amount,
      callback_url: params.callbackUrl,
    }),
  })
  return res.json()
}

export async function checkQPAYPayment(invoiceId: string) {
  const token = await getToken()
  const res = await fetch(`${QPAY_BASE}/payment/check`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ object_id: invoiceId, object_type: 'INVOICE' }),
  })
  return res.json()
}

export async function cancelQPAYInvoice(invoiceId: string) {
  const token = await getToken()
  const res = await fetch(`${QPAY_BASE}/invoice/cancel/${invoiceId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}
