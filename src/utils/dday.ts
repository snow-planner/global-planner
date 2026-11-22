import type { ViewLang } from '../types'
import { LOCALES } from '../i18n'
import { VISA_APPLY_MONTHS_BEFORE } from '../constants'

function parseDate(value: string) {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function getDday(expiry: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = parseDate(expiry)
  const daysLeft = Math.max(0, Math.ceil((end.getTime() - today.getTime()) / 86400000))
  const opens = new Date(end)
  opens.setMonth(opens.getMonth() - VISA_APPLY_MONTHS_BEFORE) // 만료 N개월 전부터 신청 가능
  return { daysLeft, windowOpen: today >= opens, end, opens }
}

export function formatDate(date: Date, lang: ViewLang) {
  return new Intl.DateTimeFormat(LOCALES[lang], { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}