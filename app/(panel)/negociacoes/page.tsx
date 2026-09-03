import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function NegociacoesPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any)?.role !== 'negociador' && (session.user as any)?.role !== 'ceo') redirect('/dashboard')

  const negotiations = [
    { client: 'GN Transportes', value: 6000, stage: 'Negociação', updated: '28/08/2025' },
    { client: 'FM Imóveis', value: 4500, stage: 'Proposta enviada', updated: '26/08/2025' },
    { client: 'IR Consultoria', value: 3200, stage: 'Proposta enviada', updated: '24/08/2025' },
    { client: 'RD Engenharia', value: 5000, stage: 'Em contato', updated: '22/08/2025' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-display font-bold text-white">Negociações</h1>
      <p className="text-sm text-[#555]">Acompanhe suas negociações em andamento</p>
      <div className="space-y-3">
        {negotiations.map((n, i) => (
          <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#2a2a2a] transition-all flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{n.client}</p>
              <p className="text-xs text-[#555] mt-1">{n.stage} • Atualizado em {n.updated}</p>
            </div>
            <span className="text-sm font-bold text-white font-mono">R$ {n.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
