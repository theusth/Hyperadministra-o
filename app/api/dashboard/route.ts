export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const role = (session.user as any)?.role ?? 'negociador'

  const [clients, leads, sales, projects, recentSales, goals, allLeads] = await Promise.all([
    prisma.client.count({ where: { status: 'ativo' } }),
    prisma.lead.count(),
    prisma.sale.findMany({ include: { client: true, negotiator: true }, orderBy: { createdAt: 'desc' } }),
    prisma.project.findMany({ include: { client: true, responsible: true }, orderBy: { createdAt: 'desc' } }),
    prisma.sale.findMany({ include: { client: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.goal.findMany(),
    prisma.lead.findMany({ include: { responsible: true }, orderBy: { createdAt: 'desc' } }),
  ])

  const totalRevenue = sales?.reduce((sum: number, s: any) => sum + (s?.value ?? 0), 0) ?? 0
  const activeProjects = projects?.filter((p: any) => p?.stage !== 'publicado')?.length ?? 0

  const pipeline = {
    novo: allLeads?.filter((l: any) => l?.stage === 'novo')?.length ?? 0,
    contato: allLeads?.filter((l: any) => l?.stage === 'contato')?.length ?? 0,
    interesse: allLeads?.filter((l: any) => l?.stage === 'interesse')?.length ?? 0,
    proposta: allLeads?.filter((l: any) => l?.stage === 'proposta')?.length ?? 0,
    negociacao: allLeads?.filter((l: any) => l?.stage === 'negociacao')?.length ?? 0,
    fechado: allLeads?.filter((l: any) => l?.stage === 'fechado')?.length ?? 0,
  }

  // Revenue chart mock data (last 7 months)
  const revenueChart = [
    { month: 'Fev', value: 8200 },
    { month: 'Mar', value: 9500 },
    { month: 'Abr', value: 7800 },
    { month: 'Mai', value: 11200 },
    { month: 'Jun', value: 10400 },
    { month: 'Jul', value: 13100 },
    { month: 'Ago', value: 12480 },
  ]

  const activities = [
    { time: '10:32', text: 'Rafael fechou venda com Hotel Vista Alegre — R$ 3.500' },
    { time: '09:15', text: 'Novo lead: Lucas Ferreira via Instagram' },
    { time: '08:47', text: 'Projeto LP Bruno Barbearia atualizado para 91%' },
    { time: 'Ontem', text: 'Pagamento recebido — FC Advocacia R$ 2.800' },
    { time: 'Ontem', text: 'Juliana converteu lead Vanessa Alves para venda' },
  ]

  return NextResponse.json({
    metrics: {
      revenue: totalRevenue,
      revenueGrowth: 18.4,
      salesCount: sales?.length ?? 0,
      salesGrowth: 12.5,
      activeClients: clients,
      clientsGrowth: 8.2,
      activeProjects,
      projectsGrowth: 0,
    },
    revenueChart,
    pipeline,
    projects: (projects ?? []).filter((p: any) => p?.stage !== 'publicado').slice(0, 4).map((p: any) => ({
      name: p?.name,
      client: p?.client?.company,
      stage: p?.stage,
      progress: p?.progress,
    })),
    activities,
    role,
    userName: session.user.name,
    // Marketing-specific
    leadsTotal: allLeads?.length ?? 0,
    leadsNovos: pipeline.novo,
    leadsContato: pipeline.contato,
    conversions: pipeline.fechado,
    conversionRate: allLeads?.length ? Math.round((pipeline.fechado / allLeads.length) * 100) : 0,
    // Negociador-specific
    negotiatorLeads: role === 'negociador' ? allLeads?.filter((l: any) => l?.responsible?.id === session.user.id)?.length ?? 0 : 0,
    negotiatorSales: role === 'negociador' ? sales?.filter((s: any) => s?.negotiator?.id === session.user.id)?.length ?? 0 : 0,
    negotiatorValue: role === 'negociador' ? sales?.filter((s: any) => s?.negotiator?.id === session.user.id)?.reduce((sum: number, s: any) => sum + (s?.value ?? 0), 0) ?? 0 : 0,
    negotiatorCommission: role === 'negociador' ? (sales?.filter((s: any) => s?.negotiator?.id === session.user.id)?.reduce((sum: number, s: any) => sum + (s?.value ?? 0), 0) ?? 0) * 0.2 : 0,
  })
}
