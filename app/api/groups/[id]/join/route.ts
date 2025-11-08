import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {

    // Get or create test user (in production, get from session)
    let user = await prisma.user.findFirst({
      where: { phone: '000-0000-0000' },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: '테스트 사용자',
          phone: '000-0000-0000',
          phoneVerified: true,
        },
      })
    }

    // Check if group exists and is still recruiting
    const group = await prisma.group.findUnique({
      where: { id },
      include: { participants: true },
    })

    if (!group) {
      return NextResponse.json(
        { message: '공구를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (group.status !== 'recruiting') {
      return NextResponse.json(
        { message: '모집이 마감된 공구입니다.' },
        { status: 400 }
      )
    }

    if (group.participants.length >= group.totalMembers) {
      return NextResponse.json(
        { message: '모집 인원이 가득 찼습니다.' },
        { status: 400 }
      )
    }

    // Check if user already joined
    const existingParticipant = await prisma.participant.findUnique({
      where: {
        userId_groupId: {
          userId: user.id,
          groupId: id,
        },
      },
    })

    if (existingParticipant) {
      return NextResponse.json(
        { message: '이미 참여한 공구입니다.' },
        { status: 400 }
      )
    }

    // Join group
    await prisma.participant.create({
      data: {
        userId: user.id,
        groupId: id,
        paidStatus: 'pending',
      },
    })

    // Check if group is now full
    const updatedGroup = await prisma.group.findUnique({
      where: { id },
      include: { participants: true },
    })

    if (updatedGroup && updatedGroup.participants.length >= updatedGroup.totalMembers) {
      // Close recruitment
      await prisma.group.update({
        where: { id },
        data: { status: 'closed' },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error joining group:', error)
    return NextResponse.json(
      { message: '참여에 실패했습니다.' },
      { status: 500 }
    )
  }
}
