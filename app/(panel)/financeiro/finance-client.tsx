'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, ArrowDownCircle, ArrowUpCircle, Percent, TrendingUp, Wallet } from 'lucide-react'
import dynamic from 'next/dynamic'

const FinanceChart = dynamic(() => import('./finance-chart'), { ssr: false, loading: () => <div className="h-56 bg-[#111] rounded-xl animate-pulse" /> })

export function FinanceClient() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [category, setCategory] = useState('todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/financial').then(r => r.json()).then(d => { setTransactions(d ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const totalIncome = (transactions ?? []).reduce((s: number, t: any) => s + (t?.income ?? 0), 0)
  const totalExpense = (transactions ?? []).reduce((s: number, t: any) => s + (t?.expense ?? 0), 0)
  const received = (transactions ?? []).filter((t: any) => t?.status === 'concluido' && (t?.income ?? 0) > 0).reduce((s: number, t: any) => s + (t?.income ?? 0), 0)
  const pending = totalIncome - received
  const commissions = (transactions ?? []).filter((t: any) => t?.category === 'Comissão').reduce((s: number, t: any) => s + (t?.expense ?? 0), 0)
  const profit = totalIncome - totalExpense

  const filtered = category === 'todos' ? transactions : (transactions ?? []).filter((t: any) => t?.category === category)

  const categories = ['todos', 'Venda', 'Comissão', 'Hospedagem', 'Domínio', 'Ferramentas', 'Outros']

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-display font-bold text-white">Financeiro</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[{ l: 'Faturamento', v: totalIncome, icon: DollarSign }, { l: 'Recebido', v: received, icon: ArrowDownCircle },
          { l: 'Pendente', v: pending, icon: TrendingUp }, { l: 'Despesas', v: totalExpense, icon: ArrowUpCircle },
          { l: 'Comissões', v: commissions, icon: Percent }, { l: 'Lucro Líquido', v: profit, icon: Wallet },
        ].map((m: any, i: number) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[#666] uppercase tracking-wider">{m?.l}</span>
              <m.icon size={13} className="text-[#555]" />
            </div>
            <p className="text-lg font-bold text-white font-mono">R$ {(m?.v ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
        <p className="text-sm font-medium text-white mb-4">Fluxo Financeiro</p>
        <FinanceChart transactions={transactions} />
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${category === c ? 'bg-white text-black' : 'bg-[#111] text-[#666] border border-[#1a1a1a] hover:text-white'}`}>
            {c === 'todos' ? 'Todos' : c}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {['Data', 'Descrição', 'Categoria', 'Entrada', 'Saída', 'Status'].map(h => (
                <th key={h} className="text-left text-[10px] text-[#555] uppercase tracking-wider py-3 px-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(filtered ?? []).map((t: any, i: number) => (
              <motion.tr key={t?.id ?? i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-[#111] hover:bg-white/[0.02]">
                <td className="py-3 px-3 text-xs text-[#888] font-mono">{t?.date ? new Date(t.date).toLocaleDateString('pt-BR') : '-'}</td>
                <td className="py-3 px-3 text-sm text-white">{t?.description ?? '-'}</td>
                <td className="py-3 px-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#888]">{t?.category ?? '-'}</span></td>
                <td className="py-3 px-3 text-xs text-white font-mono">{(t?.income ?? 0) > 0 ? `R$ ${t.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</td>
                <td className="py-3 px-3 text-xs text-[#666] font-mono">{(t?.expense ?? 0) > 0 ? `R$ ${t.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</td>
                <td className="py-3 px-3"><span className={`text-[10px] px-2 py-0.5 rounded-full ${t?.status === 'concluido' ? 'bg-white/10 text-white' : 'bg-white/5 text-[#666]'}`}>{t?.status === 'concluido' ? 'Concluído' : 'Pendente'}</span></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
