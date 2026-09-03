'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, X, Phone, Mail, Building2 } from 'lucide-react'

interface Client {
  id: string
  name: string
  company: string
  phone: string | null
  email: string | null
  service: string | null
  value: number
  status: string
  responsible: string | null
  createdAt: string
}

const statusStyles: Record<string, string> = {
  ativo: 'bg-white/10 text-white',
  em_andamento: 'bg-white/5 text-[#aaa]',
  finalizado: 'bg-white/5 text-[#666]',
  pendente: 'bg-white/5 text-[#555]',
}

const statusLabels: Record<string, string> = {
  ativo: 'Ativo', em_andamento: 'Em andamento', finalizado: 'Finalizado', pendente: 'Pendente',
}

export function ClientsClient() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', service: '', value: '', status: 'ativo', responsible: '' })

  useEffect(() => {
    fetch('/api/clients').then(r => r.json()).then(d => { setClients(d ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = (clients ?? []).filter((c: Client) => {
    const matchSearch = (c?.name ?? '').toLowerCase().includes(search.toLowerCase()) || (c?.company ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'todos' || c?.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleCreate = async () => {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, value: parseFloat(form.value) || 0 }),
    })
    if (res.ok) {
      const newClient = await res.json()
      setClients(prev => [newClient, ...(prev ?? [])])
      setShowModal(false)
      setForm({ name: '', company: '', phone: '', email: '', service: '', value: '', status: 'ativo', responsible: '' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white">Clientes</h1>
          <p className="text-sm text-[#555] mt-1">{filtered?.length ?? 0} clientes cadastrados</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#e0e0e0] transition-colors">
          <Plus size={15} /> Novo Cliente
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input type="text" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} placeholder="Buscar por nome ou empresa..." className="w-full bg-[#111] border border-[#1a1a1a] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#333] transition-colors" />
        </div>
        <select value={statusFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)} className="bg-[#111] border border-[#1a1a1a] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#333]">
          <option value="todos">Todos</option>
          <option value="ativo">Ativo</option>
          <option value="em_andamento">Em andamento</option>
          <option value="finalizado">Finalizado</option>
          <option value="pendente">Pendente</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-[#111] rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                {['Cliente', 'Empresa', 'Telefone', 'E-mail', 'Serviço', 'Valor', 'Status', 'Responsável'].map(h => (
                  <th key={h} className="text-left text-[10px] text-[#555] uppercase tracking-wider py-3 px-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(filtered ?? []).map((c: Client, i: number) => (
                <motion.tr key={c?.id ?? i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-[#111] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 text-sm text-white">{c?.name}</td>
                  <td className="py-3 px-3 text-sm text-[#888] flex items-center gap-1.5"><Building2 size={12} />{c?.company}</td>
                  <td className="py-3 px-3 text-xs text-[#666] font-mono">{c?.phone ?? '-'}</td>
                  <td className="py-3 px-3 text-xs text-[#666]">{c?.email ?? '-'}</td>
                  <td className="py-3 px-3 text-xs text-[#888]">{c?.service ?? '-'}</td>
                  <td className="py-3 px-3 text-xs text-white font-mono">R$ {(c?.value ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-3"><span className={`text-[10px] px-2 py-0.5 rounded-full ${statusStyles[c?.status ?? ''] ?? 'bg-white/5 text-[#666]'}`}>{statusLabels[c?.status ?? ''] ?? c?.status}</span></td>
                  <td className="py-3 px-3 text-xs text-[#666]">{c?.responsible ?? '-'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#111] border border-[#222] rounded-xl p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Novo Cliente</h3>
                <button onClick={() => setShowModal(false)} className="text-[#555] hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                {[{l:'Nome',k:'name',t:'text'},{l:'Empresa',k:'company',t:'text'},{l:'Telefone',k:'phone',t:'text'},{l:'E-mail',k:'email',t:'email'},{l:'Serviço',k:'service',t:'text'},{l:'Valor (R$)',k:'value',t:'number'},{l:'Responsável',k:'responsible',t:'text'}].map(f => (
                  <div key={f.k}>
                    <label className="block text-xs text-[#888] mb-1.5 uppercase tracking-wider">{f.l}</label>
                    <input type={f.t} value={(form as any)[f.k]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [f.k]: e.target.value }))} className="w-full bg-[#0f0f0f] border border-[#222] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#333]" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-[#222] text-sm text-[#888] hover:text-white hover:border-[#333] transition-all">Cancelar</button>
                <button onClick={handleCreate} className="flex-1 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-[#e0e0e0] transition-all">Salvar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
