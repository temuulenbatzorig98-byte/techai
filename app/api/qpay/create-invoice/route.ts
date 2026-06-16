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

    // invoice_id нь invoice үүсгэсний ДАРАА л мэдэгддэг тул callback_url-д
    // бид өөрсдөө сонгосон sender_invoice_no-г ашигладаг.
    const callbackUrl =
      `${baseUrl}/api/qpay/webhook` +
      `?sender_invoice_no=${encodeURIComponent(sender_invoice_no)}`

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

    // sender_invoice_no → { sender_id, package, amount, qpay_invoice_id } mapping
    // R2-д хадгална — serverless instance хооронд хуваалцах боломжтой
    const mappingKey = `qr/drama/inv/${sender_invoice_no}.json`
    await uploadBuffer(
      mappingKey,
      Buffer.from(JSON.stringify({ sender_id, package: pkg, amount, qpay_invoice_id: invoiceId })),
      'application/json'
    )

    // QR PNG → R2 (Facebook Send API base64 зургийг дэмждэггүй)
    await uploadBuffer(
      `qr/drama/${invoiceId}.png`,
      Buffer.from(invoice.qr_image, 'base64'),
      'image/png'
    )

    // Bank app URLs → R2 JSON (pay page serverless-д ч уншина)
    await uploadBuffer(
      `qr/drama/${invoiceId}.json`,
      Buffer.from(JSON.stringify(invoice.urls ?? [])),
      'application/json'
    )

    return NextResponse.json({
      invoice_id: invoiceId,
      qr_image: `${process.env.R2_PUBLIC_URL}/qr/drama/${invoiceId}.png`,
      pay_page_url: `${baseUrl}/pay/${invoiceId}`,
    })
  } catch (err) {
    console.error('[drama] create-invoice error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
