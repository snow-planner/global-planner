import type { Conditions, Lang, Term, YearMonth } from './types'

// 화면 주소 (세 대시보드 주소는 오른쪽 패널만 달라요)
export const ROUTES = {
  home: '/',
  chat: '/chat',
  plan: '/plan',
  checklist: '/checklist',
} as const

// 비자 연장은 만료일 몇 개월 전부터 신청할 수 있는지
export const VISA_APPLY_MONTHS_BEFORE = 4

// 이 너비부터 패널을 채팅 옆에 띄워요 (Tailwind xl과 같아야 함)
export const PANEL_INLINE_MIN_WIDTH = 1280

export const STORAGE_KEYS = {
  conditions: 'snow-planner:conditions',
} as const

// 학기가 바뀌면 여기만 고쳐요
export const TERMS = {
  current: { year: 2026, semester: 2 },
  next: { year: 2027, semester: 1 },
} as const satisfies Record<'current' | 'next', Term>

// 자료 기준 학기 (지금은 이번 학기와 같아요)
export const DATA_TERM: Term = TERMS.current

// 입학 시기 기준 (이 달부터 입학하면 '이후')
export const ENTRY_CUTOFF: YearMonth = { year: 2025, month: 9 }

export const defaultConditions: Conditions = {
  lang: 'en',
  status: 'ug',
  year: '2',
  major: '',
  topik: '3',
  entry: 'after',
  track: 'korean',
  visa: 'd2',
  visaExpiry: '', // 비어 있으면 D-day를 숨기고 챗봇에도 안 보내요
}

export const defaultChecklistDone: Record<string, boolean> = {}

// 언어 선택 목록 (조건 입력 · 상단바에서 같이 써요)
export const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ko', label: '한국어' },
  { value: 'zh', label: '中文' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'my', label: 'မြန်မာ' },
  { value: 'mn', label: 'Монгол' },
]