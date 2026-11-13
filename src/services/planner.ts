import type { ChatReply, ChecklistItem, Conditions, Plan, ViewLang } from '../types'
import { mockChecklist, mockPlans } from '../mock/plan'
import { mockReply } from '../mock/mockChat'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

// 나중에 API 연결할 때 이 파일만 바꾸면 돼요
export async function getPlan(_conditions: Conditions, lang: ViewLang): Promise<Plan> {
  await wait(500)
  return mockPlans[lang]
}

export async function sendMessage(text: string, lang: ViewLang): Promise<ChatReply> {
  await wait(600)
  return mockReply(text, lang)
}

export function getChecklist(): ChecklistItem[] {
  return mockChecklist
}