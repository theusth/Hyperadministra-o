'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Percent, DollarSign } from 'lucide-react'

export function CommissionsClient() {
  const [commissions, setCommissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/commissions').then(r => r.json()).then(d => { setCommissions(d ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const totalPaid = (commissions ?? []).filter((c: any) => c?.status === 'pago').reduce((s: number, c: any) => s + (c?.value ?? 0), 0)
  const totalPending = (commissions ?? []).filter((c: any) => c?.status === 'pendente').reduce((s: number, c: any) => s + (c?.value ?? 0), 0)

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-display font-bold text-white">Comissões</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#666] uppercase tracking-wider">Total Comissões</span>
            <DollarSign size={14} className="text-[#555]" />
          </div>
          <p className="text-xl font-bold text-white font-mono">R$ {(totalPaid + totalPending).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#666] uppercase tracking-wider">Pagas</span>
            <Percent size={14} className="text-[#555]" />
          </div>
          <p className="text-xl font-bold text-white font-mono">R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#666] uppercase tracking-wider">Pendentes</span>
            <DollarSign size={14} className="text-[#555]" />
          </div>
          <p className="text-xl font-bold text-white font-mono">R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </motion.div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {['Negociador', 'Cliente', 'Valor Venda', '%', 'Comissão', 'Status'].map(h => (
                <th key={h} className="text-left text-[10px] text-[#555] uppercase tracking-wider py-3 px-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(commissions ?? []).map((c: any, i: number) => (
              <motion.tr key={c?.id ?? i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-[#111] hover:bg-white/[0.02]">
                <td className="py-3 px-3 text-sm text-white">{c?.user?.name ?? '-'}</td>
                <td className="py-3 px-3 text-xs text-[#888]">{c?.sale?.client?.company ?? '-'}</td>
                <td className="py-3 px-3 text-xs text-white font-mono">R$ {(c?.sale?.value ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="py-3 px-3 text-xs text-[#888]">{c?.percentage ?? 0}%</td>
                <td className="py-3 px-3 text-xs text-white font-mono">R$ {(c?.value ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="py-3 px-3"><span className={`text-[10px] px-2 py-0.5 rounded-full ${c?.status === 'pago' ? 'bg-white/10 text-white' : 'bg-white/5 text-[#666]'}`}>{c?.status === 'pago' ? 'Pago' : 'Pendente'}</span></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
