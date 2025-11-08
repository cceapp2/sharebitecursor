import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    // Update group status to confirmed
    await prisma.group.update({
      where: { id },
      data: {
        status: 'confirmed',
        pickupTime: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing pickup:', error)
    return NextResponse.json(
      { message: '처리에 실패했습니다.' },
      { status: 500 }
    )
  }
}
