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
          {links.map((l) => {
            // "1 조건 입력" → 번호(동그라미) + 이름으로 나눠서 단계 버튼처럼 보이게 해요
            const m = l.label.match(/^(\d)\s+(.*)$/)
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end
                className={({ isActive }) =>
                  `inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3.5 transition-colors ${
                    isActive
                      ? 'border-brand bg-brand font-semibold text-white'
                      : 'border-gray-300 bg-white text-gray-800 hover:border-brand hover:bg-brand-soft hover:text-brand-dark'
                  }`
                }
              >
                {m && (
                  <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full bg-current/15 text-xs font-bold">
                    {m[1]}
                  </span>
                )}
                {m ? m[2] : l.label}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </header>
  )
}