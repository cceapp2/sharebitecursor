'use client'

interface Group {
  id: string
  title: string
  product: string
  status: string
  createdAt: Date
}

interface Participant {
  id: string
  paidStatus: string
  noShow: boolean
  group: Group
}

interface User {
  id: string
  name: string
  phone: string
  phoneVerified: boolean
  noShowCount: number
  participants: Participant[]
}

export default function ProfileClient({ user }: { user: User }) {
  const participatedGroups = user.participants.length
  const hostedGroups = 0 // Would need to track this separately
  const completedGroups = user.participants.filter(
    (p) => p.group.status === 'confirmed'
  ).length

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
            <p className="text-gray-600">{user.phone}</p>
          </div>
          {user.phoneVerified && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              ✓ 인증완료
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{participatedGroups}</p>
            <p className="text-sm text-gray-600">참여한 공구</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary">{hostedGroups}</p>
            <p className="text-sm text-gray-600">주최한 공구</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-700">{completedGroups}</p>
            <p className="text-sm text-gray-600">완료한 공구</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">신뢰도 정보</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">노쇼 기록</span>
            <span className={`font-semibold ${user.noShowCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {user.noShowCount}회
            </span>
          </div>
          {user.noShowCount === 0 && (
            <p className="text-sm text-green-600">✓ 완벽한 참여 기록입니다!</p>
          )}
          {user.noShowCount > 0 && (
            <p className="text-sm text-red-600">
              ⚠️ 노쇼 기록이 있어 다른 사용자들이 신뢰할 수 있습니다.
            </p>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">참여 내역</h3>
        {user.participants.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            아직 참여한 공구가 없습니다.
          </p>
        ) : (
          <div className="space-y-3">
            {user.participants.map((participant) => (
              <a
                key={participant.id}
                href={`/groups/${participant.group.id}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{participant.group.title}</h4>
                    <p className="text-sm text-gray-600">{participant.group.product}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        participant.group.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : participant.group.status === 'closed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {participant.group.status === 'confirmed'
                        ? '완료'
                        : participant.group.status === 'closed'
                        ? '모집완료'
                        : '모집중'}
                    </span>
                    {participant.noShow && (
                      <p className="text-xs text-red-600 mt-1">노쇼</p>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
