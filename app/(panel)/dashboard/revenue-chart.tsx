'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function RevenueChart({ data }: { data: Array<{ month: string; value: number }> }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data ?? []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="whiteGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 10, fill: '#555' }} axisLine={false} />
          <YAxis tickLine={false} tick={{ fontSize: 10, fill: '#444' }} axisLine={false} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
          <Tooltip
            contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: '8px', fontSize: 11, color: '#fff' }}
            labelStyle={{ color: '#888' }}
          />
          <Area type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={1.5} fill="url(#whiteGrad)" dot={false} activeDot={{ r: 3, fill: '#fff', stroke: '#333' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
