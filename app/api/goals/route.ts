export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json([], { status: 401 })
  const goals = await prisma.goal.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(goals)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  if ((session.user as any)?.role !== 'ceo') return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { name, target, unit, period } = await req.json()
  const normalizedTarget = Number(target)
  if (!name?.trim() || !Number.isFinite(normalizedTarget) || normalizedTarget <= 0) {
    return NextResponse.json({ error: 'Informe um nome e uma meta válida' }, { status: 400 })
  }

  const goal = await prisma.goal.create({
    data: {
      name: name.trim(),
      target: normalizedTarget,
      unit: unit === 'R$' ? 'R$' : 'quantidade',
      period: ['semanal', 'mensal', 'trimestral', 'anual'].includes(period) ? period : 'mensal',
    },
  })
  return NextResponse.json(goal, { status: 201 })
}
