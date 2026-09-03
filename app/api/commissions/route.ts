export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json([], { status: 401 })
  const role = (session.user as any)?.role
  const where = role === 'ceo' ? {} : { userId: session.user.id }
  const commissions = await prisma.commission.findMany({
    where,
    include: { sale: { include: { client: true } }, user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(commissions)
}
