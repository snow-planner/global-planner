import { Link } from 'react-router-dom'
import { ChatIcon, ChecklistIcon, PlanIcon, SettingsIcon } from '../icons'
import { getDashboardText } from '../../i18n/dashboard'
import type { Panel, ViewLang } from '../../types'

interface Props {
  lang: ViewLang
  panel: Panel
  editing: boolean
  remaining: number
  onEditConditions: () => void
}

// 모바일(1024px 미만)에서 사이드바 대신 쓰는 하단 탭바
export default function BottomNav({ lang, panel, editing, remaining, onEditConditions }: Props) {
  const D = getDashboardText(lang)
  const tab = 'relative flex cursor-pointer flex-col items-center gap-1 py-2 text-[11px]'
  const on = 'font-semibold text-brand'
  const off = 'text-gray-500'

  return (
    <nav aria-label={D.menu} className="grid shrink-0 grid-cols-4 border-t border-line bg-white lg:hidden">
      <Link to="/chat" className={`${tab} ${!panel && !editing ? on : off}`}>
        <ChatIcon />
        {D.nav.chat}
      </Link>
      <Link to="/plan" className={`${tab} ${panel === 'plan' ? on : off}`}>
        <PlanIcon />
        {D.nav.plan}
      </Link>
      <Link to="/checklist" className={`${tab} ${panel === 'checklist' ? on : off}`}>
        <ChecklistIcon />
        {D.nav.checklist}
        {remaining > 0 && (
          <span className="absolute left-1/2 top-1 ml-2 rounded-full bg-brand px-1.5 text-[10px] font-bold leading-4 text-white">{remaining}</span>
        )}
      </Link>
      <button type="button" onClick={onEditConditions} className={`${tab} ${editing ? on : off}`}>
        <SettingsIcon />
        {D.nav.conditions}
      </button>
    </nav>
  )
}