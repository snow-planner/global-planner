import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

// 눈송이 로고 (inverted: 흰 원 + 파란 선, 파란 배경 위에서 사용)
export function SnowMark({ size = 32, inverted = false, className = '' }: { size?: number; inverted?: boolean; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className={`shrink-0 ${className}`}>
      <circle cx="16" cy="16" r="16" fill={inverted ? '#fff' : 'var(--color-brand)'} />
      <path
        d="M16 6v20M7.3 11l17.4 10M7.3 21l17.4-10"
        stroke={inverted ? 'var(--color-brand)' : '#fff'}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export const ChatIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-4 3.5V17H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
  </svg>
)

export const PlanIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
)

export const ChecklistIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </svg>
)

export const SettingsIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
    <circle cx="15" cy="7" r="2" />
    <circle cx="9" cy="17" r="2" />
  </svg>
)

export const CloseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const SendIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={2} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const GlobeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c-2.5 2.5-3.5 5.5-3.5 9s1 6.5 3.5 9M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9" />
  </svg>
)

export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
)

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const CheckIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={2.4} {...p}>
    <path d="m5 12 5 5 9-10" />
  </svg>
)

export const LockIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
)