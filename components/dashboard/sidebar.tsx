'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { getMenuForRole } from '@/lib/permissions'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, UserPlus, ShoppingCart, DollarSign,
  FolderKanban, UsersRound, Target, BarChart3, Percent,
  Megaphone, Contact, TrendingUp, Handshake, FileText,
  LogOut, User, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const iconMap: Record<string, any> = {
  LayoutDashboard, Users, UserPlus, ShoppingCart, DollarSign,
  FolderKanban, UsersRound, Target, BarChart3, Percent,
  Megaphone, Contact, TrendingUp, Handshake, FileText,
}

interface SidebarProps {
  role: string
  userName: string
  open: boolean
  onClose: () => void
}

export function Sidebar({ role, userName, open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const menu = getMenuForRole(role)

  const content = (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-r border-[#1a1a1a]">
      {/* Logo */}
      <div className="px-5 py-6 flex items-center justify-between">
        <Link href="/dashboard" className="group">
          <h1 className="font-display text-xl font-bold text-white tracking-tight">HYPER</h1>
          <p className="text-[10px] tracking-[0.25em] text-[#555] uppercase -mt-0.5">Studio</p>
        </Link>
        <button onClick={onClose} className="lg:hidden text-[#555] hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="w-full h-[1px] bg-[#1a1a1a]" />

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
        {menu?.map((item: any) => {
          const Icon = iconMap[item?.icon] || LayoutDashboard
          const isActive = pathname === item?.href
          return (
            <Link
              key={item?.href}
              href={item?.href ?? '/dashboard'}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-[#777] hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={17} strokeWidth={isActive ? 2 : 1.5} />
              <span className="font-medium">{item?.label}</span>
            </Link>
          )
        }) ?? []}
      </nav>

      <div className="w-full h-[1px] bg-[#1a1a1a]" />

      {/* Footer */}
      <div className="px-3 py-4 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#666]">
          <User size={17} strokeWidth={1.5} />
          <span>{userName ?? 'Usuário'}</span>
        </div>
        <button
          onClick={() => signOut({ redirectTo: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#555] hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
        >
          <LogOut size={17} strokeWidth={1.5} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-40 w-[220px]">
        {content}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[220px] lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
