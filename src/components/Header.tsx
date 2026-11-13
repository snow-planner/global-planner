import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: '1 Conditions' },
  { to: '/plan', label: '2 Plan' },
  { to: '/checklist', label: '3 Checklist' },
]

export default function Header() {
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
        <nav aria-label="Main" className="flex flex-wrap gap-1 text-sm">
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