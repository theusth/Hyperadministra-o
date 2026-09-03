export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json([], { status: 401 })
  if ((session.user as any)?.role !== 'ceo') return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  const transactions = await prisma.financialTransaction.findMany({ orderBy: { date: 'desc' } })
  return NextResponse.json(transactions)
}
