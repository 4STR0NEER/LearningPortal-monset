import { useReducedMotion } from 'motion/react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getCourse } from '../../data/courses'
import { course_completion } from '../../data/matrix'

// Recharts draws SVG, and SVG fill/stroke accept var(), so every color here points at a theme
// token in index.css. Series order: sun (main), navy, blue green, sky-600. Yellow bars carry a
// sun-700 outline so their edge clears 3:1 on white. Rebranding the CSS rebrands the charts too, no hex in this file.
const series = [
  { key: 'mastered', label: 'Mastered', color: 'var(--color-sun)', stroke: 'var(--color-sun-700)' },
  { key: 'proficient', label: 'Proficient', color: 'var(--color-navy)' },
  { key: 'developing', label: 'Developing', color: 'var(--color-primary)' },
  { key: 'beginning', label: 'Beginning', color: 'var(--color-sky-600)' },
]

const axisTick = { fill: 'var(--color-muted)', fontSize: 12 }
const tooltip = {
  contentStyle: { borderRadius: 12, border: '1px solid var(--color-line)', boxShadow: 'var(--shadow-card)', fontSize: 13 },
  labelStyle: { color: 'var(--color-navy)', fontWeight: 700 },
  itemStyle: { color: 'var(--color-navy)' },
  cursor: { fill: 'var(--color-sun-50)' },
}

const data = course_completion.map((r) => ({ ...r, name: getCourse(r.course_id).title }))

export default function CompletionCharts() {
  const reduce = useReducedMotion()
  const anim = { isAnimationActive: !reduce, animationDuration: 450, animationEasing: 'ease-out' }
  const height = data.length * 42 + 40

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <figure className="card p-5">
        <figcaption className="mb-4">
          <p className="font-extrabold text-navy">Average completion</p>
          <p className="text-sm text-muted">Share of materials finished per course</p>
        </figcaption>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} stroke="var(--color-sun-100)" />
            <XAxis type="number" domain={[0, 100]} unit="%" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" width={170} tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip {...tooltip} formatter={(v) => [`${v}%`, 'Avg. completion']} />
            <Bar dataKey="avg_completion" fill="var(--color-sun)" stroke="var(--color-sun-700)" radius={[0, 6, 6, 0]} barSize={18} {...anim} />
          </BarChart>
        </ResponsiveContainer>
      </figure>

      <figure className="card p-5">
        <figcaption className="mb-4">
          <p className="font-extrabold text-navy">Mastery breakdown</p>
          <p className="text-sm text-muted">Students per mastery level, by course</p>
        </figcaption>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} stroke="var(--color-sun-100)" />
            <XAxis type="number" allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" width={170} tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip {...tooltip} />
            {/* Series order (not alphabetical), and labels in muted grey: yellow/sky text would fail contrast. */}
            <Legend
              iconType="circle"
              iconSize={8}
              itemSorter={null}
              wrapperStyle={{ fontSize: 13 }}
              formatter={(label) => <span style={{ color: 'var(--color-muted)' }}>{label}</span>}
            />
            {series.map((s) => (
              <Bar key={s.key} dataKey={s.key} name={s.label} stackId="mastery" fill={s.color} stroke={s.stroke} barSize={18} {...anim} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </figure>
    </div>
  )
}
