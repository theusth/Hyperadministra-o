'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const ReportsChart = dynamic(() => import('./reports-chart'), { ssr: false, loading: () => <div className="h-56 bg-[#111] rounded-xl animate-pulse" /> })

const periods = ['Hoje', 'Semana', 'Mês', 'Trimestre', 'Ano']

const sections = [
  { title: 'Faturamento', data: [{ month: 'Jan', value: 6200 }, { month: 'Fev', value: 8200 }, { month: 'Mar', value: 9500 }, { month: 'Abr', value: 7800 }, { month: 'Mai', value: 11200 }, { month: 'Jun', value: 10400 }, { month: 'Jul', value: 13100 }, { month: 'Ago', value: 12480 }] },
  { title: 'Vendas', data: [{ month: 'Jan', value: 5 }, { month: 'Fev', value: 8 }, { month: 'Mar', value: 12 }, { month: 'Abr', value: 7 }, { month: 'Mai', value: 15 }, { month: 'Jun', value: 10 }, { month: 'Jul', value: 18 }, { month: 'Ago', value: 14 }] },
  { title: 'Leads', data: [{ month: 'Jan', value: 20 }, { month: 'Fev', value: 28 }, { month: 'Mar', value: 35 }, { month: 'Abr', value: 30 }, { month: 'Mai', value: 42 }, { month: 'Jun', value: 38 }, { month: 'Jul', value: 50 }, { month: 'Ago', value: 44 }] },
  { title: 'Taxa de Conversão (%)', data: [{ month: 'Jan', value: 25 }, { month: 'Fev', value: 29 }, { month: 'Mar', value: 34 }, { month: 'Abr', value: 23 }, { month: 'Mai', value: 36 }, { month: 'Jun', value: 26 }, { month: 'Jul', value: 36 }, { month: 'Ago', value: 32 }] },
]

export function ReportsClient() {
  const [period, setPeriod] = useState('Mês')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-white">Relatórios</h1>
        <div className="flex gap-1.5">
          {periods.map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${period === p ? 'bg-white text-black' : 'bg-[#111] text-[#666] border border-[#1a1a1a] hover:text-white'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map((s: any, i: number) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <p className="text-sm font-medium text-white mb-4">{s?.title}</p>
            <ReportsChart data={s?.data ?? []} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
