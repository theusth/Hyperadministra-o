import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = (pw: string) => bcrypt.hashSync(pw, 12)

  // Hidden test account
  const testUser = await prisma.user.upsert({
    where: { email: 'abacus-c00e725a@example.com' },
    update: {},
    create: { email: 'abacus-c00e725a@example.com', password: hash('E2*XL8PaTs'), name: 'Admin Test', role: 'ceo' },
  })

  // Demo users
  const ceo = await prisma.user.upsert({
    where: { email: 'ceo@hyperstudio.com' },
    update: {},
    create: { email: 'ceo@hyperstudio.com', password: hash('hyper2024'), name: 'Matheus', role: 'ceo' },
  })
  const mkt = await prisma.user.upsert({
    where: { email: 'marketing@hyperstudio.com' },
    update: {},
    create: { email: 'marketing@hyperstudio.com', password: hash('hyper2024'), name: 'Juliana', role: 'marketing' },
  })
  const neg = await prisma.user.upsert({
    where: { email: 'negociador@hyperstudio.com' },
    update: {},
    create: { email: 'negociador@hyperstudio.com', password: hash('hyper2024'), name: 'Rafael', role: 'negociador' },
  })

  // Clients
  const clients = [
    { name: 'Carlos Mendes', company: 'Hotel Vista Alegre', phone: '(11) 99876-5432', email: 'carlos@vistaalegre.com', service: 'Site Institucional + SEO', value: 3500, status: 'ativo', responsible: ceo.name },
    { name: 'Bruno Silva', company: 'Bruno Barbearia', phone: '(21) 98765-4321', email: 'bruno@barbearia.com', service: 'Landing Page', value: 1200, status: 'ativo', responsible: neg.name },
    { name: 'Ana Oliveira', company: 'Padaria Santo Antônio', phone: '(31) 97654-3210', email: 'ana@padariasa.com', service: 'Cardápio Digital', value: 800, status: 'em_andamento', responsible: ceo.name },
    { name: 'Dr. Ricardo', company: 'Clínica Saúde Total', phone: '(41) 96543-2109', email: 'contato@saudetotal.com', service: 'Sistema de Agendamento', value: 4500, status: 'ativo', responsible: neg.name },
    { name: 'Fernanda Costa', company: 'FC Advocacia', phone: '(51) 95432-1098', email: 'fernanda@fcadv.com', service: 'Site + Blog', value: 2800, status: 'finalizado', responsible: ceo.name },
    { name: 'Pedro Almeida', company: 'Auto Peças PA', phone: '(61) 94321-0987', email: 'pedro@autopecas.com', service: 'E-commerce', value: 6500, status: 'ativo', responsible: neg.name },
    { name: 'Mariana Santos', company: 'Studio Pilates MS', phone: '(71) 93210-9876', email: 'mariana@pilatesms.com', service: 'Landing Page + Tráfego', value: 1500, status: 'em_andamento', responsible: mkt.name },
    { name: 'João Victor', company: 'JV Contabilidade', phone: '(81) 92109-8765', email: 'jv@contabilidade.com', service: 'Site Institucional', value: 2200, status: 'pendente', responsible: neg.name },
  ]
  const clientRecords = []
  for (const c of clients) {
    const rec = await prisma.client.upsert({
      where: { id: c.company.replace(/\s/g, '-').toLowerCase() },
      update: {},
      create: { id: c.company.replace(/\s/g, '-').toLowerCase(), ...c },
    })
    clientRecords.push(rec)
  }

  // Leads
  const stages = ['novo', 'contato', 'interesse', 'proposta', 'negociacao', 'fechado', 'perdido']
  const origins = ['Instagram', 'Google', 'Indicação', 'Site', 'WhatsApp', 'LinkedIn']
  const leadData = [
    { name: 'Lucas Ferreira', company: 'LF Arquitetura', value: 3000, stage: 'novo', origin: 'Instagram', responsibleId: neg.id },
    { name: 'Camila Ribeiro', company: 'Salão Belíssima', value: 1500, stage: 'novo', origin: 'Google', responsibleId: mkt.id },
    { name: 'Roberto Dias', company: 'RD Engenharia', value: 5000, stage: 'contato', origin: 'Indicação', responsibleId: neg.id },
    { name: 'Patrícia Lima', company: 'Pet Shop PL', value: 1800, stage: 'contato', origin: 'Site', responsibleId: mkt.id },
    { name: 'Thiago Souza', company: 'TS Mecânica', value: 2200, stage: 'interesse', origin: 'WhatsApp', responsibleId: neg.id },
    { name: 'Amanda Gomes', company: 'Floricultura AG', value: 900, stage: 'interesse', origin: 'Instagram', responsibleId: mkt.id },
    { name: 'Felipe Martins', company: 'FM Imóveis', value: 4500, stage: 'proposta', origin: 'LinkedIn', responsibleId: neg.id },
    { name: 'Isabela Rocha', company: 'IR Consultoria', value: 3200, stage: 'proposta', origin: 'Indicação', responsibleId: neg.id },
    { name: 'Gustavo Nunes', company: 'GN Transportes', value: 6000, stage: 'negociacao', origin: 'Google', responsibleId: neg.id },
    { name: 'Larissa Mendes', company: 'LM Estética', value: 2000, stage: 'negociacao', origin: 'Instagram', responsibleId: mkt.id },
    { name: 'Daniel Oliveira', company: 'DO Restaurante', value: 1500, stage: 'fechado', origin: 'Site', responsibleId: neg.id },
    { name: 'Vanessa Alves', company: 'VA Moda', value: 2500, stage: 'fechado', origin: 'Instagram', responsibleId: mkt.id },
    { name: 'Marcos Paulo', company: 'MP Academia', value: 3500, stage: 'perdido', origin: 'WhatsApp', responsibleId: neg.id },
    { name: 'Renata Castro', company: 'RC Papelaria', value: 800, stage: 'perdido', origin: 'Google', responsibleId: mkt.id },
  ]
  for (const l of leadData) {
    await prisma.lead.upsert({
      where: { id: l.name.replace(/\s/g, '-').toLowerCase() },
      update: {},
      create: { id: l.name.replace(/\s/g, '-').toLowerCase(), ...l, lastContact: new Date(Date.now() - Math.random() * 7 * 86400000) },
    })
  }

  // Sales
  const salesData = [
    { clientId: clientRecords[0]!.id, service: 'Site Institucional + SEO', value: 3500, negotiatorId: neg.id, status: 'concluida' },
    { clientId: clientRecords[1]!.id, service: 'Landing Page', value: 1200, negotiatorId: neg.id, status: 'concluida' },
    { clientId: clientRecords[3]!.id, service: 'Sistema de Agendamento', value: 4500, negotiatorId: neg.id, status: 'concluida' },
    { clientId: clientRecords[4]!.id, service: 'Site + Blog', value: 2800, negotiatorId: neg.id, status: 'concluida' },
    { clientId: clientRecords[5]!.id, service: 'E-commerce', value: 6500, negotiatorId: neg.id, status: 'em_andamento' },
    { clientId: clientRecords[6]!.id, service: 'Landing Page + Tráfego', value: 1500, negotiatorId: neg.id, status: 'concluida' },
    { clientId: clientRecords[2]!.id, service: 'Cardápio Digital', value: 800, negotiatorId: neg.id, status: 'em_andamento' },
    { clientId: clientRecords[7]!.id, service: 'Site Institucional', value: 2200, negotiatorId: neg.id, status: 'pendente' },
  ]
  const saleRecords = []
  for (let i = 0; i < salesData.length; i++) {
    const s = salesData[i]!
    const rec = await prisma.sale.upsert({
      where: { id: `sale-${i + 1}` },
      update: {},
      create: { id: `sale-${i + 1}`, ...s, createdAt: new Date(2025, 6 + Math.floor(i / 3), 1 + i * 3) },
    })
    saleRecords.push(rec)
  }

  // Commissions
  for (let i = 0; i < saleRecords.length; i++) {
    const sale = saleRecords[i]!
    await prisma.commission.upsert({
      where: { id: `com-${i + 1}` },
      update: {},
      create: { id: `com-${i + 1}`, userId: neg.id, saleId: sale.id, percentage: 20, value: sale.value * 0.2, status: i < 4 ? 'pago' : 'pendente' },
    })
  }

  // Projects
  const projectData = [
    { name: 'Site Hotel Vista Alegre', clientId: clientRecords[0]!.id, service: 'Site Institucional + SEO', responsibleId: ceo.id, stage: 'desenvolvimento', progress: 72, value: 3500, deadline: new Date(2025, 8, 15) },
    { name: 'LP Bruno Barbearia', clientId: clientRecords[1]!.id, service: 'Landing Page', responsibleId: neg.id, stage: 'aprovacao', progress: 91, value: 1200, deadline: new Date(2025, 7, 30) },
    { name: 'Cardápio Padaria SA', clientId: clientRecords[2]!.id, service: 'Cardápio Digital', responsibleId: ceo.id, stage: 'briefing', progress: 28, value: 800, deadline: new Date(2025, 9, 10) },
    { name: 'Sistema Clínica Saúde Total', clientId: clientRecords[3]!.id, service: 'Sistema de Agendamento', responsibleId: neg.id, stage: 'design', progress: 55, value: 4500, deadline: new Date(2025, 8, 20) },
    { name: 'Site FC Advocacia', clientId: clientRecords[4]!.id, service: 'Site + Blog', responsibleId: ceo.id, stage: 'publicado', progress: 100, value: 2800, deadline: new Date(2025, 6, 15) },
    { name: 'E-commerce Auto Peças', clientId: clientRecords[5]!.id, service: 'E-commerce', responsibleId: neg.id, stage: 'desenvolvimento', progress: 45, value: 6500, deadline: new Date(2025, 9, 30) },
    { name: 'LP Studio Pilates', clientId: clientRecords[6]!.id, service: 'Landing Page + Tráfego', responsibleId: mkt.id, stage: 'revisao', progress: 85, value: 1500, deadline: new Date(2025, 8, 5) },
    { name: 'Site JV Contabilidade', clientId: clientRecords[7]!.id, service: 'Site Institucional', responsibleId: neg.id, stage: 'briefing', progress: 10, value: 2200, deadline: new Date(2025, 10, 1) },
  ]
  for (let i = 0; i < projectData.length; i++) {
    await prisma.project.upsert({
      where: { id: `proj-${i + 1}` },
      update: {},
      create: { id: `proj-${i + 1}`, ...projectData[i]! },
    })
  }

  // Financial Transactions
  const transactions = [
    { date: new Date(2025, 7, 1), description: 'Venda - Hotel Vista Alegre', category: 'Venda', income: 3500, expense: 0, status: 'concluido' },
    { date: new Date(2025, 7, 3), description: 'Comissão Rafael - Hotel VA', category: 'Comissão', income: 0, expense: 700, status: 'concluido' },
    { date: new Date(2025, 7, 5), description: 'Venda - Bruno Barbearia', category: 'Venda', income: 1200, expense: 0, status: 'concluido' },
    { date: new Date(2025, 7, 7), description: 'Hospedagem servidores', category: 'Hospedagem', income: 0, expense: 280, status: 'concluido' },
    { date: new Date(2025, 7, 10), description: 'Venda - Clínica Saúde Total', category: 'Venda', income: 4500, expense: 0, status: 'concluido' },
    { date: new Date(2025, 7, 12), description: 'Domínio clientes', category: 'Domínio', income: 0, expense: 150, status: 'concluido' },
    { date: new Date(2025, 7, 15), description: 'Venda - FC Advocacia', category: 'Venda', income: 2800, expense: 0, status: 'concluido' },
    { date: new Date(2025, 7, 18), description: 'Ferramentas SaaS', category: 'Ferramentas', income: 0, expense: 450, status: 'concluido' },
    { date: new Date(2025, 7, 20), description: 'Venda - LP Studio Pilates', category: 'Venda', income: 1500, expense: 0, status: 'pendente' },
    { date: new Date(2025, 7, 22), description: 'Comissão Rafael - Clínica', category: 'Comissão', income: 0, expense: 900, status: 'pendente' },
    { date: new Date(2025, 7, 25), description: 'Venda - Cardápio Padaria SA', category: 'Venda', income: 800, expense: 0, status: 'pendente' },
    { date: new Date(2025, 7, 28), description: 'Internet e infraestrutura', category: 'Outros', income: 0, expense: 320, status: 'concluido' },
  ]
  for (let i = 0; i < transactions.length; i++) {
    await prisma.financialTransaction.upsert({
      where: { id: `tx-${i + 1}` },
      update: {},
      create: { id: `tx-${i + 1}`, ...transactions[i]! },
    })
  }

  // Goals
  const goals = [
    { name: 'Faturamento Mensal', target: 20000, current: 12480, unit: 'R$', period: 'mensal' },
    { name: 'Vendas do Mês', target: 30, current: 18, unit: 'vendas', period: 'mensal' },
    { name: 'Leads Gerados', target: 50, current: 44, unit: 'leads', period: 'mensal' },
    { name: 'Novos Clientes', target: 10, current: 7, unit: 'clientes', period: 'mensal' },
  ]
  for (let i = 0; i < goals.length; i++) {
    await prisma.goal.upsert({
      where: { id: `goal-${i + 1}` },
      update: {},
      create: { id: `goal-${i + 1}`, ...goals[i]! },
    })
  }

  // Notifications
  const notifications = [
    { userId: ceo.id, title: 'Nova venda fechada', message: 'Rafael fechou venda com Hotel Vista Alegre - R$ 3.500', type: 'venda' },
    { userId: ceo.id, title: 'Novo lead recebido', message: 'Lucas Ferreira via Instagram - LF Arquitetura', type: 'lead' },
    { userId: ceo.id, title: 'Projeto próximo do prazo', message: 'LP Bruno Barbearia - prazo em 3 dias', type: 'projeto' },
    { userId: ceo.id, title: 'Pagamento recebido', message: 'FC Advocacia - R$ 2.800 confirmado', type: 'financeiro' },
    { userId: neg.id, title: 'Novo lead atribuído', message: 'Roberto Dias - RD Engenharia - R$ 5.000', type: 'lead' },
    { userId: neg.id, title: 'Comissão paga', message: 'Comissão de R$ 700 - Hotel Vista Alegre', type: 'financeiro' },
    { userId: mkt.id, title: 'Lead convertido', message: 'Vanessa Alves - VA Moda converteu para venda', type: 'lead' },
    { userId: mkt.id, title: 'Nova campanha performando', message: 'Campanha Instagram gerou 8 leads essa semana', type: 'marketing' },
  ]
  for (let i = 0; i < notifications.length; i++) {
    await prisma.notification.upsert({
      where: { id: `notif-${i + 1}` },
      update: {},
      create: { id: `notif-${i + 1}`, ...notifications[i]! },
    })
  }

  console.log('Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
