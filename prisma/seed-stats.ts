import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomRating() {
  // 4.5 - 5.0, нэг аравтын бутархайтай
  return Math.round((4.5 + Math.random() * 0.5) * 10) / 10
}

async function main() {
  const courses = await prisma.course.findMany({ select: { id: true, title: true } })

  if (courses.length === 0) {
    console.log('Курс олдсонгүй.')
    return
  }

  for (const course of courses) {
    const totalStudents = randomInt(1000, 2000)
    const rating = randomRating()

    // totalDuration секундээр: 3-6 цаг
    const totalDuration = randomInt(3 * 3600, 6 * 3600)

    await prisma.course.update({
      where: { id: course.id },
      data: { totalStudents, rating, totalDuration },
    })

    const h = Math.floor(totalDuration / 3600)
    const m = Math.floor((totalDuration % 3600) / 60)
    console.log(`✓ ${course.title} → ${totalStudents} оюутан, ${rating}★, ${h}ц ${m}мин`)
  }

  console.log(`\nНийт ${courses.length} курс шинэчлэгдлээ.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
