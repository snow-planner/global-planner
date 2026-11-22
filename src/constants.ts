import type { Conditions, Lang } from './types'

export const STORAGE_KEYS = {
  conditions: 'snow-planner:conditions',
} as const

export const defaultConditions: Conditions = {
  lang: 'en',
  status: 'ug',
  year: '2',
  major: 'Business Administration',
  topik: '3',
  entry: 'after',
  track: 'korean',
  visa: 'd2',
  visaExpiry: '2027-03-10',
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