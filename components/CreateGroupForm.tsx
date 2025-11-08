'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateGroupForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    product: '',
    totalQty: '',
    unitQty: '',
    totalMembers: '',
    minMembers: '2',
    deadline: '',
    pickupLocation: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalQty: parseFloat(formData.totalQty),
          unitQty: parseFloat(formData.unitQty),
          totalMembers: parseInt(formData.totalMembers),
          minMembers: parseInt(formData.minMembers),
          deadline: new Date(formData.deadline).toISOString(),
        }),
      })

      if (response.ok) {
        const group = await response.json()
        // Mark as creator in localStorage
        localStorage.setItem(`created_${group.id}`, 'true')
        localStorage.setItem(`participated_${group.id}`, 'true')
        router.push(`/groups/${group.id}`)
      } else {
        const error = await response.json()
        alert(error.message || '공구 생성에 실패했습니다.')
      }
    } catch (error) {
      alert('오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Calculate minimum deadline (1 hour from now)
  const minDeadline = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          공구 제목 *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="예: 삼겹살 10kg 공구"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          상품명 *
        </label>
        <input
          type="text"
          name="product"
          value={formData.product}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="예: 삼겹살"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            총 수량 (kg) *
          </label>
          <input
            type="number"
            name="totalQty"
            value={formData.totalQty}
            onChange={handleChange}
            required
            step="0.1"
            min="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            1인당 수량 (kg) *
          </label>
          <input
            type="number"
            name="unitQty"
            value={formData.unitQty}
            onChange={handleChange}
            required
            step="0.1"
            min="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            모집 인원 *
          </label>
          <input
            type="number"
            name="totalMembers"
            value={formData.totalMembers}
            onChange={handleChange}
            required
            min="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            최소 인원 *
          </label>
          <input
            type="number"
            name="minMembers"
            value={formData.minMembers}
            onChange={handleChange}
            required
            min="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          마감 시간 *
        </label>
        <input
          type="datetime-local"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
          min={minDeadline}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          픽업 장소 *
        </label>
        <input
          type="text"
          name="pickupLocation"
          value={formData.pickupLocation}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="예: 수원역 2번 출구 앞"
        />
        <p className="text-sm text-gray-500 mt-1">
          픽업은 지정된 장소에서 30분간 진행됩니다.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 모집이 완료되면 자동으로 정산 안내가 진행됩니다. 각 참여자는 계좌이체로 비용을 분할 납부합니다.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '등록 중...' : '제안 등록하기'}
        </button>
      </div>
    </form>
  )
}
