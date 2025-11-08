'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
  participants: Array<{ id: string }>
}

export default function GroupCard({ group }: { group: Group }) {
  const router = useRouter()
  const currentMembers = group.participants.length
  const timeLeft = new Date(group.deadline).getTime() - Date.now()
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const isUrgent = timeLeft < 30 * 60 * 1000 // 30 minutes

  const handleClick = () => {
    router.push(`/groups/${group.id}`)
  }

  return (
    <div 
      className="card cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{group.title}</h3>
          <p className="text-gray-600 text-sm">{group.product}</p>
        </div>
        {group.status === 'closed' && (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
            모집 완료🎉
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(currentMembers / group.totalMembers) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {currentMembers}/{group.totalMembers}명
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className={`flex items-center gap-1 ${isUrgent ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
          <span>⏰</span>
          <span>
            {hoursLeft > 0 ? `${hoursLeft}시간 ` : ''}
            {minutesLeft}분 남음
          </span>
        </div>
        <div className="text-gray-500">
          📍 {group.pickupLocation}
        </div>
      </div>
    </div>
  )
}
