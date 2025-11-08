'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface User {
  id: string
  name: string
  phone: string
  noShowCount: number
}

interface Participant {
  id: string
  userId: string
  paidStatus: string
  noShow: boolean
  user: User
}

interface Group {
  id: string
  title: string
  product: string
  pickupLocation: string
  pickupTime: Date | null
  participants: Participant[]
}

export default function PickupManagementClient({ group }: { group: Group }) {
  const router = useRouter()
  const [participants, setParticipants] = useState(group.participants)
  const [isSaving, setIsSaving] = useState(false)

  const handleNoShow = async (participantId: string) => {
    if (!confirm('노쇼로 등록하시겠습니까? 이 기록은 사용자 프로필에 남습니다.')) {
      return
    }

    try {
      const response = await fetch(`/api/groups/${group.id}/participants/${participantId}/noshow`, {
        method: 'POST',
      })

      if (response.ok) {
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === participantId ? { ...p, noShow: true } : p
          )
        )
      } else {
        alert('노쇼 등록에 실패했습니다.')
      }
    } catch (error) {
      alert('오류가 발생했습니다.')
    }
  }

  const handleComplete = async () => {
    if (!confirm('픽업을 완료 처리하시겠습니까?')) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/groups/${group.id}/complete`, {
        method: 'POST',
      })

      if (response.ok) {
        alert('픽업이 완료되었습니다!')
        router.push(`/groups/${group.id}`)
      } else {
        alert('처리에 실패했습니다.')
      }
    } catch (error) {
      alert('오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold mb-2">{group.title}</h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">픽업 장소:</span> {group.pickupLocation}
          </p>
          {group.pickupTime && (
            <p>
              <span className="font-semibold">픽업 시간:</span>{' '}
              {new Date(group.pickupTime).toLocaleString('ko-KR')}
            </p>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">참여자 출석 체크</h3>
        <div className="space-y-3">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!participant.noShow}
                  disabled
                  className="w-5 h-5 text-primary"
                />
                <div>
                  <p className="font-medium">{participant.user.name}</p>
                  <p className="text-sm text-gray-500">
                    노쇼 기록: {participant.user.noShowCount}회
                  </p>
                </div>
              </div>
              {!participant.noShow && (
                <button
                  onClick={() => handleNoShow(participant.id)}
                  className="text-sm text-red-600 hover:text-red-700 underline"
                >
                  노쇼 등록
                </button>
              )}
              {participant.noShow && (
                <span className="text-sm text-red-600 font-medium">노쇼</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleComplete}
        disabled={isSaving}
        className="w-full btn-primary disabled:opacity-50"
      >
        {isSaving ? '처리 중...' : '픽업 완료 처리'}
      </button>
    </div>
  )
}
