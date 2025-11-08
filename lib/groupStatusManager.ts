import { prisma } from '@/lib/prisma'

// This function checks and updates group statuses based on deadlines and member counts
export async function updateGroupStatuses() {
  const now = new Date()

  // Find groups that have passed their deadline
  const expiredGroups = await prisma.group.findMany({
    where: {
      deadline: {
        lte: now,
      },
      status: 'recruiting',
    },
    include: {
      participants: true,
    },
  })

  for (const group of expiredGroups) {
    if (group.participants.length < group.minMembers) {
      // Auto-cancel if minimum members not met
      await prisma.group.update({
        where: { id: group.id },
        data: { status: 'cancelled' },
      })
    } else {
      // Close recruitment if minimum met
      await prisma.group.update({
        where: { id: group.id },
        data: { status: 'closed' },
      })
    }
  }
}
