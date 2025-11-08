import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  const { participantId } = await params
  try {

    // Mark participant as no-show
    const participant = await prisma.participant.update({
      where: { id: participantId },
      data: { noShow: true },
      include: { user: true },
    })

    // Increment user's no-show count
    await prisma.user.update({
      where: { id: participant.userId },
      data: {
        noShowCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking no-show:', error)
    return NextResponse.json(
      { message: '노쇼 등록에 실패했습니다.' },
      { status: 500 }
    )
  }
}
