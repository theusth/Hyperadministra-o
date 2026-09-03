export type UserRole = 'ceo' | 'marketing' | 'negociador'

export interface NavItem {
  label: string
  href: string
  icon: string
}

const ceoMenu: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Clientes', href: '/clientes', icon: 'Users' },
  { label: 'Leads', href: '/leads', icon: 'UserPlus' },
  { label: 'Vendas', href: '/vendas', icon: 'ShoppingCart' },
  { label: 'Financeiro', href: '/financeiro', icon: 'DollarSign' },
  { label: 'Projetos', href: '/projetos', icon: 'FolderKanban' },
  { label: 'Equipe', href: '/equipe', icon: 'UsersRound' },
  { label: 'Metas', href: '/metas', icon: 'Target' },
  { label: 'Relatórios', href: '/relatorios', icon: 'BarChart3' },
  { label: 'Comissões', href: '/comissoes', icon: 'Percent' },
]

const marketingMenu: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Leads', href: '/leads', icon: 'UserPlus' },
  { label: 'Campanhas', href: '/campanhas', icon: 'Megaphone' },
  { label: 'Contatos', href: '/contatos', icon: 'Contact' },
  { label: 'Conversões', href: '/conversoes', icon: 'TrendingUp' },
]

const negociadorMenu: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Leads', href: '/leads', icon: 'UserPlus' },
  { label: 'Negociações', href: '/negociacoes', icon: 'Handshake' },
  { label: 'Propostas', href: '/propostas', icon: 'FileText' },
  { label: 'Vendas', href: '/vendas', icon: 'ShoppingCart' },
  { label: 'Comissões', href: '/comissoes', icon: 'Percent' },
]

export function getMenuForRole(role: string): NavItem[] {
  switch (role) {
    case 'ceo': return ceoMenu
    case 'marketing': return marketingMenu
    case 'negociador': return negociadorMenu
    default: return []
  }
}

export function canAccessRoute(role: string, path: string): boolean {
  const menu = getMenuForRole(role)
  if (role === 'ceo') return true
  return menu.some((item: NavItem) => path.startsWith(item.href))
}
