import { NextRequest, NextResponse } from 'next/server'
import { getToken } from '@/lib/qpay'
import { uploadBuffer } from '@/lib/r2'

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.NEGUN_N8N_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { sender_id, package: pkg, amount, description, sender_invoice_no } = await req.json()

    const token = await getToken()
    const baseUrl = process.env.NEXT_PUBLIC_URL!

    const callbackUrl =
      `${baseUrl}/api/qpay/webhook` +
      `?sender_id=${encodeURIComponent(sender_id)}&package=${encodeURIComponent(pkg)}&amount=${amount}`

    const invoiceRes = await fetch('https://merchant.qpay.mn/v2/invoice', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoice_code: process.env.QPAY_INVOICE_CODE,
        sender_invoice_no,
        invoice_receiver_code: 'terminal',
        invoice_description: description,
        sender_branch_code: 'DRAMA_SB',
        amount,
        callback_url: callbackUrl,
      }),
    })

    if (!invoiceRes.ok) {
      console.error('[drama] QPay invoice create failed:', await invoiceRes.text())
      return NextResponse.json({ error: 'qpay invoice create failed' }, { status: 502 })
    }

    const invoice = await invoiceRes.json()
    const invoiceId: string = invoice.invoice_id

    // QR PNG → R2-д хадгална (Facebook base64 зургийг дэмждэггүй)
    const qrKey = `qr/drama/${invoiceId}.png`
    await uploadBuffer(qrKey, Buffer.from(invoice.qr_image, 'base64'), 'image/png')

    // Bank app URLs → R2-д JSON болгон хадгална (pay page serverless-д ч уншина)
    const urlsKey = `qr/drama/${invoiceId}.json`
    await uploadBuffer(
      urlsKey,
      Buffer.from(JSON.stringify(invoice.urls ?? [])),
      'application/json'
    )

    return NextResponse.json({
      invoice_id: invoiceId,
      qr_image: `${process.env.R2_PUBLIC_URL}/${qrKey}`,
      pay_page_url: `${baseUrl}/pay/${invoiceId}`,
    })
  } catch (err) {
    console.error('[drama] create-invoice error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
