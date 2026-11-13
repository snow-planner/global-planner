export type Lang = 'en' | 'ko' | 'zh' | 'vi' | 'my' | 'mn'
export type ViewLang = 'en' | 'ko'
export type Visa = 'd2' | 'other' | 'none'
export type Tab = 'this' | 'next'

export interface Conditions {
  lang: Lang
  status: 'ug' | 'grad' | 'exchange' | 'lang'
  year: string
  major: string
  topik: string
  entry: 'before' | 'after'
  track: 'korean' | 'english'
  visa: Visa
  visaExpiry: string // YYYY-MM-DD, 이 기기에만 저장
}

export interface PlanRow {
  when: string
  what: string
  source: string
  office: string
}

export interface Plan {
  mustDos: string[]
  thisSemester: PlanRow[]
  nextSemester: PlanRow[]
  checklist: ChecklistItem[]
  needsConfirmation: string[]
}

export interface ChecklistItem {
  id: string
  category: 'stay' | 'academics' | 'scholarship'
  text: string
  ko: string
  due: string
  source: string
  urgent: boolean
}

export type ChatAction =
  | { type: 'setTab'; tab: Tab }
  | { type: 'setLang'; lang: ViewLang }

export interface ChatReply {
  text: string
  source?: string
  action?: ChatAction
}

export interface ChatMessage {
  role: 'user' | 'bot'
  text: string
  source?: string
  local?: boolean // 화면에만 보이고 API로는 안 보내는 메시지
}