import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function PropostasPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any)?.role !== 'negociador' && (session.user as any)?.role !== 'ceo') redirect('/dashboard')

  const proposals = [
    { client: 'FM Imóveis', service: 'Site + CRM', value: 4500, status: 'Enviada', date: '26/08/2025' },
    { client: 'IR Consultoria', service: 'Landing Page + Tráfego', value: 3200, status: 'Enviada', date: '24/08/2025' },
    { client: 'GN Transportes', service: 'Sistema Web', value: 6000, status: 'Em elaboração', date: '28/08/2025' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-display font-bold text-white">Propostas</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {['Cliente', 'Serviço', 'Valor', 'Status', 'Data'].map(h => (
                <th key={h} className="text-left text-[10px] text-[#555] uppercase tracking-wider py-3 px-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proposals.map((p, i) => (
              <tr key={i} className="border-b border-[#111] hover:bg-white/[0.02]">
                <td className="py-3 px-3 text-sm text-white">{p.client}</td>
                <td className="py-3 px-3 text-xs text-[#888]">{p.service}</td>
                <td className="py-3 px-3 text-xs text-white font-mono">R$ {p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="py-3 px-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#888]">{p.status}</span></td>
                <td className="py-3 px-3 text-xs text-[#666] font-mono">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
