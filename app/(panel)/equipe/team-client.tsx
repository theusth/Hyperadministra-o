'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, UserPlus, FolderKanban, DollarSign } from 'lucide-react'

const roleLabels: Record<string, string> = { '': 'Sem cargo', ceo: 'CEO', marketing: 'Marketing', negociador: 'Negociador' }

export function TeamClient() {
  const [team, setTeam] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function changeRole(id: string, role: string) {
    const response = await fetch('/api/team', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    })
    if (!response.ok) return
    setTeam((current) => current.map((member) => member.id === id ? { ...member, role } : member))
  }

  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(d => { setTeam(d ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-48 bg-[#111] rounded-xl animate-pulse" />)}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-display font-bold text-white">Equipe</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(team ?? []).map((m: any, i: number) => (
          <motion.div key={m?.id ?? i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#2a2a2a] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                {(m?.name ?? 'U')?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{m?.name ?? '-'}</p>
                <p className="text-[10px] text-[#555]">{roleLabels[m?.role ?? ''] ?? m?.role} • {m?.active ? 'Ativo' : 'Inativo'}</p>
              </div>
            </div>
            <label className="mb-4 block text-[10px] uppercase tracking-wider text-[#555]">
              Cargo
              <select value={m?.role ?? ''} onChange={(e) => changeRole(m.id, e.target.value)} className="mt-1 w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-xs text-white outline-none focus:border-[#666]">
                <option value="">Sem cargo</option>
                <option value="ceo">CEO</option>
                <option value="marketing">Marketing</option>
                <option value="negociador">Negociador</option>
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Vendas', v: m?.salesCount ?? 0, icon: ShoppingCart },
                { l: 'Leads', v: m?.leadsCount ?? 0, icon: UserPlus },
                { l: 'Projetos', v: m?.projectsCount ?? 0, icon: FolderKanban },
                { l: 'Comissão', v: `R$ ${(m?.totalCommission ?? 0).toLocaleString('pt-BR')}`, icon: DollarSign },
              ].map((s: any, j: number) => (
                <div key={j} className="bg-[#0a0a0a] rounded-lg p-3">
                  <s.icon size={12} className="text-[#555] mb-1" />
                  <p className="text-sm font-bold text-white">{s?.v}</p>
                  <p className="text-[9px] text-[#555]">{s?.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
