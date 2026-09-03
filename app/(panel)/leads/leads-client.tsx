'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, GripVertical, Instagram, Globe, Users, Linkedin, MessageCircle, Search as SearchIcon } from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Lead {
  id: string
  name: string
  company: string | null
  value: number
  stage: string
  origin: string | null
  responsible?: { name: string } | null
  lastContact: string | null
}

const stages = [
  { id: 'novo', label: 'Novo' },
  { id: 'contato', label: 'Contato' },
  { id: 'interesse', label: 'Interesse' },
  { id: 'proposta', label: 'Proposta' },
  { id: 'negociacao', label: 'Negociação' },
  { id: 'fechado', label: 'Fechado' },
  { id: 'perdido', label: 'Perdido' },
]

const originIcons: Record<string, any> = {
  Instagram, Google: Globe, 'Indicação': Users, Site: Globe, WhatsApp: MessageCircle, LinkedIn: Linkedin,
}

function LeadCard({ lead, overlay }: { lead: Lead; overlay?: boolean }) {
  const OriginIcon = originIcons[lead?.origin ?? ''] ?? Globe
  return (
    <div className={`bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-3 ${overlay ? 'shadow-2xl opacity-90' : 'hover:border-[#2a2a2a]'} transition-all duration-200`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-white truncate">{lead?.name ?? 'Lead'}</p>
        <GripVertical size={12} className="text-[#333] shrink-0" />
      </div>
      <p className="text-[10px] text-[#666] mb-2">{lead?.company ?? '-'}</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white font-mono">R$ {(lead?.value ?? 0).toLocaleString('pt-BR')}</span>
        <div className="flex items-center gap-1">
          <OriginIcon size={10} className="text-[#555]" />
          <span className="text-[9px] text-[#555]">{lead?.origin ?? '-'}</span>
        </div>
      </div>
      {lead?.responsible?.name && (
        <p className="text-[9px] text-[#444] mt-1.5">{lead.responsible.name}</p>
      )}
    </div>
  )
}

function SortableLeadCard({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead?.id ?? '' })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LeadCard lead={lead} />
    </div>
  )
}

export function LeadsClient() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', company: '', value: '', origin: 'Instagram', stage: 'novo' })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    fetch('/api/leads').then(r => r.json()).then(d => { setLeads(d ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event?.active?.id ?? ''))
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event ?? {}
    setActiveId(null)
    if (!over?.id || !active?.id) return
    const overId = String(over.id)
    // Check if dropped over a column
    const targetStage = stages.find(s => s.id === overId)?.id
    if (targetStage) {
      const leadId = String(active.id)
      setLeads(prev => (prev ?? []).map((l: Lead) => l?.id === leadId ? { ...l, stage: targetStage } : l))
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, stage: targetStage }),
      })
    }
  }

  const handleCreate = async () => {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, value: parseFloat(form.value) || 0 }),
    })
    if (res.ok) {
      const newLead = await res.json()
      setLeads(prev => [newLead, ...(prev ?? [])])
      setShowModal(false)
      setForm({ name: '', company: '', value: '', origin: 'Instagram', stage: 'novo' })
    }
  }

  const activeLead = (leads ?? []).find((l: Lead) => l?.id === activeId)

  if (loading) {
    return <div className="grid grid-cols-7 gap-3">{Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-96 bg-[#111] rounded-xl animate-pulse" />)}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-white">Leads</h1>
          <p className="text-sm text-[#555] mt-1">{leads?.length ?? 0} leads no pipeline</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#e0e0e0] transition-colors">
          <Plus size={15} /> Novo Lead
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
          {stages.map(stage => {
            const stageLeads = (leads ?? []).filter((l: Lead) => l?.stage === stage.id)
            return (
              <div key={stage.id} className="min-w-[180px] w-[180px] shrink-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[10px] text-[#666] uppercase tracking-wider font-medium">{stage.label}</span>
                  <span className="text-[10px] text-[#444] font-mono">{stageLeads?.length ?? 0}</span>
                </div>
                <SortableContext id={stage.id} items={(stageLeads ?? []).map((l: Lead) => l?.id ?? '')} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2 min-h-[200px] bg-[#0a0a0a] border border-[#141414] rounded-xl p-2" id={stage.id}>
                    {(stageLeads ?? []).map((lead: Lead) => (
                      <SortableLeadCard key={lead?.id} lead={lead} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            )
          })}
        </div>
        <DragOverlay>{activeLead ? <LeadCard lead={activeLead} overlay /> : null}</DragOverlay>
      </DndContext>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#111] border border-[#222] rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Novo Lead</h3>
                <button onClick={() => setShowModal(false)} className="text-[#555] hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                {[{l:'Nome',k:'name'},{l:'Empresa',k:'company'},{l:'Valor (R$)',k:'value'}].map(f => (
                  <div key={f.k}>
                    <label className="block text-xs text-[#888] mb-1.5 uppercase tracking-wider">{f.l}</label>
                    <input type="text" value={(form as any)[f.k]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [f.k]: e.target.value }))} className="w-full bg-[#0f0f0f] border border-[#222] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#333]" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-[#888] mb-1.5 uppercase tracking-wider">Origem</label>
                  <select value={form.origin} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm(p => ({ ...p, origin: e.target.value }))} className="w-full bg-[#0f0f0f] border border-[#222] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#333]">
                    {['Instagram', 'Google', 'Indicação', 'Site', 'WhatsApp', 'LinkedIn'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-[#222] text-sm text-[#888] hover:text-white transition-all">Cancelar</button>
                <button onClick={handleCreate} className="flex-1 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-[#e0e0e0] transition-all">Salvar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
