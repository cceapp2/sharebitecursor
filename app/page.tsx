import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import GroupCard from '@/components/GroupCard'
import CreateGroupButton from '@/components/CreateGroupButton'
import { updateGroupStatuses } from '@/lib/groupStatusManager'

async function getGroups() {
  // Update group statuses before fetching
  await updateGroupStatuses()
  
  const groups = await prisma.group.findMany({
    where: {
      status: {
        in: ['recruiting', 'closed']
      }
    },
    include: {
      participants: true,
    },
    orderBy: {
      deadline: 'asc',
    },
  })
  return groups
}

export default async function Home() {
  const groups = await getGroups()

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">ShareBite</h1>
            <p className="text-sm text-gray-600">함께 사서 덜 낭비하자</p>
          </div>
          <Link href="/profile" className="text-gray-600 hover:text-primary">
            프로필
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">모집 중인 공구</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
                모집중
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                마감
              </button>
            </div>
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">아직 진행 중인 공구가 없습니다.</p>
            <CreateGroupButton />
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </main>

      <CreateGroupButton floating />
    </div>
  )
}
