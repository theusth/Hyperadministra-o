'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { DollarSign, ShoppingCart, Users, FolderKanban, TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react'
import dynamic from 'next/dynamic'

const RevenueChart = dynamic(() => import('./revenue-chart'), { ssr: false, loading: () => <div className="h-64 bg-[#111] rounded-xl animate-pulse" /> })

function MetricCard({ label, value, growth, icon: Icon, delay }: { label: string; value: string; growth: number; icon: any; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#2a2a2a] transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#666] uppercase tracking-wider">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
          <Icon size={15} className="text-[#888]" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white font-display">{value}</p>
      <div className="flex items-center gap-1 mt-2">
        {growth > 0 ? <TrendingUp size={12} className="text-[#aaa]" /> : growth < 0 ? <TrendingDown size={12} className="text-[#666]" /> : null}
        <span className={`text-xs ${growth > 0 ? 'text-[#aaa]' : growth < 0 ? 'text-[#666]' : 'text-[#555]'}`}>
          {growth > 0 ? '+' : ''}{growth}%
        </span>
      </div>
    </motion.div>
  )
}

function PipelineBar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#888] w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-white/30 rounded-full"
        />
      </div>
      <span className="text-xs text-white font-mono w-6 text-right">{count}</span>
    </div>
  )
}

function ProjectCard({ name, client, stage, progress }: { name: string; client: string; stage: string; progress: number }) {
  const stageLabels: Record<string, string> = {
    briefing: 'Briefing', design: 'Design', desenvolvimento: 'Desenvolvimento',
    revisao: 'Revisão', aprovacao: 'Aprovação', publicado: 'Publicado',
  }
  return (
    <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-4 hover:border-[#2a2a2a] transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-white">{name}</p>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#888]">{stageLabels[stage] ?? stage}</span>
      </div>
      <p className="text-xs text-[#555] mb-3">{client}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-white/40 rounded-full"
          />
        </div>
        <span className="text-xs text-[#888] font-mono">{progress}%</span>
      </div>
    </div>
  )
}

export function DashboardClient() {
  const { data: session } = useSession()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const role = (session?.user as any)?.role ?? data?.role ?? 'negociador'
  const userName = session?.user?.name ?? data?.userName ?? 'Usuário'

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Bom dia'
    if (h < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-[#111] rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-[#111] rounded-xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  const m = data?.metrics ?? {}

  // CEO Dashboard
  if (role === 'ceo') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-xl font-display font-bold text-white">{getGreeting()}, {userName}.</h1>
          <p className="text-sm text-[#555] mt-1">Visão geral da Hyper Studio</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Faturamento" value={`R$ ${(m?.revenue ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} growth={m?.revenueGrowth ?? 0} icon={DollarSign} delay={0.1} />
          <MetricCard label="Vendas" value={String(m?.salesCount ?? 0)} growth={m?.salesGrowth ?? 0} icon={ShoppingCart} delay={0.15} />
          <MetricCard label="Clientes Ativos" value={String(m?.activeClients ?? 0)} growth={m?.clientsGrowth ?? 0} icon={Users} delay={0.2} />
          <MetricCard label="Projetos Ativos" value={String(m?.activeProjects ?? 0)} growth={m?.projectsGrowth ?? 0} icon={FolderKanban} delay={0.25} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <div className="mb-4">
              <p className="text-sm font-medium text-white">Faturamento</p>
              <p className="text-xs text-[#555]">Últimos 7 meses</p>
            </div>
            <RevenueChart data={data?.revenueChart ?? []} />
          </motion.div>

          {/* Pipeline */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <p className="text-sm font-medium text-white mb-4">Pipeline Comercial</p>
            <div className="space-y-3">
              <PipelineBar label="Novo lead" count={data?.pipeline?.novo ?? 0} max={20} />
              <PipelineBar label="Em contato" count={data?.pipeline?.contato ?? 0} max={20} />
              <PipelineBar label="Interesse" count={data?.pipeline?.interesse ?? 0} max={20} />
              <PipelineBar label="Proposta" count={data?.pipeline?.proposta ?? 0} max={20} />
              <PipelineBar label="Negociação" count={data?.pipeline?.negociacao ?? 0} max={20} />
              <PipelineBar label="Fechado" count={data?.pipeline?.fechado ?? 0} max={20} />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Projects */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <p className="text-sm font-medium text-white mb-4">Projetos em Andamento</p>
            <div className="space-y-3">
              {(data?.projects ?? []).map((p: any, i: number) => (
                <ProjectCard key={i} name={p?.name ?? ''} client={p?.client ?? ''} stage={p?.stage ?? ''} progress={p?.progress ?? 0} />
              ))}
            </div>
          </motion.div>

          {/* Activities */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <p className="text-sm font-medium text-white mb-4">Atividades Recentes</p>
            <div className="space-y-3">
              {(data?.activities ?? []).map((a: any, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Activity size={11} className="text-[#666]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[#ccc]">{a?.text}</p>
                    <p className="text-[10px] text-[#444] mt-0.5 flex items-center gap-1"><Clock size={9} />{a?.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Marketing Dashboard
  if (role === 'marketing') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-xl font-display font-bold text-white">Marketing</h1>
          <p className="text-sm text-[#555] mt-1">Acompanhe leads e conversões</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard label="Leads Gerados" value={String(data?.leadsTotal ?? 0)} growth={15} icon={Users} delay={0.1} />
          <MetricCard label="Leads Novos" value={String(data?.leadsNovos ?? 0)} growth={20} icon={TrendingUp} delay={0.15} />
          <MetricCard label="Em Contato" value={String(data?.leadsContato ?? 0)} growth={5} icon={Activity} delay={0.2} />
          <MetricCard label="Conversões" value={String(data?.conversions ?? 0)} growth={10} icon={ShoppingCart} delay={0.25} />
          <MetricCard label="Taxa Conversão" value={`${data?.conversionRate ?? 0}%`} growth={3} icon={TrendingUp} delay={0.3} />
        </div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
          <p className="text-sm font-medium text-white mb-4">Leads por Semana</p>
          <RevenueChart data={[
            { month: 'Sem 1', value: 8 }, { month: 'Sem 2', value: 12 }, { month: 'Sem 3', value: 10 },
            { month: 'Sem 4', value: 14 }, { month: 'Sem 5', value: 11 }, { month: 'Sem 6', value: 15 },
          ]} />
        </motion.div>
      </div>
    )
  }

  // Negociador Dashboard
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-xl font-display font-bold text-white">Central Comercial</h1>
        <p className="text-sm text-[#555] mt-1">{getGreeting()}, {userName}</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Leads Recebidos" value={String(data?.negotiatorLeads ?? 0)} growth={10} icon={Users} delay={0.1} />
        <MetricCard label="Vendas Fechadas" value={String(data?.negotiatorSales ?? 0)} growth={8} icon={ShoppingCart} delay={0.15} />
        <MetricCard label="Valor Vendido" value={`R$ ${(data?.negotiatorValue ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} growth={15} icon={DollarSign} delay={0.2} />
        <MetricCard label="Comissão Prevista" value={`R$ ${(data?.negotiatorCommission ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} growth={12} icon={TrendingUp} delay={0.25} />
      </div>
    </div>
  )
}
