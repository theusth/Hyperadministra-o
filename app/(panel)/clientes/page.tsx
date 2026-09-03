import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ClientsClient } from './clients-client'

export default async function ClientesPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any)?.role !== 'ceo') redirect('/dashboard')
  return <ClientsClient />
}
