'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Menu, ChevronDown } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'

interface Notif {
  id: string
  title: string
  message: string
  read: boolean
  type: string
  createdAt: string
}

interface HeaderProps {
  title: string
  userName: string
  role: string
  onMenuClick: () => void
}

export function Header({ title, userName, role, onMenuClick }: HeaderProps) {
  const [showNotifs, setShowNotifs] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [notifications, setNotifications] = useState<Notif[]>([])
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(d => setNotifications(d ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUser(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const unread = notifications?.filter((n: Notif) => !n?.read)?.length ?? 0

  const roleLabel: Record<string, string> = {
    ceo: 'CEO',
    marketing: 'Marketing',
    negociador: 'Negociador',
  }

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 sm:px-6 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1a1a1a]">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-[#666] hover:text-white transition-colors">
          <Menu size={20} />
        </button>
        <h2 className="text-sm font-medium text-white">{title}</h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg text-[#666] hover:text-white hover:bg-white/5 transition-all"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute right-0 top-12 w-80 bg-[#111] border border-[#222] rounded-xl overflow-hidden shadow-2xl"
              >
                <div className="px-4 py-3 border-b border-[#1a1a1a]">
                  <p className="text-sm font-medium text-white">Notificações</p>
                </div>
                <div className="max-h-72 overflow-y-auto scrollbar-none">
                  {(notifications ?? [])?.length === 0 ? (
                    <p className="text-xs text-[#555] p-4 text-center">Nenhuma notificação</p>
                  ) : (
                    (notifications ?? []).map((n: Notif) => (
                      <div key={n?.id} className={`px-4 py-3 border-b border-[#1a1a1a] hover:bg-white/5 transition-colors ${!n?.read ? 'bg-white/[0.02]' : ''}`}>
                        <p className="text-xs font-medium text-white">{n?.title}</p>
                        <p className="text-xs text-[#666] mt-0.5">{n?.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setShowUser(!showUser)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-[#222] flex items-center justify-center text-xs font-semibold text-white">
              {(userName ?? 'U')?.[0]?.toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-white">{userName ?? 'Usuário'}</p>
              <p className="text-[10px] text-[#555]">{roleLabel[role] ?? role}</p>
            </div>
            <ChevronDown size={14} className="text-[#555]" />
          </button>
          <AnimatePresence>
            {showUser && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute right-0 top-12 w-44 bg-[#111] border border-[#222] rounded-xl overflow-hidden shadow-2xl"
              >
                <button
                  onClick={() => signOut({ redirectTo: '/login' })}
                  className="w-full px-4 py-2.5 text-left text-xs text-[#888] hover:text-white hover:bg-white/5 transition-all"
                >
                  Sair
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
