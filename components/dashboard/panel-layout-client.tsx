'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from './sidebar'
import { Header } from './header'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/clientes': 'Clientes',
  '/leads': 'Leads',
  '/vendas': 'Vendas',
  '/financeiro': 'Financeiro',
  '/projetos': 'Projetos',
  '/equipe': 'Equipe',
  '/metas': 'Metas',
  '/relatorios': 'Relatórios',
  '/comissoes': 'Comissões',
  '/campanhas': 'Campanhas',
  '/contatos': 'Contatos',
  '/conversoes': 'Conversões',
  '/negociacoes': 'Negociações',
  '/propostas': 'Propostas',
}

export function PanelLayoutClient({
  children,
  userName,
  role,
}: {
  children: React.ReactNode
  userName: string
  role: string
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? 'Dashboard'

  return (
    <div className="min-h-screen bg-[#080808]">
      <Sidebar role={role} userName={userName} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-[220px]">
        <Header title={title} userName={userName} role={role} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
