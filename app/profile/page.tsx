import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ProfileClient from '@/components/ProfileClient'

async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      participants: {
        include: {
          group: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
  return user
}

export default async function ProfilePage() {
  // For MVP, get the test user
  const user = await prisma.user.findFirst({
    where: { phone: '000-0000-0000' },
  })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">사용자를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const userWithHistory = await getUser(user.id)

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="text-xl font-bold text-primary">프로필</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <ProfileClient user={userWithHistory!} />
      </main>
    </div>
  )
}
