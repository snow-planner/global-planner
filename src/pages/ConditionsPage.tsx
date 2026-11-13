import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { defaultConditions, STORAGE_KEYS } from '../constants'
import type { Conditions, Visa } from '../types'

const inputClass = 'h-12 rounded-[10px] border border-gray-300 bg-white px-3 text-base text-gray-900'

const visaOptions: { id: Visa; label: string }[] = [
  { id: 'd2', label: 'D-2 (student visa)' },
  { id: 'other', label: 'Other' },
  { id: 'none', label: 'Prefer not to say' },
]

function Field({ id, label, ko, children }: { id: string; label: string; ko: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label} <span className="font-normal text-gray-600">{ko}</span>
      </label>
      {children}
    </div>
  )
}

export default function ConditionsPage() {
  const [c, setC] = useLocalStorage<Conditions>(STORAGE_KEYS.conditions, defaultConditions)

  const update = <K extends keyof Conditions>(key: K, value: Conditions[K]) =>
    setC((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto flex max-w-[1120px] flex-col gap-6 px-6 pb-16 pt-10">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-brand">Step 1 of 3</p>
          <h1 className="text-[32px] font-bold leading-snug">Tell us about your situation</h1>
          <p className="max-w-[720px] text-base leading-relaxed text-gray-600">
            We pick only the requirements that apply to you and turn them into a semester plan. Official terms are also
            shown in Korean, so you can find them on the school website.
          </p>
        </div>

        <section aria-label="Your conditions" className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 rounded-2xl border border-gray-200 bg-white p-8">
          <Field id="f-lang" label="Answer language" ko="응답 언어">
            <select id="f-lang" className={inputClass} value={c.lang} onChange={(e) => update('lang', e.target.value as Conditions['lang'])}>
              <option value="en">English</option>
              <option value="ko">한국어</option>
              <option value="zh">中文</option>
              <option value="vi">Tiếng Việt</option>
              <option value="my">မြန်မာ</option>
              <option value="mn">Монгол</option>
            </select>
          </Field>

          <Field id="f-status" label="Student type" ko="학적 구분">
            <select id="f-status" className={inputClass} value={c.status} onChange={(e) => update('status', e.target.value as Conditions['status'])}>
              <option value="ug">Undergraduate (학부)</option>
              <option value="grad">Graduate (대학원)</option>
              <option value="exchange">Exchange student (교환학생)</option>
              <option value="lang">Korean language program (한국어 과정)</option>
            </select>
          </Field>

          <Field id="f-year" label="Year" ko="학년">
            <select id="f-year" className={inputClass} value={c.year} onChange={(e) => update('year', e.target.value)}>
              <option value="1">1st year</option>
              <option value="2">2nd year</option>
              <option value="3">3rd year</option>
              <option value="4">4th year</option>
            </select>
          </Field>

          <Field id="f-major" label="Major" ko="전공">
            <input id="f-major" type="text" className={inputClass} value={c.major} onChange={(e) => update('major', e.target.value)} />
          </Field>

          <Field id="f-topik" label="Korean level" ko="한국어 수준">
            <select id="f-topik" className={inputClass} value={c.topik} onChange={(e) => update('topik', e.target.value)}>
              <option value="0">No TOPIK yet</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={String(n)}>TOPIK {n}</option>
              ))}
            </select>
          </Field>

          <Field id="f-entry" label="When you entered" ko="입학 시기">
            <select id="f-entry" className={inputClass} value={c.entry} onChange={(e) => update('entry', e.target.value as Conditions['entry'])}>
              <option value="before">Before September 2025</option>
              <option value="after">From September 2025 onward</option>
            </select>
          </Field>

          <Field id="f-track" label="Course track" ko="수업 트랙">
            <select id="f-track" className={inputClass} value={c.track} onChange={(e) => update('track', e.target.value as Conditions['track'])}>
              <option value="korean">Korean track (한국어 트랙)</option>
              <option value="english">English track (영어 트랙)</option>
            </select>
          </Field>

          <fieldset className="col-span-full flex flex-col gap-2.5">
            <legend className="mb-2.5 text-sm font-medium">
              Visa type <span className="font-normal text-gray-600">체류자격</span>
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {visaOptions.map((o) => {
                const selected = c.visa === o.id
                return (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update('visa', o.id)}
                    className={`min-h-12 cursor-pointer rounded-full px-5 text-[15px] ${
                      selected ? 'border-2 border-brand bg-brand-soft font-bold text-brand-dark' : 'border border-gray-300 bg-white text-gray-700'
                    }`}
                  >
                    {o.label}
                  </button>
                )
              })}
            </div>
            <p className="text-[13px] leading-relaxed text-gray-600">
              We only ask for the visa type, never the number. Choose "Prefer not to say" to get the common guide for everyone.
            </p>
          </fieldset>

          {c.visa === 'd2' && (
            <Field id="f-expiry" label="Visa expiry date (optional)" ko="체류만료일 · 이 기기에만 저장">
              <input id="f-expiry" type="date" className={inputClass} value={c.visaExpiry} onChange={(e) => update('visaExpiry', e.target.value)} />
            </Field>
          )}
        </section>

        <section aria-label="Privacy notice" className="flex items-start gap-3.5 rounded-xl border border-[#C9D5F7] bg-brand-soft px-6 py-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B3489" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-bold text-brand-dark">Please do not enter personal information</p>
            <p className="text-sm leading-relaxed text-[#1F2A55]">
              Do not enter your name, student ID, or alien registration number (외국인등록번호). We only use the conditions
              above. What you enter in SNOWCHAT may be used to improve the service under the school's policy.
            </p>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <Link to="/plan" className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-brand px-7 text-base font-bold text-white hover:bg-brand-dark">
            Create my semester plan
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <p className="text-sm text-gray-600">You can change these conditions anytime.</p>
        </div>
      </main>
    </div>
  )
}