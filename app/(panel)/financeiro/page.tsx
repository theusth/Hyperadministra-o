import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { FinanceClient } from './finance-client'

export default async function FinanceiroPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any)?.role !== 'ceo') redirect('/dashboard')
  return <FinanceClient />
}
