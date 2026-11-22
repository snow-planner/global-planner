import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import BottomNav from '../components/layout/BottomNav'
import ChatPanel from '../components/ChatPanel'
import PlanPanel from '../components/panels/PlanPanel'
import ChecklistPanel from '../components/panels/ChecklistPanel'
import ConditionsModal from '../components/ConditionsModal'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useHtmlLang } from '../hooks/useHtmlLang'
import { getDday } from '../utils/dday'
import { conditionChips } from '../utils/conditions'
import { getPlan, type PlanSource } from '../services/planner'
import { defaultChecklistDone, defaultConditions, PANEL_INLINE_MIN_WIDTH, ROUTES, STORAGE_KEYS } from '../constants'
import { messages } from '../i18n'
import { getDashboardText } from '../i18n/dashboard'
import type { ChatAction, ChecklistItem, Conditions, Panel, Plan, Tab, ViewLang } from '../types'

const LOADING_CHECKLIST_KEY = 'snow-planner:checklist:loading'

// 채팅은 항상 가운데, 계획·체크리스트는 오른쪽 패널, 조건 수정은 모달
export default function DashboardPage({ panel }: { panel: Panel }) {
  const navigate = useNavigate()
  const [conditions, setConditions] = useLocalStorage<Conditions>(STORAGE_KEYS.conditions, defaultConditions)
  const [lang, setLang] = useState<ViewLang>(conditions.lang)
  const [tab, setTab] = useState<Tab>('this')
  const [updated, setUpdated] = useState(false)
  const [editing, setEditing] = useState(false)
  const [prefill, setPrefill] = useState<{ id: number; text: string } | null>(null)
  const [askedId, setAskedId] = useState<string | null>(null)
  const [loaded, setLoaded] = useState<{ key: string; plan: Plan; source: PlanSource; checklistKey: string } | null>(null)
  const planKey = JSON.stringify({ conditions, lang })

  useHtmlLang(lang)

  useEffect(() => {
    let alive = true
    getPlan(conditions, lang).then((r) => {
      if (alive) setLoaded({ key: planKey, plan: r.plan, source: r.source, checklistKey: r.checklistKey })
    })
    return () => {
      alive = false
    }
  }, [conditions, lang, planKey])

  // 지금 조건·언어로 받은 계획만 보여주고, 아직 안 왔으면 null → 로딩 표시
  const ready = loaded?.key === planKey
  const plan = ready ? loaded.plan : null
  const source = ready ? loaded.source : null
  // 체크 상태는 계획별 키로 저장해요 (패널·사이드바 배지가 같은 값을 써요)
  const [done, setDone] = useLocalStorage<Record<string, boolean>>(ready ? loaded.checklistKey : LOADING_CHECKLIST_KEY, defaultChecklistDone)

  const items = plan?.checklist ?? []
  const remaining = items.filter((i) => !done[i.id]).length
  const toggle = (id: string) => setDone((prev) => ({ ...prev, [id]: !prev[id] }))

  const L = messages[lang].planner
  const D = getDashboardText(lang)
  const chips = conditionChips(conditions, lang).join(' · ')
  const summary = `${chips} — ${L.ask}`
  const dday = conditions.visa === 'd2' && conditions.visaExpiry ? getDday(conditions.visaExpiry) : null

  const closePanel = () => navigate(ROUTES.chat)

  const handleAction = (action?: ChatAction) => {
    if (!action) return
    if (action.type === 'setTab') {
      setTab(action.tab)
      navigate(ROUTES.plan) // 계획이 바뀌었으니 패널을 열어서 보여줘요
    }
    if (action.type === 'setLang') setLang(action.lang)
    setUpdated(true)
  }

  const ask = (item: ChecklistItem) => {
    setPrefill({ id: Date.now(), text: D.askTemplate(item.text) })
    setAskedId(item.id)
    // 패널이 채팅을 덮는 화면(1280px 미만)에서는 패널을 닫아 입력창이 보이게 해요
    if (!window.matchMedia(`(min-width: ${PANEL_INLINE_MIN_WIDTH}px)`).matches) closePanel()
  }

  const saveConditions = (next: Conditions) => {
    setConditions(next)
    setLang(next.lang)
    setTab('this')
    setUpdated(false)
    setAskedId(null)
    setEditing(false)
  }

  // 첫 화면 "오늘 할 일": 아직 안 한 급한 항목 하나
  const todayItem = items.find((i) => i.urgent && !done[i.id]) ?? items.find((i) => !done[i.id])
  const todaySlot = todayItem && (
    <div className="mt-6 flex w-full items-center gap-4 rounded-xl bg-brand-soft px-5 py-4 text-left short:mt-3 short:py-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-brand">{D.today}</p>
        <p className="mt-1 truncate text-sm font-semibold text-ink">
          {todayItem.text} · {todayItem.due}
        </p>
      </div>
      <Link to={ROUTES.checklist} className="shrink-0 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark">
        {D.openChecklist}
      </Link>
    </div>
  )

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar conditions={conditions} lang={lang} panel={panel} editing={editing} remaining={remaining} onEditConditions={() => setEditing(true)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar lang={lang} onLangChange={setLang} dday={dday} />

        <div className="flex min-h-0 flex-1">
          <main className="flex min-w-0 flex-1 flex-col">
            {/* 조건이 바뀌면 새 대화로 시작하도록 key를 조건으로 줘요 */}
            <ChatPanel
              key={JSON.stringify(conditions)}
              lang={lang}
              summary={summary}
              chips={chips}
              conditions={conditions}
              onAction={handleAction}
              prefill={prefill}
              todaySlot={todaySlot}
            />
          </main>

          {panel && (
            <>
              {/* 1280px 미만: 채팅 위에 덮는 드로어 + 뒷배경 */}
              <div aria-hidden="true" onClick={closePanel} className="fixed inset-0 z-30 bg-slate-900/40 xl:hidden" />
              <aside
                aria-label={panel === 'plan' ? D.planTitle : D.checklistTitle}
                className="fixed inset-y-0 right-0 z-40 flex w-full max-w-[420px] flex-col bg-white shadow-xl xl:static xl:z-auto xl:w-[380px] xl:max-w-none xl:border-l xl:border-line xl:shadow-none"
              >
                {panel === 'plan' ? (
                  <PlanPanel lang={lang} plan={plan} source={source} tab={tab} onTab={setTab} updated={updated} onClose={closePanel} />
                ) : (
                  <ChecklistPanel lang={lang} ready={ready} items={items} done={done} onToggle={toggle} askedId={askedId} onAsk={ask} onClose={closePanel} />
                )}
              </aside>
            </>
          )}
        </div>

        <BottomNav lang={lang} panel={panel} editing={editing} remaining={remaining} onEditConditions={() => setEditing(true)} />
      </div>

      {editing && <ConditionsModal initial={conditions} onCancel={() => setEditing(false)} onSave={saveConditions} />}
    </div>
  )
}