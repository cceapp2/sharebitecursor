import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {

    // Get test user (in production, get from session)
    const user = await prisma.user.findFirst({
      where: { phone: '000-0000-0000' },
    })

    if (!user) {
      return NextResponse.json(
        { message: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // Remove participant
    await prisma.participant.deleteMany({
      where: {
        userId: user.id,
        groupId: id,
      },
    })

    // Check if group should be reopened
    const group = await prisma.group.findUnique({
      where: { id },
      include: { participants: true },
    })

    if (group && group.status === 'closed' && group.participants.length < group.totalMembers) {
      await prisma.group.update({
        where: { id },
        data: { status: 'recruiting' },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error leaving group:', error)
    return NextResponse.json(
      { message: '취소에 실패했습니다.' },
      { status: 500 }
    )
  }
}
