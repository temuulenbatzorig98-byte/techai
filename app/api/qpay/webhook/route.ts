import { NextRequest, NextResponse } from 'next/server'
import { getToken } from '@/lib/qpay'

async function handleWebhook(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sender_id = searchParams.get('sender_id') ?? ''
  const pkg = searchParams.get('package') ?? ''
  const amount = searchParams.get('amount') ?? ''
  const invoice_id = searchParams.get('invoice_id') ?? ''

  try {
    const token = await getToken()

    const checkRes = await fetch('https://merchant.qpay.mn/v2/payment/check', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        object_type: 'INVOICE',
        object_id: invoice_id,
        offset: { page_number: 1, page_limit: 100 },
      }),
    })

    const checkData = await checkRes.json()
    const isPaid = (checkData.rows ?? []).some(
      (r: { payment_status: string }) => r.payment_status === 'PAID'
    )

    if (isPaid) {
      await fetch(process.env.N8N_QPAY_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id,
          package: pkg,
          amount,
          invoice_id,
          status: 'PAID',
          secret: process.env.N8N_WEBHOOK_SECRET,
        }),
      })
    }
  } catch (err) {
    console.error('[drama] webhook error:', err)
  }

  // QPay 200 хүлээнэ — алдааг дотооддоо л барина
  return new NextResponse('OK', { status: 200 })
}

export const GET = handleWebhook
export const POST = handleWebhook
