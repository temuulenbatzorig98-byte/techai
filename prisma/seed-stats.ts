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

    await prisma.course.update({
      where: { id: course.id },
      data: { totalStudents, rating },
    })

    console.log(`✓ ${course.title} → ${totalStudents} оюутан, ${rating}★`)
  }

  console.log(`\nНийт ${courses.length} курс шинэчлэгдлээ.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
