import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function ContatosPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any)?.role !== 'marketing' && (session.user as any)?.role !== 'ceo') redirect('/dashboard')

  const contacts = [
    { name: 'Lucas Ferreira', email: 'lucas@lfarq.com', phone: '(11) 98877-6655', origin: 'Instagram' },
    { name: 'Camila Ribeiro', email: 'camila@belissima.com', phone: '(21) 97766-5544', origin: 'Google' },
    { name: 'Patrícia Lima', email: 'patricia@petshoppl.com', phone: '(41) 96655-4433', origin: 'Site' },
    { name: 'Amanda Gomes', email: 'amanda@floriculturaag.com', phone: '(31) 95544-3322', origin: 'Instagram' },
    { name: 'Larissa Mendes', email: 'larissa@lmestetica.com', phone: '(51) 94433-2211', origin: 'Instagram' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-display font-bold text-white">Contatos</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {['Nome', 'E-mail', 'Telefone', 'Origem'].map(h => (
                <th key={h} className="text-left text-[10px] text-[#555] uppercase tracking-wider py-3 px-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((c, i) => (
              <tr key={i} className="border-b border-[#111] hover:bg-white/[0.02]">
                <td className="py-3 px-3 text-sm text-white">{c.name}</td>
                <td className="py-3 px-3 text-xs text-[#888]">{c.email}</td>
                <td className="py-3 px-3 text-xs text-[#666] font-mono">{c.phone}</td>
                <td className="py-3 px-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#888]">{c.origin}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
