export function getDday(expiry: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(expiry)
  const daysLeft = Math.ceil((end.getTime() - today.getTime()) / 86400000)

  const opens = new Date(end)
  opens.setMonth(opens.getMonth() - 4) // 만료 4개월 전부터 연장 신청 가능

  return { daysLeft, windowOpen: today >= opens, opens }
}