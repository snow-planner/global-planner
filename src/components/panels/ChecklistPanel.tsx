import { useState } from 'react'
import { Link } from 'react-router-dom'
import PanelHeader from './PanelHeader'
import { messages } from '../../i18n'
import { getDashboardText } from '../../i18n/dashboard'
import { ROUTES } from '../../constants'
import type { ChecklistItem, ViewLang } from '../../types'

type Filter = 'all' | ChecklistItem['category']
const FILTERS: Filter[] = ['all', 'stay', 'academics', 'scholarship']

interface Props {
  lang: ViewLang
  ready: boolean
  items: ChecklistItem[]
  done: Record<string, boolean>
  onToggle: (id: string) => void
  askedId: string | null // 지금 채팅에서 물어본 항목 (강조 표시)
  onAsk: (item: ChecklistItem) => void
  onClose: () => void
}

export default function ChecklistPanel({ lang, ready, items, done, onToggle, askedId, onAsk, onClose }: Props) {
  const T = messages[lang].checklist
  const D = getDashboardText(lang)
  const [filter, setFilter] = useState<Filter>('all')

  const doneCount = items.filter((i) => done[i.id]).length
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0
  const shown = filter === 'all' ? items : items.filter((i) => i.category === filter)
  const showScholarshipNote = (filter === 'all' || filter === 'scholarship') && shown.some((i) => i.category === 'scholarship')

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PanelHeader title={D.checklistTitle} closeLabel={D.close} onClose={onClose} />

      <div className="flex shrink-0 flex-col gap-2 px-6">
        <div className="flex items-baseline justify-between gap-3 text-[13px]">
          <span className="truncate text-gray-500">{T.saved}</span>
          <span className="shrink-0 font-bold text-brand">
            {doneCount}
            {T.done(items.length)}
          </span>
        </div>
        <div role="img" aria-label={T.progressAria(doneCount, items.length)} className="h-2 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`h-8 cursor-pointer rounded-full px-3.5 text-[13px] ${filter === f ? 'bg-brand-soft font-bold text-brand' : 'text-gray-500 hover:bg-surface'}`}
            >
              {f === 'all' ? D.all : T.groups[f].title}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        {!ready ? (
          <p role="status" className="text-sm text-gray-500">{messages[lang].planner.loading}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {shown.map((it) => {
              const isDone = !!done[it.id]
              const active = askedId === it.id
              return (
                <li key={it.id} className={`rounded-xl border p-4 ${active ? 'border-brand bg-brand-soft ring-1 ring-brand' : 'border-line bg-white'}`}>
                  <div className="flex items-start gap-3">
                    <input
                      id={`check-${it.id}`}
                      type="checkbox"
                      checked={isDone}
                      onChange={() => onToggle(it.id)}
                      className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-brand"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <label htmlFor={`check-${it.id}`} className={`cursor-pointer text-[15px] font-bold leading-snug ${isDone ? 'text-gray-400 line-through' : 'text-ink'}`}>
                        {it.text}
                      </label>
                      {lang !== 'ko' && it.ko && <p className="-mt-1 text-[13px] text-gray-500">{it.ko}</p>}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${active ? 'bg-white text-brand' : 'bg-surface text-gray-500'}`}>
                          {T.groups[it.category].title}
                        </span>
                        <span className={`text-xs ${isDone ? 'text-gray-400' : it.urgent ? 'font-semibold text-alert' : 'text-gray-500'}`}>{it.due}</span>
                        {!isDone && (
                          <button
                            type="button"
                            onClick={() => onAsk(it)}
                            className={`ml-auto h-7 shrink-0 cursor-pointer rounded-full px-3 text-xs font-semibold ${
                              active ? 'bg-brand text-white' : 'border border-brand text-brand hover:bg-brand-soft'
                            }`}
                          >
                            {D.ask}
                          </button>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-gray-400">{it.source}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {ready && showScholarshipNote && (
          <p className="mt-4 rounded-[10px] bg-warn-bg px-3.5 py-3 text-[13px] leading-relaxed text-warn">{T.scholarshipNote}</p>
        )}
      </div>

      <div className="shrink-0 px-6 pb-6">
        <Link to={ROUTES.plan} className="flex h-11 items-center justify-center rounded-[10px] bg-surface text-[13px] font-semibold text-brand hover:bg-brand-soft">
          {D.viewPlan}
        </Link>
      </div>
    </div>
  )
}