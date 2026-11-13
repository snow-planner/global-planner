import type { Conditions, Plan } from '../types'
import { mockPlan } from '../mock/plan'
import { mockReply, type ChatReply } from '../mock/chat'

const USE_MOCK = true
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getPlan(conditions: Conditions): Promise<Plan> {
  if (USE_MOCK) {
    await wait(800) // 로딩 화면 확인용
    return mockPlan
  }
  // 나중에: 백엔드 호출
  const res = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(conditions),
  })
  return res.json()
}

export async function sendMessage(text: string): Promise<ChatReply> {
  if (USE_MOCK) {
    await wait(600)
    return mockReply(text)
  }
  // 나중에: 백엔드 호출
  throw new Error('not implemented')
}