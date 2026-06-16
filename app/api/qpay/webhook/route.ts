import { NextRequest, NextResponse } from 'next/server'
import { getToken } from '@/lib/qpay'
import { readJson, deleteR2Object } from '@/lib/r2'

interface InvoiceEntry {
  sender_id: string
  package: string
  amount: number
  qpay_invoice_id: string
}

async function handleWebhook(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sender_invoice_no = searchParams.get('sender_invoice_no') ?? ''

  const mappingKey = `qr/drama/inv/${sender_invoice_no}.json`
  const entry = await readJson<InvoiceEntry>(mappingKey)

  if (!entry) {
    console.error('[drama] webhook: unknown sender_invoice_no:', sender_invoice_no)
    return new NextResponse('OK', { status: 200 })
  }

  const { sender_id, package: pkg, amount, qpay_invoice_id } = entry

  try {
    const token = await getToken()

    const checkRes = await fetch('https://merchant.qpay.mn/v2/payment/check', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        object_type: 'INVOICE',
        object_id: qpay_invoice_id,
        offset: { page_number: 1, page_limit: 100 },
      }),
    })

    const checkData = await checkRes.json()
    const isPaid = (checkData.rows ?? []).some(
      (r: { payment_status: string }) => r.payment_status === 'PAID'
    )
    console.log('[drama] webhook check:', sender_invoice_no, qpay_invoice_id, '-> isPaid:', isPaid)

    if (isPaid) {
      await fetch(process.env.N8N_QPAY_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id,
          package: pkg,
          amount,
          invoice_id: qpay_invoice_id,
          status: 'PAID',
          secret: process.env.N8N_WEBHOOK_SECRET,
        }),
      })
      // Нэг удаа л дамжуулна
      await deleteR2Object(mappingKey)
    }
  } catch (err) {
    console.error('[drama] webhook error:', err)
  }

  return new NextResponse('OK', { status: 200 })
}

export const GET = handleWebhook
export const POST = handleWebhook
