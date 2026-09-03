'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Target } from 'lucide-react'

export function GoalsClient() {
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [unit, setUnit] = useState('R$')
  const [period, setPeriod] = useState('mensal')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/goals').then(r => r.json()).then(d => { setGoals(d ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  async function createGoal(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, target: Number(target), unit, period }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Não foi possível criar a meta')
      setGoals((current) => [...current, data])
      setName('')
      setTarget('')
      setPeriod('mensal')
      setShowForm(false)
    } catch (err: any) {
      setError(err.message || 'Não foi possível criar a meta')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-[#111] rounded-xl animate-pulse" />)}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-display font-bold text-white">Metas</h1>
        <button onClick={() => { setError(''); setShowForm((visible) => !visible) }} className="rounded-lg bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black hover:bg-[#e0e0e0]">
          {showForm ? 'Cancelar' : 'Nova meta'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createGoal} className="grid gap-3 rounded-xl border border-[#2a2a2a] bg-[#111] p-5 sm:grid-cols-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da meta" required className="rounded-lg border border-[#333] bg-[#0b0b0b] px-3 py-2 text-sm text-white outline-none focus:border-[#666]" />
          <input value={target} onChange={(e) => setTarget(e.target.value)} type="number" min="0.01" step="0.01" placeholder="Valor ou quantidade" required className="rounded-lg border border-[#333] bg-[#0b0b0b] px-3 py-2 text-sm text-white outline-none focus:border-[#666]" />
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="rounded-lg border border-[#333] bg-[#0b0b0b] px-3 py-2 text-sm text-white outline-none focus:border-[#666]">
            <option value="R$">R$</option>
            <option value="quantidade">Quantidade</option>
          </select>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="rounded-lg border border-[#333] bg-[#0b0b0b] px-3 py-2 text-sm text-white outline-none focus:border-[#666]">
            <option value="semanal">Semanal</option>
            <option value="mensal">Mensal</option>
            <option value="trimestral">Trimestral</option>
            <option value="anual">Anual</option>
          </select>
          {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}
          <button disabled={saving} type="submit" className="rounded-lg bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black disabled:opacity-50 sm:col-span-2">
            {saving ? 'Salvando...' : 'Salvar meta'}
          </button>
        </form>
      )}
      <div className="space-y-4">
        {(goals ?? []).map((g: any, i: number) => {
          const pct = (g?.target ?? 1) > 0 ? Math.round(((g?.current ?? 0) / g.target) * 100) : 0
          const formatVal = (v: number) => g?.unit === 'R$' ? `R$ ${v.toLocaleString('pt-BR')}` : String(v)
          return (
            <motion.div key={g?.id ?? i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#2a2a2a] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Target size={14} className="text-[#888]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{g?.name}</p>
                    <p className="text-[10px] text-[#555]">{formatVal(g?.current ?? 0)} de {formatVal(g?.target ?? 0)}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-white font-mono">{pct}%</span>
              </div>
              <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(pct, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 + 0.3 }}
                  className="h-full bg-white/30 rounded-full"
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
