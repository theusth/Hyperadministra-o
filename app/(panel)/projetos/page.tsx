import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ProjectsClient } from './projects-client'

export default async function ProjetosPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return <ProjectsClient />
}
