import { Link } from 'react-router-dom'
import { ChatIcon, ChecklistIcon, PlanIcon, SettingsIcon, SnowMark } from '../icons'
import { messages } from '../../i18n'
import { getDashboardText } from '../../i18n/dashboard'
import { LANG_OPTIONS } from '../../constants'
import type { Conditions, Panel, ViewLang } from '../../types'

interface Props {
  conditions: Conditions
  lang: ViewLang
  panel: Panel
  editing: boolean
  remaining: number
  onEditConditions: () => void
}

// 진한 배경 = 메인 화면(채팅) / 연한 배경 + 왼쪽 막대 = 열린 패널·모달
const item = 'relative flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-[10px] px-4 text-[15px] transition-colors'
const styles = {
  main: 'bg-brand font-semibold text-white',
  open: 'bg-brand-soft font-semibold text-brand before:absolute before:left-0 before:top-2.5 before:h-6 before:w-1 before:rounded-full before:bg-brand',
  idle: 'text-gray-700 hover:bg-surface',
}

export default function Sidebar({ conditions: c, lang, panel, editing, remaining, onEditConditions }: Props) {
  const D = getDashboardText(lang)
  const { common, conditions: T } = messages[lang]

  const rows: [string, string][] = [
    [T.statusLabel, T.status[c.status]],
    [T.visaLabel, T.visa[c.visa]],
    [T.topikLabel, c.topik === '0' ? T.topikNone : common.topik(c.topik)],
    [T.langLabel, LANG_OPTIONS.find((o) => o.value === c.lang)?.label ?? c.lang],
  ]

  return (
    <aside className="hidden w-60 shrink-0 flex-col overflow-y-auto border-r border-line bg-white lg:flex">
      <Link to="/chat" className="flex items-center gap-3 px-6 pb-6 pt-7 short:pb-4 short:pt-5">
        <SnowMark />
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-xs text-gray-500">{D.brandSub}</span>
          <span className="truncate text-[15px] font-bold text-ink">{D.brand}</span>
        </span>
      </Link>

      <p className="px-6 pb-2 text-[11px] font-semibold tracking-wider text-gray-400">{D.menu}</p>
      <nav aria-label={D.menu} className="flex flex-col gap-2 px-4">
        <Link to="/chat" className={`${item} ${styles.main}`}>
          <ChatIcon />
          {D.nav.chat}
        </Link>
        {/* 열린 패널을 다시 누르면 닫혀요 */}
        <Link to={panel === 'plan' ? '/chat' : '/plan'} aria-current={panel === 'plan' ? 'page' : undefined} className={`${item} ${panel === 'plan' ? styles.open : styles.idle}`}>
          <PlanIcon />
          {D.nav.plan}
        </Link>
        <Link to={panel === 'checklist' ? '/chat' : '/checklist'} aria-current={panel === 'checklist' ? 'page' : undefined} className={`${item} ${panel === 'checklist' ? styles.open : styles.idle}`}>
          <ChecklistIcon />
          {D.nav.checklist}
          {remaining > 0 && (
            <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold text-brand ${panel === 'checklist' ? 'bg-white' : 'bg-brand-soft'}`}>
              {remaining}
            </span>
          )}
        </Link>
        <button type="button" onClick={onEditConditions} className={`${item} ${editing ? styles.open : styles.idle}`}>
          <SettingsIcon />
          {D.nav.conditions}
        </button>
      </nav>

      <div className="mx-6 my-6 h-px bg-line short:my-4" />

      <p className="px-6 pb-2 text-[11px] font-semibold tracking-wider text-gray-400">{D.myConditions}</p>
      <div className="mx-4 flex flex-col gap-2.5 rounded-xl bg-brand-soft p-4">
        {rows.map(([k, v]) => (
          <p key={k} className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="shrink-0 text-gray-500">{k}</span>
            <span className="min-w-0 truncate font-semibold text-ink">{v}</span>
          </p>
        ))}
        <button type="button" onClick={onEditConditions} className="mt-1 cursor-pointer self-start text-xs font-semibold text-brand">
          {D.editConditions}
        </button>
      </div>

      <p className="mt-auto px-6 pb-6 pt-4 text-[11px] leading-relaxed text-gray-400 short:hidden">{D.footer}</p>
    </aside>
  )
}