export type Lang = 'en' | 'ko'
export type Visa = 'd2' | 'other' | 'none'

export interface Conditions {
  lang: Lang
  year: 1 | 2 | 3 | 4
  major: string
  visa: Visa
  topik: number
  entry: 'before' | 'after'
  track: 'korean' | 'english'
  visaExpiry?: string // 'YYYY-MM-DD', 기기에만 저장
}

export interface PlanRow {
  when: string
  what: string
  source: string
  office: string
}

export interface ChecklistItem {
  id: string
  category: 'stay' | 'academics' | 'scholarship'
  text: string
  ko: string
  due: string
  source: string
}

export interface Plan {
  thisSemester: PlanRow[]
  nextSemester: PlanRow[]
  checklist: ChecklistItem[]
  needsConfirmation: string[]
}