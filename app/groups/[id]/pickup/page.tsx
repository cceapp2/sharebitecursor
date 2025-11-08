import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PickupManagementClient from '@/components/PickupManagementClient'

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

export default async function PickupManagementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const group = await getGroup(id)

  if (!group) {
    notFound()
  }

  if (group.status !== 'closed' && group.status !== 'confirmed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">아직 모집 중인 공구입니다.</p>
          <a href={`/groups/${id}`} className="text-primary underline">
            공구 상세로 돌아가기
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-primary">픽업 관리</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <PickupManagementClient group={group} />
      </main>
    </div>
  )
}
