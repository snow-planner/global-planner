import type { ChatMessage, ChatReply, ChecklistItem, Conditions, Plan, ViewLang } from '../types'
import { mockChecklist, mockPlans } from '../mock/plan'
import { mockReply } from '../mock/mockChat'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

const LANG_NAMES: Record<Conditions['lang'], string> = {
  en: 'English', ko: 'Korean', zh: 'Chinese', vi: 'Vietnamese', my: 'Burmese', mn: 'Mongolian',
}

function conditionsText(c: Conditions) {
  const status = { ug: 'Undergraduate', grad: 'Graduate', exchange: 'Exchange student', lang: 'Korean language program' }[c.status]
  const visa = { d2: 'D-2', other: 'Other', none: 'Prefer not to say' }[c.visa]
  return [
    '[My conditions]',
    `- Student type: ${status}`,
    `- Year: ${c.year}`,
    `- Major: ${c.major}`,
    `- Visa type: ${visa}`,
    `- Korean level: ${c.topik === '0' ? 'No TOPIK' : `TOPIK ${c.topik}`}`,
    `- Entry: ${c.entry === 'after' ? 'From September 2025 onward' : 'Before September 2025'}`,
    `- Course track: ${c.track === 'korean' ? 'Korean track' : 'English track'}`,
    `- Preferred language: ${LANG_NAMES[c.lang]} (use only if my question's language is unclear)`,
    'Use these conditions. Do not ask me for them again.',
  ].join('\n')
}

function getAccessCode() {
  try {
    return localStorage.getItem('snow-planner:code') ?? ''
  } catch {
    return ''
  }
}

function detectLang(text: string): string | null {
  if (/[\uac00-\ud7a3]/.test(text)) return 'Korean'
  if (/[\u4e00-\u9fff]/.test(text)) return 'Chinese'
  if (/[\u1000-\u109f]/.test(text)) return 'Burmese'
  if (/[\u0400-\u04ff]/.test(text)) return 'Mongolian'
  if (/[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(text)) return 'Vietnamese'
  if (/[a-z]/i.test(text)) return 'English'
  return null
}

function replyLanguage(history: ChatMessage[], conditions: Conditions) {
  const userTexts = history.filter((m) => m.role === 'user' && !m.local).map((m) => m.text)
  for (let i = userTexts.length - 1; i >= 0; i--) {
    const found = detectLang(userTexts[i])
    if (found) return found
  }
  return LANG_NAMES[conditions.lang]
}

export async function getPlan(_conditions: Conditions, lang: ViewLang): Promise<Plan> {
  await wait(500)
  return mockPlans[lang] // The plan is still mock data (replace with api/plan.ts later)
}

export async function sendMessage(history: ChatMessage[], lang: ViewLang, conditions: Conditions): Promise<ChatReply> {
  const last = history[history.length - 1]?.text ?? ''

  if (USE_MOCK) {
    await wait(600)
    return mockReply(last, lang)
  }

  const real = history.filter((m) => !m.local).map((m) => ({ ...m }))
  if (real.length > 0) {
    real[0].text = `${conditionsText(conditions)}\n\n${real[0].text}`

    const lastIdx = real.length - 1
    const replyLang = replyLanguage(history, conditions)
    real[lastIdx].text += `\n\n[Reply in ${replyLang}. Keep official Korean terms in Korean in parentheses.]`
  }

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-demo-code': getAccessCode(),
      },
      body: JSON.stringify({ messages: real }),
    })

    if (res.status === 401) {
      return {
        text: lang === 'ko'
          ? '접근 코드가 없어서 답변할 수 없어요. 받은 링크(?code=...)로 다시 들어와 주세요.'
          : 'An access code is required. Please open the link you received (with ?code=...).',
      }
    }
    if (!res.ok) throw new Error(String(res.status))

    const data = await res.json()
    return { text: data.text }
  } catch {
    return {
      text: lang === 'ko' ? '답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.' : 'Could not get an answer. Please try again.',
    }
  }
}

export function isMockMode() {
  return USE_MOCK
}

export function getChecklist(): ChecklistItem[] {
  return mockChecklist
}