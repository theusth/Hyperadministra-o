import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ReportsClient } from './reports-client'

export default async function RelatoriosPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any)?.role !== 'ceo') redirect('/dashboard')
  return <ReportsClient />
}
