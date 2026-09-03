import Link from 'next/link'
import { ShieldOff } from 'lucide-react'

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808]">
      <div className="text-center">
        <ShieldOff size={48} className="text-[#333] mx-auto mb-4" />
        <h1 className="text-2xl font-display font-bold text-white mb-2">Acesso Negado</h1>
        <p className="text-sm text-[#555] mb-6">Você não tem permissão para acessar esta página.</p>
        <Link href="/dashboard" className="px-6 py-2.5 bg-white text-black rounded-lg text-sm font-semibold hover:bg-[#e0e0e0] transition-colors">
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  )
}
