'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function FinanceChart({ transactions }: { transactions: any[] }) {
  // Group by category
  const catMap = new Map<string, { income: number; expense: number }>()
  ;(transactions ?? []).forEach((t: any) => {
    const cat = t?.category ?? 'Outros'
    const existing = catMap.get(cat) ?? { income: 0, expense: 0 }
    existing.income += t?.income ?? 0
    existing.expense += t?.expense ?? 0
    catMap.set(cat, existing)
  })
  const data = Array.from(catMap.entries()).map(([cat, vals]) => ({ category: cat, entrada: vals.income, saida: vals.expense }))

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <XAxis dataKey="category" tickLine={false} tick={{ fontSize: 10, fill: '#555' }} axisLine={false} />
          <YAxis tickLine={false} tick={{ fontSize: 10, fill: '#444' }} axisLine={false} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
          <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: '8px', fontSize: 11, color: '#fff' }} />
          <Bar dataKey="entrada" fill="#ffffff" radius={[3, 3, 0, 0]} />
          <Bar dataKey="saida" fill="#444444" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
