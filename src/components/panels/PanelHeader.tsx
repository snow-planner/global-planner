import type { ReactNode } from 'react'
import { CloseIcon } from '../icons'

interface Props {
  title: string
  closeLabel: string
  onClose: () => void
  children?: ReactNode // 제목 옆 배지
}

export default function PanelHeader({ title, closeLabel, onClose, children }: Props) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 px-6 pb-4 pt-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        {children}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-surface hover:text-gray-700"
      >
        <CloseIcon />
      </button>
    </div>
  )
}