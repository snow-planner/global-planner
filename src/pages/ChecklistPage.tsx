import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getChecklist } from '../services/planner'
import { defaultChecklistDone, STORAGE_KEYS } from '../constants'
import type { ChecklistItem } from '../types'

const groups: { id: ChecklistItem['category']; title: string; ko: string; note?: string }[] = [
  { id: 'stay', title: 'Stay', ko: '체류' },
  { id: 'academics', title: 'Academics', ko: '학업' },
  { id: 'scholarship', title: 'Scholarship', ko: '장학', note: 'If you miss the required education, you are excluded from next semester’s scholarship.' },
]

export default function ChecklistPage() {
  const items = getChecklist()
  const [done, setDone] = useLocalStorage<Record<string, boolean>>(STORAGE_KEYS.checklist, defaultChecklistDone)

  const doneCount = items.filter((i) => done[i.id]).length
  const pct = Math.round((doneCount / items.length) * 100)
  const toggle = (id: string) => setDone((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto flex max-w-[1120px] flex-col gap-6 px-6 pb-16 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-brand">Step 3 of 3</p>
            <h1 className="text-[32px] font-bold leading-snug">
              Checklist <span className="text-xl font-normal text-gray-600">체크리스트</span>
            </h1>
            <p className="text-[15px] text-gray-600">Saved on this device only. Nothing is sent to a server.</p>
          </div>
          <div className="flex min-w-[260px] flex-col gap-2">
            <p className="text-[15px]">
              <span className="text-2xl font-bold">{doneCount}</span> of {items.length} done
            </p>
            <div role="img" aria-label={`${doneCount} of ${items.length} tasks done`} className="h-2.5 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full bg-brand transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {groups.map((g) => {
          const groupItems = items.filter((i) => i.category === g.id)
          const groupDone = groupItems.filter((i) => done[i.id]).length
          return (
            <section key={g.id} aria-label={g.title} className="flex flex-col gap-1.5 rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-bold">
                  {g.title} <span className="text-[15px] font-normal text-gray-600">{g.ko}</span>
                </h2>
                <p className="text-sm text-gray-600">{groupDone} / {groupItems.length}</p>
              </div>

              {groupItems.map((it) => {
                const isDone = !!done[it.id]
                return (
                  <label key={it.id} className="flex cursor-pointer items-start gap-3.5 border-t border-gray-100 px-1 py-3.5">
                    <input type="checkbox" checked={isDone} onChange={() => toggle(it.id)} className="mt-0.5 h-[22px] w-[22px] shrink-0 accent-brand" />
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className={`text-base leading-relaxed ${isDone ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {it.text} <span className="text-brand-dark">({it.ko})</span>
                      </span>
                      <span className="text-[13px] leading-relaxed text-gray-600">{it.source}</span>
                    </span>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[13px] font-medium ${it.urgent ? 'bg-[#FFF4E5] text-[#9A3F07]' : 'bg-gray-100 text-gray-700'}`}>
                      {it.due}
                    </span>
                  </label>
                )
              })}

              {g.note && <p className="mt-2 rounded-[10px] bg-[#FFF8F0] px-3.5 py-3 text-sm leading-relaxed text-[#7A3305]">{g.note}</p>}
            </section>
          )
        })}

        <div>
          <Link to="/plan" className="inline-flex min-h-12 items-center rounded-xl border border-gray-300 bg-white px-5 text-[15px] text-gray-700">← Back to plan</Link>
        </div>

        <p className="text-[13px] leading-relaxed text-gray-600">
          Based on 유학생서비스팀 public guidance, 2026-2학기. Please confirm final details with 유학생서비스팀 or the immigration office (출입국·외국인관서).
        </p>
      </main>
    </div>
  )
}