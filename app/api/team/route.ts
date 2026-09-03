export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json([], { status: 401 })
  if ((session.user as any)?.role !== 'ceo') return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  const users = await prisma.user.findMany({
    where: { email: { not: { contains: 'abacus' } } },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  // Enrich with stats
  const enriched = await Promise.all(users.map(async (u: any) => {
    const [salesCount, leadsCount, projectsCount, commissions] = await Promise.all([
      prisma.sale.count({ where: { negotiatorId: u.id } }),
      prisma.lead.count({ where: { responsibleId: u.id } }),
      prisma.project.count({ where: { responsibleId: u.id } }),
      prisma.commission.aggregate({ where: { userId: u.id }, _sum: { value: true } }),
    ])
    return { ...u, salesCount, leadsCount, projectsCount, totalCommission: commissions?._sum?.value ?? 0 }
  }))
  return NextResponse.json(enriched)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  if ((session.user as any)?.role !== 'ceo') return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id, role } = await req.json()
  if (!id || !['', 'ceo', 'marketing', 'negociador'].includes(role)) {
    return NextResponse.json({ error: 'Cargo inválido' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, role: true },
  })
  return NextResponse.json(user)
}
