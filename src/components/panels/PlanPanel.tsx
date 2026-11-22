import PanelHeader from './PanelHeader'
import { messages } from '../../i18n'
import { DATA_TERM, TERMS } from '../../constants'
import { getDashboardText } from '../../i18n/dashboard'
import type { PlanSource } from '../../services/planner'
import type { Plan, PlanRow, Tab, ViewLang } from '../../types'

interface Props {
  lang: ViewLang
  plan: Plan | null
  source: PlanSource | null
  tab: Tab
  onTab: (tab: Tab) => void
  updated: boolean
  onClose: () => void
}

// 같은 시기(when)끼리 묶어서 타임라인으로 보여줘요
function groupByWhen(rows: PlanRow[]) {
  return rows.reduce<{ when: string; rows: PlanRow[] }[]>((acc, r) => {
    const last = acc[acc.length - 1]
    if (last && last.when === r.when) last.rows.push(r)
    else acc.push({ when: r.when, rows: [r] })
    return acc
  }, [])
}

export default function PlanPanel({ lang, plan, source, tab, onTab, updated, onClose }: Props) {
  const L = messages[lang].planner
  const D = getDashboardText(lang)
  const rows = plan ? (tab === 'this' ? plan.thisSemester : plan.nextSemester) : []
  const groups = groupByWhen(rows)

  const tabClass = (active: boolean) =>
    `min-h-9 cursor-pointer rounded-lg px-2 text-[13px] ${active ? 'bg-brand font-bold text-white' : 'text-gray-500 hover:text-gray-800'}`

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PanelHeader title={D.planTitle} closeLabel={D.close} onClose={onClose}>
        {plan && source === 'fallback' && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">{L.sample}</span>}
        {updated && <span className="rounded-full bg-[#E7F6EC] px-2.5 py-1 text-xs font-medium text-[#146C2E]">{L.updated}</span>}
      </PanelHeader>

      <div className="shrink-0 px-6">
        <div className="grid grid-cols-2 gap-1 rounded-[10px] bg-surface p-1">
          <button type="button" aria-pressed={tab === 'this'} onClick={() => onTab('this')} className={tabClass(tab === 'this')}>
            {L.tabThis(TERMS.current)}
          </button>
          <button type="button" aria-pressed={tab === 'next'} onClick={() => onTab('next')} className={tabClass(tab === 'next')}>
            {L.tabNext(TERMS.next)}
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {!plan ? (
          <div role="status" className="flex flex-col gap-3">
            <p className="text-sm text-gray-500">{L.loading}</p>
            {[0, 1, 2].map((i) => (
              <div key={i} aria-hidden="true" className="flex flex-col gap-2.5 rounded-xl border border-line p-4 motion-safe:animate-pulse">
                <span className="h-4 w-24 rounded bg-gray-200" />
                <span className="h-4 w-full rounded bg-gray-200" />
                <span className="h-3 w-2/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {tab === 'this' && plan.mustDos.length > 0 && (
              <section aria-label={L.must} className="mb-6 rounded-xl bg-brand-soft p-4">
                <h3 className="text-[13px] font-bold text-brand">{L.must}</h3>
                <ol className="mt-2 flex list-decimal flex-col gap-1 pl-5 text-sm leading-relaxed">
                  {plan.mustDos.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ol>
              </section>
            )}

            <ol
              aria-label={L.plan}
              className="relative flex flex-col gap-6 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-0.5 before:bg-line"
            >
              {groups.map((g, gi) => (
                <li key={gi} className="relative flex flex-col gap-2.5 pl-7">
                  <span aria-hidden="true" className="absolute left-0 top-[3px] h-3 w-3 rounded-full bg-brand" />
                  <p className="text-[13px] font-bold text-brand">{g.when}</p>
                  {g.rows.map((r, ri) => (
                    <div key={ri} className="rounded-xl border border-line bg-white p-4">
                      <p className="text-[15px] font-semibold leading-relaxed text-ink">{r.what}</p>
                      <p className="mt-2 text-xs leading-relaxed text-gray-500">
                        {r.source} · <span className="font-medium text-brand">{r.office}</span>
                      </p>
                    </div>
                  ))}
                </li>
              ))}
            </ol>

            {plan.needsConfirmation.length > 0 && (
              <section aria-label={L.confirm} className="mt-6 rounded-xl border border-[#F5C99B] bg-[#FFF8F0] p-4">
                <h3 className="text-sm font-bold text-[#7A3305]">{L.confirm}</h3>
                <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-[13px] leading-relaxed text-[#5C2804]">
                  {plan.needsConfirmation.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </section>
            )}

            <p className="mt-6 text-xs leading-relaxed text-gray-400">{L.footer(DATA_TERM)}</p>
          </>
        )}
      </div>
    </div>
  )
}