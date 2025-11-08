'use client'

import { useRouter } from 'next/navigation'

export default function CreateGroupButton({ floating = false }: { floating?: boolean }) {
  const router = useRouter()

  if (floating) {
    return (
      <button
        onClick={() => router.push('/groups/create')}
        className="fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-full shadow-lg hover:bg-primary-dark transition-colors flex items-center justify-center text-2xl z-20"
        aria-label="공구 만들기"
      >
        +
      </button>
    )
  }

  return (
    <button
      onClick={() => router.push('/groups/create')}
      className="btn-primary"
    >
      내 공구 만들기
    </button>
  )
}
