import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { PanelLayoutClient } from '@/components/dashboard/panel-layout-client'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <PanelLayoutClient
      userName={session.user.name ?? 'Usuário'}
      role={(session.user as any).role ?? 'negociador'}
    >
      {children}
    </PanelLayoutClient>
  )
}
