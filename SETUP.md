# Negun AI — Тохиргооны заавар

## 1. Node.js суулгах
https://nodejs.org/ — LTS хувилбарыг татаж суулгана уу.

## 2. Хамаарлуудыг суулгах
```bash
cd C:\Users\temku\autolearn-ai
npm install
```

## 3. Орчны хувьсагч тохируулах
```bash
copy .env.local.example .env.local
# .env.local файлыг нээж утгуудыг бөглөнө
```

## 4. Мэдээллийн сан тохируулах (Supabase)
1. https://supabase.com дээр project үүсгэх
2. Settings > Database > Connection string-ийг DATABASE_URL-д хуулна
3. Migration ажиллуулах:
```bash
npx prisma db push
npx prisma generate
```

## 5. Dev server ажиллуулах
```bash
npm run dev
# http://localhost:3000 дээр нээнэ
```

## 6. Эхний admin хэрэглэгч үүсгэх
Prisma Studio ашиглан role-г ADMIN болгох:
```bash
npx prisma studio
# Users хүснэгтэд role = ADMIN болгоно
```

## 7. Vercel deploy
```bash
npm install -g vercel
vercel --prod
# Vercel dashboard дээр бүх env vars нэмнэ
```

---

## Шаардлагатай гадаад үйлчилгээнүүд

| Үйлчилгээ | Зориулалт | URL |
|---|---|---|
| Supabase | PostgreSQL database | supabase.com |
| Cloudflare R2 | Видео хадгалалт | cloudflare.com |
| QPAY | Монголын QR төлбөр | merchant.qpay.mn |
| Anthropic | AI chatbot | console.anthropic.com |
| Resend | OTP имэйл | resend.com |
| Telegram Bot | Мэдэгдэл | t.me/BotFather |
