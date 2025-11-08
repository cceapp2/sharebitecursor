'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  phone: string
}

interface Participant {
  id: string
  userId: string
  paidStatus: string
  user: User
}

interface Group {
  id: string
  title: string
  product: string
  totalQty: number
  unitQty: number
  totalMembers: number
  minMembers: number
  deadline: Date
  status: string
  pickupLocation: string
  pickupTime: Date | null
  participants: Participant[]
}

export default function GroupDetailClient({ group }: { group: Group }) {
  const router = useRouter()
  const [isJoining, setIsJoining] = useState(false)
  const [isParticipating, setIsParticipating] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const currentMembers = group.participants.length
  const timeLeft = new Date(group.deadline).getTime() - Date.now()
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const pricePerUnit = 10000 // This would come from the group data in a real app
  const unitPrice = Math.round(pricePerUnit / (group.totalQty / group.unitQty))

  // Check if user is already participating (in a real app, check against session)
  useEffect(() => {
    // For MVP, we'll use localStorage to track participation
    const participated = localStorage.getItem(`participated_${group.id}`)
    setIsParticipating(!!participated)
    
    // Check if user is creator (first participant is usually creator)
    const isUserCreator = group.participants.length > 0 && 
      localStorage.getItem(`created_${group.id}`) === 'true'
    setIsCreator(isUserCreator)
  }, [group.id, group.participants.length])

  const handleJoin = async () => {
    setIsJoining(true)
    try {
      const response = await fetch(`/api/groups/${group.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        localStorage.setItem(`participated_${group.id}`, 'true')
        setIsParticipating(true)
        router.refresh()
      } else {
        alert('참여에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      alert('오류가 발생했습니다.')
    } finally {
      setIsJoining(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('정말 참여를 취소하시겠습니까?')) return

    try {
      const response = await fetch(`/api/groups/${group.id}/leave`, {
        method: 'POST',
      })

      if (response.ok) {
        localStorage.removeItem(`participated_${group.id}`)
        setIsParticipating(false)
        router.refresh()
      }
    } catch (error) {
      alert('오류가 발생했습니다.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-2">{group.title}</h2>
        <p className="text-gray-600 mb-4">{group.product}</p>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">모집 현황</span>
              <span className="font-semibold">
                {currentMembers}/{group.totalMembers}명
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${(currentMembers / group.totalMembers) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">마감 시간</p>
              <p className="font-semibold">
                {hoursLeft > 0 ? `${hoursLeft}시간 ` : ''}
                {minutesLeft}분 남음
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">1인당 수량</p>
              <p className="font-semibold">{group.unitQty}kg</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">픽업 장소</p>
            <p className="font-semibold">📍 {group.pickupLocation}</p>
          </div>

          {group.status === 'closed' && group.pickupTime && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-semibold mb-1">
                모집 완료! 🎉
              </p>
              <p className="text-sm text-green-700 mb-3">
                픽업 시간: {new Date(group.pickupTime).toLocaleString('ko-KR')}
              </p>
              {isCreator && (
                <a
                  href={`/groups/${group.id}/pickup`}
                  className="inline-block btn-secondary text-sm py-2 px-4"
                >
                  픽업 관리하기
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {group.status === 'recruiting' && (
        <div className="card">
          <h3 className="font-semibold mb-4">정산 안내</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">1인당 금액</span>
              <span className="font-semibold">{unitPrice.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">수량</span>
              <span className="font-semibold">{group.unitQty}kg</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            모집 완료 후 계좌번호가 안내됩니다. 송금 확인 후 픽업 장소와 시간이 확정됩니다.
          </p>

          {isParticipating ? (
            <button
              onClick={handleCancel}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              참여 취소하기
            </button>
          ) : (
            <button
              onClick={handleJoin}
              disabled={isJoining || currentMembers >= group.totalMembers}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? '처리 중...' : '참여하기'}
            </button>
          )}
        </div>
      )}

      {group.participants.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-4">참여자 목록</h3>
          <div className="space-y-2">
            {group.participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span>{participant.user.name}</span>
                <span
                  className={`text-sm ${
                    participant.paidStatus === 'paid'
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
                >
                  {participant.paidStatus === 'paid' ? '✓ 송금완료' : '송금대기'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
