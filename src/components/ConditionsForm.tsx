import type { ReactNode } from 'react'
import { messages } from '../i18n'
import { LANG_OPTIONS } from '../constants'
import type { Conditions, Visa } from '../types'

const inputClass = 'h-10 w-full rounded-lg border border-line bg-white px-3 text-[15px] text-ink focus:border-brand focus:outline-none'

const visaIds: Visa[] = ['d2', 'other', 'none']

export type UpdateCondition = <K extends keyof Conditions>(key: K, value: Conditions[K]) => void

// hint: 한국어 공식 용어 (한국어 화면에서는 빈 문자열이라 안 보여요)
function Field({ id, label, hint, children }: { id: string; label: string; hint: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="truncate text-[13px] font-semibold text-gray-700">
        {label} {hint && <span className="font-normal text-gray-500">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

// 조건 입력 폼 (첫 화면 · 조건 수정 모달에서 같이 써요)
export default function ConditionsForm({ value: c, onChange: update }: { value: Conditions; onChange: UpdateCondition }) {
  const { common, conditions: T } = messages[c.lang]

  return (
    // 놓인 자리의 너비 기준으로 1 → 2 → 3열 (첫 화면 카드는 3열, 모달은 2열 · @2xl = 672px)
    <div className="@container">
    <div className="grid gap-x-5 gap-y-4 @md:grid-cols-2 @2xl:grid-cols-3">
      <Field id="f-lang" label={T.langLabel} hint={T.langHint}>
        <select id="f-lang" className={inputClass} value={c.lang} onChange={(e) => update('lang', e.target.value as Conditions['lang'])}>
          {LANG_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
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
            <option key={n} value={String(n)}>
              {common.year(n)}
            </option>
          ))}
        </select>
      </Field>

      <Field id="f-major" label={T.majorLabel} hint={T.majorHint}>
        <input id="f-major" type="text" className={inputClass} placeholder={T.majorPlaceholder} value={c.major} onChange={(e) => update('major', e.target.value)} />
      </Field>

      <Field id="f-topik" label={T.topikLabel} hint={T.topikHint}>
        <select id="f-topik" className={inputClass} value={c.topik} onChange={(e) => update('topik', e.target.value)}>
          <option value="0">{T.topikNone}</option>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={String(n)}>
              {common.topik(n)}
            </option>
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

      <fieldset className="col-span-full flex flex-col gap-1.5 @2xl:col-span-2">
        <legend className="mb-1.5 text-[13px] font-semibold text-gray-700">
          {T.visaLabel} {T.visaHint && <span className="font-normal text-gray-500">{T.visaHint}</span>}
        </legend>
        <div className="grid grid-cols-3 gap-1 rounded-[10px] bg-surface p-1">
          {visaIds.map((id) => {
            const selected = c.visa === id
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => update('visa', id)}
                className={`min-h-8 cursor-pointer rounded-md px-2 text-[13px] ${
                  selected ? 'bg-white font-bold text-brand shadow-[0_0_0_1px_var(--color-line)]' : 'text-gray-500'
                }`}
              >
                {T.visa[id]}
              </button>
            )
          })}
        </div>
        <p className="text-xs leading-relaxed text-gray-500">{T.visaNote}</p>
      </fieldset>

      {/* 비자를 바꿔도 화면이 들썩이지 않게 칸은 항상 두고, D-2가 아니면 비활성화만 해요
          (D-2가 아니면 만료일은 계획·D-day 계산에 쓰이지 않아요) */}
      <Field id="f-expiry" label={T.expiryLabel} hint={T.expiryHint}>
        <input
          id="f-expiry"
          type="date"
          disabled={c.visa !== 'd2'}
          className={`${inputClass} disabled:cursor-not-allowed disabled:bg-surface disabled:text-gray-400`}
          value={c.visaExpiry}
          onChange={(e) => update('visaExpiry', e.target.value)}
        />
      </Field>
    </div>
    </div>
  )
}