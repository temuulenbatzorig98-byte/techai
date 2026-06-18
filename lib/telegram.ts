const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

export async function sendTelegramMessage(chatId: string, text: string) {
  try {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    })
  } catch (err) {
    console.error('Telegram notification failed:', err)
  }
}

export async function notifyNewPayment(data: {
  userName: string
  itemTitle: string
  amount: number
  paymentId: string
}) {
  const msg = `
💰 <b>Шинэ төлбөр!</b>

👤 Хэрэглэгч: ${data.userName}
📦 Бараа: ${data.itemTitle}
💵 Дүн: ₮${data.amount.toLocaleString()}
🔑 ID: <code>${data.paymentId}</code>
⏰ Цаг: ${new Date().toLocaleString('mn-MN')}
`
  await sendTelegramMessage(process.env.TELEGRAM_ADMIN_CHAT_ID!, msg)
}

export async function notifyNewUser(data: { name: string; email?: string; phone?: string }) {
  const msg = `
👋 <b>Шинэ хэрэглэгч бүртгэгдлээ!</b>

👤 Нэр: ${data.name}
📧 Имэйл: ${data.email || '-'}
📱 Утас: ${data.phone || '-'}
⏰ Цаг: ${new Date().toLocaleString('mn-MN')}
`
  await sendTelegramMessage(process.env.TELEGRAM_ADMIN_CHAT_ID!, msg)
}

export async function notifyFailedPayment(data: {
  userName: string
  itemTitle: string
  amount: number
}) {
  const msg = `
❌ <b>Төлбөр амжилтгүй!</b>

👤 Хэрэглэгч: ${data.userName}
📦 Бараа: ${data.itemTitle}
💵 Дүн: ₮${data.amount.toLocaleString()}
`
  await sendTelegramMessage(process.env.TELEGRAM_ADMIN_CHAT_ID!, msg)
}
