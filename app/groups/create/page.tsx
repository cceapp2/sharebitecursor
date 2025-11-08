import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import CreateGroupForm from '@/components/CreateGroupForm'

export default async function CreateGroupPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-primary">공구 만들기</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <CreateGroupForm />
      </main>
    </div>
  )
}
