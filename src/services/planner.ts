import type { ChatMessage, ChatReply, ChecklistItem, Conditions, Plan, ViewLang } from '../types'
import { mockChecklist, mockPlans } from '../mock/plan'
import { mockReply } from '../mock/mockChat'

// Vercel 환경변수 VITE_USE_MOCK=false 이면 실제 SNOWCHAT API 사용
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getPlan(_conditions: Conditions, lang: ViewLang): Promise<Plan> {
  await wait(500)
  return mockPlans[lang] // 계획표는 아직 목업 (나중에 api/plan.ts로 교체)
}

export async function sendMessage(history: ChatMessage[], lang: ViewLang): Promise<ChatReply> {
  const last = history[history.length - 1]?.text ?? ''

  if (USE_MOCK) {
    await wait(600)
    return mockReply(last, lang)
  }

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    return { text: data.text }
  } catch {
    return {
      text: lang === 'ko'
        ? '답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.'
        : 'Could not get an answer. Please try again.',
    }
  }
}

export function isMockMode() {
  return USE_MOCK
}

export function getChecklist(): ChecklistItem[] {
  return mockChecklist
}