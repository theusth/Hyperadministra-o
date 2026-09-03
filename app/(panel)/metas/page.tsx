import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { GoalsClient } from './goals-client'

export default async function MetasPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return <GoalsClient />
}
