import { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LOCALES, messages } from '../i18n'
import type { ViewLang } from '../types'

export default function Header({ lang }: { lang: ViewLang }) {
  const T = messages[lang].header
  const links = [
    { to: '/', label: T.conditions },
    { to: '/plan', label: T.plan },
    { to: '/checklist', label: T.checklist },
  ]

  // 화면 언어에 맞게 <html lang> 을 바꿔요 (화면 읽기 프로그램·글꼴 선택에 쓰임)
  useEffect(() => {
    document.documentElement.lang = LOCALES[lang]
  }, [lang])

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2.5 text-gray-900">
          <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#2647B8" />
            <path d="M16 7v18M8.2 11.5l15.6 9M8.2 20.5l15.6-9" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="flex flex-col leading-tight">
            <span className="text-[17px] font-bold">SNOW Global Planner</span>
            <span className="text-xs text-gray-600">글로벌 플래너</span>
          </span>
        </Link>
        <nav aria-label={T.nav} className="flex flex-wrap gap-1 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-2.5 ${isActive ? 'bg-brand-soft font-medium text-brand-dark' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}