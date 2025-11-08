import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import GroupDetailClient from '@/components/GroupDetailClient'
import Link from 'next/link'

async function getGroup(id: string) {
  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
    },
  })
  return group
}

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const group = await getGroup(id)

  if (!group) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="text-xl font-bold text-primary">공구 상세</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <GroupDetailClient group={group} />
      </main>
    </div>
  )
}
