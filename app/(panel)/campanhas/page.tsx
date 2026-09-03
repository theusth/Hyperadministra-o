import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function CampanhasPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any)?.role !== 'marketing' && (session.user as any)?.role !== 'ceo') redirect('/dashboard')

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-display font-bold text-white">Campanhas</h1>
      <p className="text-sm text-[#555]">Gerencie suas campanhas de marketing</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {['Instagram Ads — Agosto', 'Google Ads — Landing Pages', 'Programa de Indicação'].map((c, i) => (
          <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#2a2a2a] transition-all">
            <p className="text-sm font-medium text-white mb-2">{c}</p>
            <p className="text-xs text-[#555]">{[8, 5, 3][i]} leads gerados</p>
            <div className="mt-3 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div className="h-full bg-white/30 rounded-full" style={{ width: `${[80, 50, 30][i]}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
