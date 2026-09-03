'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Erro ao criar conta')
        return
      }
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        router.push('/login')
      } else {
        router.replace('/dashboard')
      }
    } catch {
      setError('Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[120px]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[420px] mx-4"
      >
        <div className="glass-card rounded-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl font-bold tracking-tight text-white">HYPER</h1>
            <p className="text-sm tracking-[0.3em] text-[#666] mt-1 uppercase">Studio</p>
            <div className="w-8 h-[1px] bg-[#333] mx-auto mt-4" />
            <p className="text-xs text-[#555] mt-3 tracking-wider uppercase">Criar Conta</p>
          </div>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-[#888] mb-2 uppercase tracking-wider">Nome</label>
              <input type="text" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="Seu nome" required className="w-full bg-[#0f0f0f] border border-[#222] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#444] transition-colors duration-200" />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-2 uppercase tracking-wider">E-mail</label>
              <input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="seu@email.com" required className="w-full bg-[#0f0f0f] border border-[#222] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#444] transition-colors duration-200" />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-2 uppercase tracking-wider">Senha</label>
              <input type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full bg-[#0f0f0f] border border-[#222] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#444] transition-colors duration-200" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-white text-black font-semibold py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-[#e0e0e0] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Criar Conta
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-xs text-[#444]">Já tem conta? <a href="/login" className="text-[#888] hover:text-white transition-colors">Fazer login</a></p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
