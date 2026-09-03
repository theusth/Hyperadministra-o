import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { SalesClient } from './sales-client'

export default async function VendasPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  const role = (session.user as any)?.role ?? 'negociador'
  if (role === 'marketing') redirect('/dashboard')
  return <SalesClient />
}
