'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FolderKanban, Clock } from 'lucide-react'

const stageOrder = ['briefing', 'design', 'desenvolvimento', 'revisao', 'aprovacao', 'publicado']
const stageLabels: Record<string, string> = {
  briefing: 'Briefing', design: 'Design', desenvolvimento: 'Desenvolvimento',
  revisao: 'Revisão', aprovacao: 'Aprovação', publicado: 'Publicado',
}

export function ProjectsClient() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(d => { setProjects(d ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="grid grid-cols-6 gap-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 bg-[#111] rounded-xl animate-pulse" />)}</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-white">Projetos</h1>
        <p className="text-sm text-[#555] mt-1">{projects?.length ?? 0} projetos</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
        {stageOrder.map(stage => {
          const stageProjects = (projects ?? []).filter((p: any) => p?.stage === stage)
          return (
            <div key={stage} className="min-w-[200px] w-[200px] shrink-0">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] text-[#666] uppercase tracking-wider font-medium">{stageLabels[stage] ?? stage}</span>
                <span className="text-[10px] text-[#444] font-mono">{stageProjects?.length ?? 0}</span>
              </div>
              <div className="space-y-2 min-h-[200px] bg-[#0a0a0a] border border-[#141414] rounded-xl p-2">
                {(stageProjects ?? []).map((p: any, i: number) => (
                  <motion.div key={p?.id ?? i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-3 hover:border-[#2a2a2a] transition-all">
                    <p className="text-xs font-medium text-white mb-1">{p?.name ?? '-'}</p>
                    <p className="text-[10px] text-[#555] mb-2">{p?.client?.company ?? '-'}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${p?.progress ?? 0}%` }} transition={{ duration: 0.8 }} className="h-full bg-white/40 rounded-full" />
                      </div>
                      <span className="text-[10px] text-[#888] font-mono">{p?.progress ?? 0}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-[#444]">{p?.responsible?.name ?? '-'}</span>
                      <span className="text-[9px] text-[#444] flex items-center gap-0.5"><Clock size={8} />{p?.deadline ? new Date(p.deadline).toLocaleDateString('pt-BR') : '-'}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
