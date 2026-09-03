import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { CommissionsClient } from './commissions-client'

export default async function ComissoesPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  const role = (session.user as any)?.role
  if (role === 'marketing') redirect('/dashboard')
  return <CommissionsClient />
}
