export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json([], { status: 401 })
  const leads = await prisma.lead.findMany({
    include: { responsible: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(leads)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const data = await req.json()
  const lead = await prisma.lead.create({ data })
  return NextResponse.json(lead, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id, stage } = await req.json()
  if (!id || !stage) return NextResponse.json({ error: 'ID e stage obrigatórios' }, { status: 400 })
  const lead = await prisma.lead.update({ where: { id }, data: { stage } })
  return NextResponse.json(lead)
}
