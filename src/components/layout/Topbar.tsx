import { Link } from 'react-router-dom'
import { ChevronDownIcon, GlobeIcon, SnowMark } from '../icons'
import { messages } from '../../i18n'
import { getDashboardText } from '../../i18n/dashboard'
import { LANG_OPTIONS } from '../../constants'
import { formatDate, type getDday } from '../../utils/dday'
import type { ViewLang } from '../../types'

interface Props {
  lang: ViewLang
  onLangChange: (lang: ViewLang) => void
  dday: ReturnType<typeof getDday> | null
}

export default function Topbar({ lang, onLangChange, dday }: Props) {
  const D = getDashboardText(lang)
  const L = messages[lang].planner

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line bg-white px-4 lg:h-[72px] lg:px-8">
      <Link to="/chat" aria-label={D.brand} className="lg:hidden">
        <SnowMark size={28} />
      </Link>
      <div className="flex min-w-0 flex-1 items-baseline gap-4">
        <h1 className="shrink-0 text-lg font-bold lg:text-xl">{D.chatTitle}</h1>
        <p className="hidden truncate text-[13px] text-gray-500 md:block">{D.chatSub}</p>
      </div>

      {dday && (
        <p
          title={dday.windowOpen ? L.open : L.opens(formatDate(dday.opens, lang))}
          className={`inline-flex h-8 shrink-0 items-center gap-2 rounded-full px-3.5 text-[13px] font-bold ${
            dday.windowOpen ? 'bg-alert-soft text-alert' : 'bg-brand-soft text-brand'
          }`}
        >
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />
          {D.dday(dday.daysLeft)}
          {dday.windowOpen && <span className="hidden font-medium xl:inline">· {L.open}</span>}
        </p>
      )}

      <label className="relative flex h-8 shrink-0 items-center">
        <span className="sr-only">{D.langSelect}</span>
        <GlobeIcon className="pointer-events-none absolute left-2.5 h-4 w-4 text-gray-500" />
        <select
          value={lang}
          onChange={(e) => onLangChange(e.target.value as ViewLang)}
          className="h-8 cursor-pointer appearance-none rounded-lg border border-line bg-white pl-8 pr-8 text-[13px] text-gray-700"
        >
          {LANG_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-2 h-4 w-4 text-gray-500" />
      </label>
    </header>
  )
}