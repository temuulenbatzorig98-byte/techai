import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = { title: 'Үйлчилгээний нөхцөл – Negun AI' }

export default function TosPage() {
  return (
    <main className="hero-bg min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-32 pb-20">
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-8 md:p-12 space-y-10 text-sm leading-relaxed text-slate-700 dark:text-gray-300">

          {/* TOS */}
          <section>
            <h1 className="font-syne text-2xl font-bold text-slate-900 dark:text-white mb-1">Үйлчилгээний нөхцөл – Negun AI</h1>
            <p className="text-xs text-slate-400 dark:text-gray-500 mb-6">Хүчин төгөлдөр огноо: 2026.06.02</p>
            <p className="mb-4">
              Negun AI ("бид", "манай", "үйлчилгээ") нь энэхүү платформ, вэбсайт, AI хэрэгслүүд, сургалтын материал болон холбогдох бүх үйлчилгээ (цаашид "Үйлчилгээ" гэх)-ийг ашиглах нөхцөлийг дараах байдлаар тодорхойлж байна.
            </p>
            <p className="mb-6 text-slate-500 dark:text-gray-400">Negun AI-г ашигласнаар та эдгээр нөхцөлийг бүрэн хүлээн зөвшөөрсөнд тооцогдоно. Хэрэв зөвшөөрөхгүй бол үйлчилгээг ашиглахгүй байхыг зөвлөж байна.</p>

            {[
              {
                title: '1. Үйлчилгээний тухай',
                items: [
                  'AI суурьтай чатбот болон автоматжуулалтын хэрэгслүүд',
                  'Онлайн сургалт, хичээлийн материал',
                  'Дижитал систем, workflow шийдлүүд',
                  'Бусад холбогдох AI үйлчилгээ',
                ],
              },
              {
                title: '2. Хэрэглэгчийн эрх, насны шаардлага',
                items: [
                  'Та дор хаяж 13 нас хүрсэн байх шаардлагатай',
                  'Бүртгэлийн мэдээллээ үнэн зөв өгөх үүрэгтэй',
                  'Хууль тогтоомжийг зөрчихгүй байх',
                ],
              },
              {
                title: '3. Хэрэглэгчийн бүртгэл',
                items: [
                  'Хэрэглэгч өөрийн бүртгэлийн нууцлал, аюулгүй байдлыг бүрэн хариуцна',
                  'Нууц үгээ бусдад дамжуулахгүй байх',
                  'Бүртгэлийн бүх үйл ажиллагаа хэрэглэгчийн хариуцлагад хамаарна',
                  'Бид дүрэм зөрчсөн тохиолдолд бүртгэлийг түр хугацаагаар хаах эсвэл устгах эрхтэй',
                ],
              },
              {
                title: '4. Зөвшөөрөгдсөн ашиглалт',
                items: [
                  'Хууль бус, залилангийн үйл ажиллагаа явуулах',
                  'Системийг эвдэх, хакдах оролдлого хийх',
                  'Контент, сургалтыг хуулбарлах, зөвшөөрөлгүй тараах',
                  'Хортой код, вирус оруулах',
                  'Бусдад хохирол учруулах AI ашиглалт хийх',
                ],
                prefix: 'Хориглоно:',
              },
            ].map(({ title, items, prefix }) => (
              <div key={title} className="mb-6">
                <h2 className="font-syne font-semibold text-slate-900 dark:text-white mb-2">{title}</h2>
                {prefix && <p className="text-slate-500 dark:text-gray-400 mb-1">{prefix}</p>}
                <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-gray-400">
                  {items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}

            {[
              {
                title: '5. Төлбөр ба үйлчилгээ',
                text: 'Зарим үйлчилгээ төлбөртэй байна. Төлбөр төлөгдсөн даруйд тухайн хэрэглэгчийн хичээл, контент, эсвэл үйлчилгээ шууд нээгдэнэ. Төлбөр нь үйлчилгээний контентод шууд нэвтрэх эрх олгож байгаа тул буцаан олголт (refund) хийгдэхгүй. Бид үнэ болон багцын нөхцөлийг урьдчилан мэдэгдэн өөрчлөх эрхтэй.',
              },
              {
                title: '6. Оюуны өмч',
                text: 'Negun AI-ийн бүх контент — сургалтын материал, видео, текст, дизайн, AI систем, код, логик — нь Negun AI-ийн өмч бөгөөд зөвшөөрөлгүй хуулбарлах, түгээх, худалдахыг хориглоно.',
              },
              {
                title: '7. Мэдээллийн ашиглалт',
                text: 'Хэрэглэгчийн мэдээллийг үйлчилгээ сайжруулах зорилгоор ашиглаж болно. Хувийн мэдээллийг гуравдагч этгээдэд зөвшөөрөлгүй дамжуулахгүй.',
              },
              {
                title: '8. Хариуцлагын хязгаарлалт',
                text: 'Үйлчилгээ тасалдах, алдаа гарах тохиолдолд бид бүрэн хариуцлага хүлээхгүй. AI гаргасан үр дүнг хэрэглэгч өөрөө шалгах үүрэгтэй. Санхүү, хууль, эмнэлгийн зөвлөгөө гэж шууд тооцохгүй.',
              },
              {
                title: '9. Бүртгэл цуцлах эрх',
                text: 'Бид дүрэм зөрчсөн, бусдын эрхийг зөрчсөн, системд халдсан тохиолдолд дансыг хаах эрхтэй.',
              },
              {
                title: '10. Өөрчлөлт оруулах эрх',
                text: 'Negun AI нь энэхүү нөхцөлийг хүссэн үедээ шинэчлэх эрхтэй. Шинэчилсэн хувилбар нь сайт дээр нийтлэгдсэнээс хүчин төгөлдөр болно.',
              },
            ].map(({ title, text }) => (
              <div key={title} className="mb-6">
                <h2 className="font-syne font-semibold text-slate-900 dark:text-white mb-2">{title}</h2>
                <p className="text-slate-500 dark:text-gray-400">{text}</p>
              </div>
            ))}

            <div className="mb-6">
              <h2 className="font-syne font-semibold text-slate-900 dark:text-white mb-2">11. Холбоо барих</h2>
              <p className="text-slate-500 dark:text-gray-400">Email: <a href="mailto:support@negun.ai" className="text-purple-400 hover:underline">support@negun.ai</a></p>
              <p className="text-slate-500 dark:text-gray-400">Website: <a href="https://negun.ai" className="text-purple-400 hover:underline">https://negun.ai</a></p>
            </div>
          </section>

          <hr className="border-slate-200 dark:border-white/10" />

          {/* Privacy Policy */}
          <section>
            <h1 className="font-syne text-2xl font-bold text-slate-900 dark:text-white mb-1">Нууцлалын бодлого – Negun AI</h1>
            <p className="text-xs text-slate-400 dark:text-gray-500 mb-6">Хүчин төгөлдөр огноо: 2026.06.02</p>
            <p className="mb-4">
              Negun AI нь хэрэглэгчийн хувийн мэдээллийн аюулгүй байдал, нууцлалыг хамгаалахыг эрхэмлэдэг.
              Энэхүү Нууцлалын бодлого нь таны мэдээллийг хэрхэн цуглуулах, ашиглах, хадгалах, хамгаалах талаар тайлбарлана.
            </p>

            {[
              {
                title: '1. Бид ямар мэдээлэл цуглуулдаг вэ?',
                text: 'Нэр, имэйл хаяг, утасны дугаар, бүртгэлийн мэдээлэл; логин хийх хугацаа, сургалт үзсэн түүх, системийн ашиглалтын үйлдэл; төлбөр хийсэн эсэх мэдээлэл (кредит картын мэдээллийг хадгалахгүй).',
              },
              {
                title: '2. Мэдээллийг хэрхэн ашигладаг вэ?',
                text: 'Үйлчилгээ үзүүлэх, аккаунт ажиллуулах; сургалтын агуулга нээх, удирдах; үйлчилгээг сайжруулах; хэрэглэгчийн дэмжлэг үзүүлэх; хуулийн шаардлагыг биелүүлэх.',
              },
              {
                title: '3. Мэдээлэл хадгалалт',
                text: 'Мэдээллийг аюулгүй сервер дээр хадгалах бөгөөд зөвшөөрөлгүй этгээдэд нэвтрэх боломж олгохгүй. Хэрэгтэй хугацаанаас илүү хадгалахгүй.',
              },
              {
                title: '4. Мэдээлэл хуваалцах',
                text: 'Бид таны хувийн мэдээллийг гуравдагч этгээдэд худалдахгүй. Зөвхөн үйлчилгээ үзүүлэхэд шаардлагатай үед (төлбөрийн систем, hosting) хязгаарлагдмал байдлаар ашиглаж болно.',
              },
              {
                title: '5. Төлбөрийн мэдээллийн аюулгүй байдал',
                text: 'Бид кредит картын мэдээлэл хадгалахгүй. Төлбөрийг гуравдагч төлбөрийн систем (QPay гэх мэт) дамжуулан боловсруулна.',
              },
              {
                title: '6. Cookies ашиглалт',
                text: 'Бид хэрэглэгчийн туршлагыг сайжруулах зорилгоор cookies ашиглаж болно. Та browser тохиргоогоор cookies-ийг хязгаарлаж болно.',
              },
              {
                title: '7. Хэрэглэгчийн эрх',
                text: 'Та өөрийн мэдээллээ харах, засварлах хүсэлт гаргах, бүртгэлээ устгуулах хүсэлт гаргах эрхтэй.',
              },
              {
                title: '8. Мэдээллийн аюулгүй байдал',
                text: 'Бид шифрлэлтийн технологи ашиглан, серверийн хамгаалалт хэрэглэн, дотоод хандалтыг хязгаарлан мэдээллийг хамгаална. Гэвч интернет орчин 100% аюулгүй биш тул бүрэн хамгаалалт баталгаажуулах боломжгүй.',
              },
              {
                title: '9. Хүүхдийн мэдээлэл',
                text: '13-аас доош насны хүүхдүүдээс зөвшөөрөлгүй мэдээлэл цуглуулахгүй.',
              },
              {
                title: '10. Өөрчлөлт оруулах эрх',
                text: 'Negun AI нь энэхүү бодлогыг шинэчлэх эрхтэй бөгөөд шинэ хувилбар сайт дээр нийтлэгдсэнээр хүчин төгөлдөр болно.',
              },
            ].map(({ title, text }) => (
              <div key={title} className="mb-6">
                <h2 className="font-syne font-semibold text-slate-900 dark:text-white mb-2">{title}</h2>
                <p className="text-slate-500 dark:text-gray-400">{text}</p>
              </div>
            ))}

            <div>
              <h2 className="font-syne font-semibold text-slate-900 dark:text-white mb-2">11. Холбоо барих</h2>
              <p className="text-slate-500 dark:text-gray-400">Email: <a href="mailto:support@negun.ai" className="text-purple-400 hover:underline">support@negun.ai</a></p>
              <p className="text-slate-500 dark:text-gray-400">Website: <a href="https://negun.ai" className="text-purple-400 hover:underline">https://negun.ai</a></p>
            </div>
          </section>
        </div>

        <div className="text-center mt-8">
          <Link href="/register" className="text-sm text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:text-gray-300 transition">← Бүртгэлийн хуудас руу буцах</Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}
