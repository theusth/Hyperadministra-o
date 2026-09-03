export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json([], { status: 401 })
  const sales = await prisma.sale.findMany({
    include: { client: true, negotiator: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(sales)
}
