import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import ChatPanel from '../components/ChatPanel'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatDate, getDday } from '../utils/dday'
import { getPlan, SAMPLE_CHECKLIST_KEY, type PlanSource } from '../services/planner'
import { defaultChecklistDone, defaultConditions, STORAGE_KEYS } from '../constants'
import { messages } from '../i18n'
import type { ChatAction, Conditions, Plan, Tab, ViewLang } from '../types'

function conditionChips(c: Conditions, lang: ViewLang): string[] {
  const { common, planner } = messages[lang]
  const C = planner.chips
  return [
    common.year(Number(c.year)),
    c.major,
    c.visa === 'd2' ? C.d2 : c.visa === 'other' ? C.otherVisa : C.visaNotGiven,
    c.topik === '0' ? C.noTopik : common.topik(c.topik),
    c.track === 'korean' ? C.koreanTrack : C.englishTrack,
    c.entry === 'after' ? C.entryAfter : C.entryBefore,
  ]
}

export default function PlannerPage() {
  const [conditions] = useLocalStorage<Conditions>(STORAGE_KEYS.conditions, defaultConditions)
  const [lang, setLang] = useState<ViewLang>(conditions.lang)
  const [tab, setTab] = useState<Tab>('this')
  const [loaded, setLoaded] = useState<{ key: string; plan: Plan; source: PlanSource; checklistKey: string } | null>(null)
  const [updated, setUpdated] = useState(false)
  const planKey = JSON.stringify({ conditions, lang })

  useEffect(() => {
    let alive = true
    getPlan(conditions, lang).then((r) => {
      if (alive) setLoaded({ key: planKey, plan: r.plan, source: r.source, checklistKey: r.checklistKey })
    })
    return () => {
      alive = false
    }
  }, [conditions, lang, planKey])

  // 지금 조건·언어로 받은 계획만 보여주고, 아직 안 왔으면 null → 로딩 문구가 떠요
  const plan = loaded?.key === planKey ? loaded.plan : null
  const source = loaded?.key === planKey ? loaded.source : null
  // 체크 상태는 계획별 키로 읽어요 (ChecklistPage와 같은 키)
  const [done] = useLocalStorage<Record<string, boolean>>(
    loaded?.key === planKey ? loaded.checklistKey : SAMPLE_CHECKLIST_KEY,
    defaultChecklistDone,
  )

  const L = messages[lang].planner
  const chips = conditionChips(conditions, lang)
  const [summary] = useState(() => `${conditionChips(conditions, lang).join(' · ')} — ${L.ask}`)

  const checklist = plan?.checklist ?? []
  const doneCount = checklist.filter((i) => done[i.id]).length
  const pct = checklist.length ? Math.round((doneCount / checklist.length) * 100) : 0

  const showDday = conditions.visa === 'd2' && conditions.visaExpiry
  const dday = showDday ? getDday(conditions.visaExpiry) : null

  const handleAction = (action?: ChatAction) => {
    if (!action) return
    if (action.type === 'setTab') setTab(action.tab)
    if (action.type === 'setLang') setLang(action.lang)
    setUpdated(true)
  }

  const tabClass = (active: boolean) =>
    `min-h-11 cursor-pointer rounded-[9px] px-3.5 text-sm ${active ? 'bg-white font-bold text-gray-900 shadow-[0_0_0_1px_#D1D5DB]' : 'text-gray-600'}`

  const rows = plan ? (tab === 'this' ? plan.thisSemester : plan.nextSemester) : []

  return (
    <div className="min-h-screen">
      <Header lang={lang} />
      <main className="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-6 px-6 pb-16 pt-8 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-brand">{L.step}</p>
              <h1 className="text-[30px] font-bold leading-snug">{L.title}</h1>
              <div className="flex flex-wrap gap-2">
                {chips.map((c) => (
                  <span key={c} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] text-gray-700">{c}</span>
                ))}
              </div>
            </div>
            <Link to="/" className="inline-flex min-h-11 items-center rounded-[10px] border border-gray-300 bg-white px-4 text-sm text-gray-700">{L.edit}</Link>
          </div>

          <section aria-label={L.overview} className="flex flex-col rounded-2xl border border-gray-200 bg-white">
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between">
              {dday ? (
                <div className="flex items-start gap-4">
                  <p className="text-[34px] font-bold leading-none">D-{dday.daysLeft}</p>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-gray-600">{L.visa}</p>
                    <p className="text-[13px] text-gray-600">{L.expires(formatDate(dday.end, lang))}</p>
                    {dday.windowOpen ? (
                      <p className="self-start rounded-full bg-[#FFF4E5] px-3 py-1 text-[13px] font-medium text-[#9A3F07]">{L.open}</p>
                    ) : (
                      <p className="self-start rounded-full bg-gray-100 px-3 py-1 text-[13px] font-medium text-gray-700">{L.opens(formatDate(dday.opens, lang))}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-gray-600">{L.visa}</p>
                  <p className="text-sm leading-relaxed text-gray-600">{L.noVisa}</p>
                </div>
              )}

              <div className="flex flex-col gap-2 sm:w-56 sm:shrink-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium text-gray-600">{L.progress}</p>
                  <p className="text-lg font-bold">
                    {doneCount} <span className="text-[13px] font-normal text-gray-600">/ {checklist.length}</span>
                  </p>
                </div>
                <div role="img" aria-label={L.progressAria(doneCount, checklist.length)} className="h-2.5 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                </div>
                <Link to="/checklist" className="self-end text-sm font-medium text-brand">{L.openList}</Link>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-gray-200 p-5">
              <p className="text-sm font-medium text-gray-600">{L.must}</p>
              <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm leading-relaxed">
                {plan?.mustDos.map((m) => <li key={m}>{m}</li>)}
              </ol>
            </div>
          </section>

          <section aria-label={L.plan} className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold">{L.plan}</h2>
                {plan && source === 'fallback' && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[13px] font-medium text-gray-600">{L.sample}</span>}
                {updated && <span className="rounded-full bg-[#E7F6EC] px-2.5 py-1 text-[13px] font-medium text-[#146C2E]">{L.updated}</span>}
              </div>
              <div className="flex gap-1.5 rounded-xl bg-gray-100 p-1">
                <button type="button" aria-pressed={tab === 'this'} onClick={() => setTab('this')} className={tabClass(tab === 'this')}>{L.tabThis}</button>
                <button type="button" aria-pressed={tab === 'next'} onClick={() => setTab('next')} className={tabClass(tab === 'next')}>{L.tabNext}</button>
              </div>
            </div>

            {plan ? (
            <ol aria-label={L.plan} className="flex flex-col divide-y divide-gray-200 rounded-xl border border-gray-200">
                {rows.map((r, i) => (
                <li key={i} className="flex flex-col gap-2 p-4">
                    <span className="self-start rounded-full bg-brand-soft px-2.5 py-1 text-[13px] font-medium text-brand-dark">
                    {r.when}
                    </span>
                    <p className="text-[15px] leading-relaxed">{r.what}</p>
                    <p className="text-[13px] leading-relaxed text-gray-600">
                    {r.source} · <span className="font-medium text-brand-dark">{r.office}</span>
                    </p>
                </li>
                ))}
            </ol>
            ) : (
              <p className="py-10 text-center text-gray-500">{L.loading}</p>
            )}
          </section>

          {plan && (
            <section aria-label={L.confirm} className="flex flex-col gap-2.5 rounded-2xl border border-[#F5C99B] bg-[#FFF8F0] px-6 py-5">
              <h2 className="text-[17px] font-bold text-[#7A3305]">{L.confirm}</h2>
              <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-[#5C2804]">
                {plan.needsConfirmation.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </section>
          )}

          <p className="text-[13px] leading-relaxed text-gray-600">{L.footer}</p>
        </div>

        <ChatPanel lang={lang} summary={summary} conditions={conditions} onAction={handleAction} />
      </main>
    </div>
  )
}