import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { TeamClient } from './team-client'

export default async function EquipePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any)?.role !== 'ceo') redirect('/dashboard')
  return <TeamClient />
}
