import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import ChatPanel from '../components/ChatPanel'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatDate, getDday } from '../utils/dday'
import { getChecklist, getPlan } from '../services/planner'
import { defaultChecklistDone, defaultConditions, STORAGE_KEYS } from '../constants'
import type { ChatAction, Conditions, Plan, Tab, ViewLang } from '../types'

const EN = {
  step: 'Step 2 of 3',
  title: 'Your semester plan',
  edit: 'Edit conditions',
  visa: 'Visa expiry · 체류만료일',
  expires: (d: string) => `Expires ${d}`,
  open: 'Extension window is open',
  opens: (d: string) => `Extension opens ${d}`,
  noVisa: 'Add your D-2 expiry date on the conditions page to see your D-day.',
  must: 'Must-dos this semester',
  progress: 'Checklist progress',
  openList: 'Open checklist →',
  plan: 'Semester plan · 학기별 계획표',
  updated: 'Updated from chat',
  tabThis: 'This semester · 2026 Fall',
  tabNext: 'Next semester · 2027 Spring',
  hWhen: 'Timing',
  hWhat: 'What to do',
  hSource: 'Source · Office',
  confirm: 'Needs confirmation · 확인 필요',
  loading: 'Making your plan…',
  ask: 'What do I need to do this semester and next?',
  footer: 'Based on 유학생서비스팀 public guidance, 2026-2학기. This is guidance, not an official decision. Please confirm final details with 유학생서비스팀 or the immigration office.',
}

const KO: typeof EN = {
  step: '2 / 3단계',
  title: '나의 학기 계획',
  edit: '조건 수정',
  visa: '체류만료일',
  expires: (d) => `${d} 만료`,
  open: '연장 신청 가능 기간',
  opens: (d) => `${d}부터 신청 가능`,
  noVisa: '조건 입력에서 D-2 만료일을 넣으면 D-day가 표시돼요.',
  must: '이번 학기 꼭 할 일',
  progress: '체크리스트 진행률',
  openList: '체크리스트 열기 →',
  plan: '학기별 필수 요건 계획표',
  updated: '대화로 업데이트됨',
  tabThis: '이번 학기 · 2026-2학기',
  tabNext: '다음 학기 · 2027-1학기',
  hWhen: '시기',
  hWhat: '할 일',
  hSource: '근거 · 담당 부서',
  confirm: '확인 필요',
  loading: '계획을 만드는 중…',
  ask: '이번 학기와 다음 학기에 뭘 해야 하나요?',
  footer: '유학생서비스팀 공개 자료(2026-2학기) 기준 안내이며 공식 결정이 아닙니다. 최종 확인은 유학생서비스팀 또는 관할 출입국·외국인관서에서 해 주세요.',
}

function conditionChips(c: Conditions, lang: ViewLang): string[] {
  const ko = lang === 'ko'
  const n = Number(c.year)
  return [
    ko ? `${n}학년` : `${['1st', '2nd', '3rd', '4th'][n - 1]} year`,
    c.major,
    c.visa === 'd2' ? 'D-2' : c.visa === 'other' ? (ko ? '기타 체류자격' : 'Other visa') : ko ? '체류자격 미응답' : 'Visa not given',
    c.topik === '0' ? (ko ? 'TOPIK 없음' : 'No TOPIK') : ko ? `TOPIK ${c.topik}급` : `TOPIK ${c.topik}`,
    c.track === 'korean' ? (ko ? '한국어 트랙' : 'Korean track') : ko ? '영어 트랙' : 'English track',
    c.entry === 'after' ? (ko ? '2025년 9월 이후 입학' : 'Entered Sep 2025 or later') : ko ? '2025년 9월 이전 입학' : 'Entered before Sep 2025',
  ]
}

export default function PlannerPage() {
  const [conditions] = useLocalStorage<Conditions>(STORAGE_KEYS.conditions, defaultConditions)
  const [done] = useLocalStorage<Record<string, boolean>>(STORAGE_KEYS.checklist, defaultChecklistDone)
  const [lang, setLang] = useState<ViewLang>(conditions.lang === 'ko' ? 'ko' : 'en')
  const [tab, setTab] = useState<Tab>('this')
  const [plan, setPlan] = useState<Plan | null>(null)
  const [updated, setUpdated] = useState(false)

  useEffect(() => {
    let alive = true
    getPlan(conditions, lang).then((p) => {
      if (alive) setPlan(p)
    })
    return () => {
      alive = false
    }
  }, [conditions, lang])

  const L = lang === 'ko' ? KO : EN
  const chips = conditionChips(conditions, lang)
  const [summary] = useState(() => `${conditionChips(conditions, lang).join(' · ')} — ${L.ask}`)

  const checklist = getChecklist()
  const doneCount = checklist.filter((i) => done[i.id]).length
  const pct = Math.round((doneCount / checklist.length) * 100)

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
      <Header />
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

          <section aria-label="Overview" className="flex flex-col rounded-2xl border border-gray-200 bg-white">
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
                <div role="img" aria-label={`${doneCount} of ${checklist.length} tasks done`} className="h-2.5 overflow-hidden rounded-full bg-gray-200">
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

          <section aria-label="Semester plan" className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold">{L.plan}</h2>
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
            <section aria-label="Needs confirmation" className="flex flex-col gap-2.5 rounded-2xl border border-[#F5C99B] bg-[#FFF8F0] px-6 py-5">
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