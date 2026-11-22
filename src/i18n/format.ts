// 학기·월 표시를 i18n 파일에서 같이 써요
import type { Term, YearMonth } from '../types'

// 학교 공식 표기: "2026-2학기"
export const termKo = (t: Term) => `${t.year}-${t.semester}학기`

// 영어 표기: "2026 Fall" / "2027 Spring"
export const termEn = (t: Term) => `${t.year} ${t.semester === 1 ? 'Spring' : 'Fall'}`

// 1학기는 봄, 2학기는 가을이에요
export const isSpring = (t: Term) => t.semester === 1

export const monthName = (ym: YearMonth, locale: string, style: 'long' | 'short' = 'long') =>
  new Intl.DateTimeFormat(locale, { month: style }).format(new Date(ym.year, ym.month - 1))
