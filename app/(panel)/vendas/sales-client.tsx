'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, DollarSign, TrendingUp, Target } from 'lucide-react'

export function SalesClient() {
  const [sales, setSales] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sales').then(r => r.json()).then(d => { setSales(d ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const totalValue = (sales ?? []).reduce((s: number, v: any) => s + (v?.value ?? 0), 0)
  const ticketMedio = (sales?.length ?? 0) > 0 ? totalValue / sales.length : 0
  const concluidas = (sales ?? []).filter((s: any) => s?.status === 'concluida')?.length ?? 0
  const taxa = (sales?.length ?? 0) > 0 ? Math.round((concluidas / sales.length) * 100) : 0

  // Ranking
  const negotiatorMap = new Map<string, { name: string; count: number; total: number }>()
  ;(sales ?? []).forEach((s: any) => {
    const name = s?.negotiator?.name ?? 'Desconhecido'
    const existing = negotiatorMap.get(name) ?? { name, count: 0, total: 0 }
    existing.count += 1
    existing.total += s?.value ?? 0
    negotiatorMap.set(name, existing)
  })
  const ranking = Array.from(negotiatorMap.values()).sort((a: any, b: any) => (b?.total ?? 0) - (a?.total ?? 0))

  const statusLabels: Record<string, string> = { concluida: 'Concluída', em_andamento: 'Em andamento', pendente: 'Pendente' }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-display font-bold text-white">Vendas</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'Vendas do Mês', value: String(sales?.length ?? 0), icon: ShoppingCart },
          { label: 'Valor Vendido', value: `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign },
          { label: 'Ticket Médio', value: `R$ ${ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: Target },
          { label: 'Taxa Conversão', value: `${taxa}%`, icon: TrendingUp },
        ].map((m: any, i: number) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#666] uppercase tracking-wider">{m?.label}</span>
              <m.icon size={15} className="text-[#555]" />
            </div>
            <p className="text-xl font-bold text-white">{m?.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Ranking */}
      <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
        <p className="text-sm font-medium text-white mb-4">Ranking de Negociadores</p>
        <div className="space-y-3">
          {ranking.map((r: any, i: number) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-lg font-bold text-[#333] w-6">{i + 1}</span>
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-white font-semibold">{(r?.name ?? 'D')?.[0]}</div>
              <div className="flex-1">
                <p className="text-sm text-white">{r?.name}</p>
                <p className="text-[10px] text-[#555]">{r?.count} vendas</p>
              </div>
              <span className="text-sm text-white font-mono">R$ {(r?.total ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {['Cliente', 'Serviço', 'Valor', 'Negociador', 'Data', 'Status'].map(h => (
                <th key={h} className="text-left text-[10px] text-[#555] uppercase tracking-wider py-3 px-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(sales ?? []).map((s: any, i: number) => (
              <motion.tr key={s?.id ?? i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-[#111] hover:bg-white/[0.02]">
                <td className="py-3 px-3 text-sm text-white">{s?.client?.company ?? '-'}</td>
                <td className="py-3 px-3 text-xs text-[#888]">{s?.service ?? '-'}</td>
                <td className="py-3 px-3 text-xs text-white font-mono">R$ {(s?.value ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="py-3 px-3 text-xs text-[#888]">{s?.negotiator?.name ?? '-'}</td>
                <td className="py-3 px-3 text-xs text-[#666] font-mono">{s?.createdAt ? new Date(s.createdAt).toLocaleDateString('pt-BR') : '-'}</td>
                <td className="py-3 px-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#888]">{statusLabels[s?.status ?? ''] ?? s?.status}</span></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
