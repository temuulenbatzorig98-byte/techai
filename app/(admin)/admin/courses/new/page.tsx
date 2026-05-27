import { CourseUploadForm } from '@/components/admin/CourseUploadForm'

export default function NewCoursePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-syne text-2xl font-bold text-white mb-8">Шинэ курс үүсгэх</h1>
      <CourseUploadForm />
    </div>
  )
}
