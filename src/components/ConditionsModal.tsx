import { useEffect, useState } from 'react'
import ConditionsForm, { type UpdateCondition } from './ConditionsForm'
import { CloseIcon } from './icons'
import { messages } from '../i18n'
import { getDashboardText } from '../i18n/dashboard'
import type { Conditions } from '../types'

interface Props {
  initial: Conditions
  onCancel: () => void
  onSave: (next: Conditions) => void
}

// 저장을 누르기 전까지는 복사본(draft)만 바꿔요 → 취소하면 원래 조건 그대로
export default function ConditionsModal({ initial, onCancel, onSave }: Props) {
  const [draft, setDraft] = useState(initial)
  const update: UpdateCondition = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }))
  const D = getDashboardText(draft.lang)
  const T = messages[draft.lang].conditions

  // Esc로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/45 sm:items-center sm:p-6" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="conditions-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92dvh] w-full max-w-[640px] flex-col rounded-t-2xl bg-white sm:rounded-[20px]"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
          <div>
            <h2 id="conditions-title" className="text-xl font-bold">{D.modalTitle}</h2>
            <p className="mt-1 text-[13px] text-gray-500">{D.modalDesc}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label={D.close}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-surface hover:text-gray-700"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <ConditionsForm value={draft} onChange={update} />
          <p className="mt-6 rounded-[10px] bg-surface px-4 py-3 text-xs leading-relaxed text-gray-500">{T.privacyBody}</p>
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-line px-6 py-4 sm:px-8">
          <button type="button" onClick={onCancel} className="h-12 cursor-pointer rounded-[10px] border border-line px-6 text-sm font-semibold text-gray-700 hover:bg-surface">
            {D.cancel}
          </button>
          <button type="button" onClick={() => onSave(draft)} className="h-12 cursor-pointer rounded-[10px] bg-brand px-6 text-sm font-bold text-white hover:bg-brand-dark">
            {D.save}
          </button>
        </div>
      </div>
    </div>
  )
}