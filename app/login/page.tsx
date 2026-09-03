'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        setError('E-mail ou senha inválidos')
      } else {
        router.replace('/dashboard')
      }
    } catch {
      setError('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] relative overflow-hidden">
      {/* Subtle bg glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[420px] mx-4"
      >
        <div className="glass-card rounded-2xl p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl font-bold tracking-tight text-white">
              HYPER
            </h1>
            <p className="text-sm tracking-[0.3em] text-[#666] mt-1 uppercase">Studio</p>
            <div className="w-8 h-[1px] bg-[#333] mx-auto mt-4" />
            <p className="text-xs text-[#555] mt-3 tracking-wider uppercase">Painel Administrativo</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-[#888] mb-2 uppercase tracking-wider">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-[#0f0f0f] border border-[#222] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#444] transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-2 uppercase tracking-wider">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0f0f0f] border border-[#222] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#444] transition-colors duration-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[#333] bg-[#111] accent-white"
                />
                <span className="text-xs text-[#666]">Lembrar de mim</span>
              </label>
              <button type="button" className="text-xs text-[#555] hover:text-white transition-colors">
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-[#e0e0e0] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#444]">
              Não tem conta?{' '}
              <a href="/signup" className="text-[#888] hover:text-white transition-colors">
                Criar conta
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
