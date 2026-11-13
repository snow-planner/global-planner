import type { ViewLang } from '../types'

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
  opens.setMonth(opens.getMonth() - 4) // 만료 4개월 전부터 신청 가능
  return { daysLeft, windowOpen: today >= opens, end, opens }
}

export function formatDate(date: Date, lang: ViewLang) {
  if (lang === 'ko') return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}