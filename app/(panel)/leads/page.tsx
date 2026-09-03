import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { LeadsClient } from './leads-client'

export default async function LeadsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return <LeadsClient />
}
