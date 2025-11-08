import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      product,
      totalQty,
      unitQty,
      totalMembers,
      minMembers,
      deadline,
      pickupLocation,
    } = body

    // Validate required fields
    if (!title || !product || !totalQty || !unitQty || !totalMembers || !deadline || !pickupLocation) {
      return NextResponse.json(
        { message: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // Create a temporary user for MVP (in production, get from session)
    let user = await prisma.user.findFirst({
      where: { phone: '000-0000-0000' }, // Default test user
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

    // Create group
    const group = await prisma.group.create({
      data: {
        title,
        product,
        totalQty: parseFloat(totalQty),
        unitQty: parseFloat(unitQty),
        totalMembers: parseInt(totalMembers),
        minMembers: parseInt(minMembers) || 2,
        deadline: new Date(deadline),
        pickupLocation,
        status: 'recruiting',
      },
    })

    // Auto-join creator as first participant
    await prisma.participant.create({
      data: {
        userId: user.id,
        groupId: group.id,
        paidStatus: 'pending',
      },
    })

    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json(
      { message: '공구 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}
