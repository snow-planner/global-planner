import { Link } from 'react-router-dom'
import ConditionsForm, { type UpdateCondition } from '../components/ConditionsForm'
import { CheckIcon, LockIcon, SendIcon, SnowMark } from '../components/icons'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useHtmlLang } from '../hooks/useHtmlLang'
import { defaultConditions, ROUTES, STORAGE_KEYS } from '../constants'
import { messages } from '../i18n'
import { getDashboardText } from '../i18n/dashboard'
import type { Conditions } from '../types'

// 처음 들어왔을 때 조건 입력 (왼쪽 소개 + 오른쪽 폼 카드)
// 화면 높이에 맞추고, 내용이 넘치면 오른쪽만 스크롤 · 아래 버튼 줄은 항상 보이게
export default function ConditionsPage() {
  const [c, setC] = useLocalStorage<Conditions>(STORAGE_KEYS.conditions, defaultConditions)
  const update: UpdateCondition = (key, value) => setC((prev) => ({ ...prev, [key]: value }))
  const T = messages[c.lang].conditions
  const D = getDashboardText(c.lang)

  useHtmlLang(c.lang)

  // 개인정보 안내: 데스크톱은 왼쪽 파란 영역, 모바일은 폼 아래
  const privacy = (dark: boolean) => (
    <div role="note" aria-label={T.privacyTitle} className={`flex items-start gap-3 rounded-xl px-4 py-3.5 ${dark ? 'bg-white/10' : 'bg-brand-soft'}`}>
      <LockIcon className={`mt-0.5 h-5 w-5 shrink-0 ${dark ? 'text-white' : 'text-brand'}`} />
      <div className="flex flex-col gap-1">
        <p className={`text-[13px] font-bold ${dark ? 'text-white' : 'text-brand'}`}>{T.privacyTitle}</p>
        <p className={`text-xs leading-relaxed ${dark ? 'text-white/70' : 'text-gray-700'}`}>{T.privacyBody}</p>
      </div>
    </div>
  )

  return (
    <div className="flex h-dvh overflow-hidden">
      <aside className="hidden w-[400px] shrink-0 flex-col overflow-y-auto bg-brand px-12 py-12 text-white lg:flex xl:w-[440px] short:px-10 short:py-8">
        <div className="flex items-center gap-3">
          <SnowMark size={44} inverted />
          <span className="flex flex-col leading-tight">
            <span className="text-[13px] text-white/70">{D.brandSub}</span>
            <span className="text-lg font-bold">{D.brand}</span>
          </span>
        </div>

        <div className="my-auto flex flex-col gap-5 py-8 short:gap-4 short:py-6">
          <p className="whitespace-pre-line text-[32px] font-bold leading-tight 2xl:text-[40px] short:text-[26px]">{D.heroTitle}</p>
          <p className="text-[15px] leading-relaxed text-white/75 short:hidden">{T.intro}</p>
          <ul className="mt-2 flex flex-col gap-3 short:mt-0">
            {D.heroFeatures.map((f) => (
              <li key={f} className="flex items-center gap-3 text-[15px] font-semibold">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <CheckIcon className="h-4 w-4" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          {privacy(true)}
          <p className="text-xs text-white/60">{D.footer}</p>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        {/* 화면이 넉넉하면 가운데 정렬, 모자라면 위에서부터 스크롤 (my-auto) */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-10 lg:px-12 short:py-5">
          <div className="mx-auto my-auto flex w-full max-w-[760px] flex-col gap-6 short:gap-4">
            <div className="flex items-center gap-3 lg:hidden">
              <SnowMark size={36} />
              <span className="text-base font-bold">{D.brand}</span>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold leading-snug xl:text-[28px] short:text-[22px]">{T.title}</h1>
              <p className="text-[15px] leading-relaxed text-gray-500 lg:hidden">{T.intro}</p>
            </div>

            <section aria-label={T.section} className="rounded-2xl border border-line bg-white p-5 sm:p-8 short:sm:p-6">
              <ConditionsForm value={c} onChange={update} />
            </section>

            <div className="lg:hidden">{privacy(false)}</div>
          </div>
        </div>

        {/* 버튼 줄은 스크롤과 상관없이 항상 아래에 */}
        <div className="shrink-0 border-t border-line bg-white px-6 py-4 lg:px-12 short:py-3">
          <div className="mx-auto flex w-full max-w-[760px] items-center justify-between gap-4">
            <p className="hidden text-sm text-gray-500 sm:block">{T.changeLater}</p>
            <Link
              to={ROUTES.plan}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-7 text-[15px] font-bold text-white hover:bg-brand-dark sm:w-auto"
            >
              {T.submit}
              <SendIcon />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}