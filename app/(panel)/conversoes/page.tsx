import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function ConversoesPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any)?.role !== 'marketing' && (session.user as any)?.role !== 'ceo') redirect('/dashboard')

  const conversions = [
    { lead: 'Daniel Oliveira', company: 'DO Restaurante', value: 1500, date: '25/07/2025' },
    { lead: 'Vanessa Alves', company: 'VA Moda', value: 2500, date: '22/07/2025' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-display font-bold text-white">Conversões</h1>
      <p className="text-sm text-[#555]">Leads que se tornaram clientes</p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {['Lead', 'Empresa', 'Valor', 'Data'].map(h => (
                <th key={h} className="text-left text-[10px] text-[#555] uppercase tracking-wider py-3 px-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {conversions.map((c, i) => (
              <tr key={i} className="border-b border-[#111] hover:bg-white/[0.02]">
                <td className="py-3 px-3 text-sm text-white">{c.lead}</td>
                <td className="py-3 px-3 text-xs text-[#888]">{c.company}</td>
                <td className="py-3 px-3 text-xs text-white font-mono">R$ {c.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="py-3 px-3 text-xs text-[#666] font-mono">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
