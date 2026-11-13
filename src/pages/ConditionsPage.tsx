import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { defaultConditions, STORAGE_KEYS } from '../constants'
import { messages } from '../i18n'
import type { Conditions, Visa } from '../types'

const inputClass = 'h-12 rounded-[10px] border border-gray-300 bg-white px-3 text-base text-gray-900'

const visaIds: Visa[] = ['d2', 'other', 'none']

// hint: 한국어 공식 용어 (한국어 화면에서는 빈 문자열이라 안 보여요)
function Field({ id, label, hint, children }: { id: string; label: string; hint: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label} {hint && <span className="font-normal text-gray-600">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

export default function ConditionsPage() {
  const [c, setC] = useLocalStorage<Conditions>(STORAGE_KEYS.conditions, defaultConditions)

  const update = <K extends keyof Conditions>(key: K, value: Conditions[K]) =>
    setC((prev) => ({ ...prev, [key]: value }))

  const { common, conditions: T } = messages[c.lang]

  return (
    <div className="min-h-screen">
      <Header lang={c.lang} />
      <main className="mx-auto flex max-w-[1120px] flex-col gap-6 px-6 pb-16 pt-10">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-brand">{T.step}</p>
          <h1 className="text-[32px] font-bold leading-snug">{T.title}</h1>
          <p className="max-w-[720px] text-base leading-relaxed text-gray-600">{T.intro}</p>
        </div>

        <section aria-label={T.section} className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 rounded-2xl border border-gray-200 bg-white p-8">
          <Field id="f-lang" label={T.langLabel} hint={T.langHint}>
            <select id="f-lang" className={inputClass} value={c.lang} onChange={(e) => update('lang', e.target.value as Conditions['lang'])}>
              <option value="en">English</option>
              <option value="ko">한국어</option>
              <option value="zh">中文</option>
              <option value="vi">Tiếng Việt</option>
              <option value="my">မြန်မာ</option>
              <option value="mn">Монгол</option>
            </select>
          </Field>

          <Field id="f-status" label={T.statusLabel} hint={T.statusHint}>
            <select id="f-status" className={inputClass} value={c.status} onChange={(e) => update('status', e.target.value as Conditions['status'])}>
              <option value="ug">{T.status.ug}</option>
              <option value="grad">{T.status.grad}</option>
              <option value="exchange">{T.status.exchange}</option>
              <option value="lang">{T.status.lang}</option>
            </select>
          </Field>

          <Field id="f-year" label={T.yearLabel} hint={T.yearHint}>
            <select id="f-year" className={inputClass} value={c.year} onChange={(e) => update('year', e.target.value)}>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={String(n)}>{common.year(n)}</option>
              ))}
            </select>
          </Field>

          <Field id="f-major" label={T.majorLabel} hint={T.majorHint}>
            <input id="f-major" type="text" className={inputClass} value={c.major} onChange={(e) => update('major', e.target.value)} />
          </Field>

          <Field id="f-topik" label={T.topikLabel} hint={T.topikHint}>
            <select id="f-topik" className={inputClass} value={c.topik} onChange={(e) => update('topik', e.target.value)}>
              <option value="0">{T.topikNone}</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={String(n)}>{common.topik(n)}</option>
              ))}
            </select>
          </Field>

          <Field id="f-entry" label={T.entryLabel} hint={T.entryHint}>
            <select id="f-entry" className={inputClass} value={c.entry} onChange={(e) => update('entry', e.target.value as Conditions['entry'])}>
              <option value="before">{T.entryBefore}</option>
              <option value="after">{T.entryAfter}</option>
            </select>
          </Field>

          <Field id="f-track" label={T.trackLabel} hint={T.trackHint}>
            <select id="f-track" className={inputClass} value={c.track} onChange={(e) => update('track', e.target.value as Conditions['track'])}>
              <option value="korean">{T.track.korean}</option>
              <option value="english">{T.track.english}</option>
            </select>
          </Field>

          <fieldset className="col-span-full flex flex-col gap-2.5">
            <legend className="mb-2.5 text-sm font-medium">
              {T.visaLabel} {T.visaHint && <span className="font-normal text-gray-600">{T.visaHint}</span>}
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {visaIds.map((id) => {
                const selected = c.visa === id
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update('visa', id)}
                    className={`min-h-12 cursor-pointer rounded-full px-5 text-[15px] ${
                      selected ? 'border-2 border-brand bg-brand-soft font-bold text-brand-dark' : 'border border-gray-300 bg-white text-gray-700'
                    }`}
                  >
                    {T.visa[id]}
                  </button>
                )
              })}
            </div>
            <p className="text-[13px] leading-relaxed text-gray-600">{T.visaNote}</p>
          </fieldset>

          {c.visa === 'd2' && (
            <Field id="f-expiry" label={T.expiryLabel} hint={T.expiryHint}>
              <input id="f-expiry" type="date" className={inputClass} value={c.visaExpiry} onChange={(e) => update('visaExpiry', e.target.value)} />
            </Field>
          )}
        </section>

        <section aria-label={T.privacyTitle} className="flex items-start gap-3.5 rounded-xl border border-[#C9D5F7] bg-brand-soft px-6 py-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B3489" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-bold text-brand-dark">{T.privacyTitle}</p>
            <p className="text-sm leading-relaxed text-[#1F2A55]">{T.privacyBody}</p>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <Link to="/plan" className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-brand px-7 text-base font-bold text-white hover:bg-brand-dark">
            {T.submit}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <p className="text-sm text-gray-600">{T.changeLater}</p>
        </div>
      </main>
    </div>
  )
}