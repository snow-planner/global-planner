import type { VercelRequest, VercelResponse } from '@vercel/node'

const CATEGORIES = ['stay', 'academics', 'scholarship']

// SNOWCHAT 답변에서 JSON 객체만 꺼내서 계획 형태가 맞는지 확인해요
function parsePlan(content: string) {
  const cleaned = content.replace(/```(?:json)?/gi, '')
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end <= start) return null

  let data: Record<string, unknown>
  try {
    data = JSON.parse(cleaned.slice(start, end + 1))
  } catch {
    return null
  }
  if (!data || typeof data !== 'object') return null

  const { mustDos, thisSemester, nextSemester, checklist, needsConfirmation } = data
  if (![mustDos, thisSemester, nextSemester, checklist, needsConfirmation].every(Array.isArray)) return null

  const items = (checklist as Record<string, unknown>[])
    .filter((it) => it && typeof it === 'object' && CATEGORIES.includes(it.category as string))
    .map((it, i) => ({
      ...it,
      id: typeof it.id === 'string' && it.id ? it.id : `item-${i + 1}`,
      urgent: typeof it.urgent === 'boolean' ? it.urgent : false,
    }))

  return { mustDos, thisSemester, nextSemester, checklist: items, needsConfirmation }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { SNOWCHAT_PLAN_ENDPOINT, SNOWCHAT_API_KEY, DEMO_ACCESS_CODE } = process.env
  if (!SNOWCHAT_PLAN_ENDPOINT || !SNOWCHAT_API_KEY) {
    return res.status(500).json({ error: 'Server is not configured' })
  }

  // 접근 코드가 설정돼 있으면, 코드가 맞는 요청만 통과
  if (DEMO_ACCESS_CODE && req.headers['x-demo-code'] !== DEMO_ACCESS_CODE) {
    return res.status(401).json({ error: 'Invalid access code' })
  }

  const { conditionsText, language } = req.body ?? {}
  if (typeof conditionsText !== 'string' || !conditionsText.trim() || typeof language !== 'string' || !language.trim()) {
    return res.status(400).json({ error: 'Invalid request' })
  }

  const content =
    `${conditionsText.slice(0, 2000)}\n\n[Create my semester plan. Write every string value in ${language.slice(0, 30)}, ` +
    'except "source", which must stay in the original Korean exactly as written in the documents. Output only the JSON object.]'

  let data: { choices?: { message?: { content?: string } }[]; credits?: unknown }
  try {
    const r = await fetch(SNOWCHAT_PLAN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SNOWCHAT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: [{ role: 'user', content }], stream: false }),
    })

    if (!r.ok) {
      return res.status(r.status).json({ error: `SNOWCHAT error ${r.status}` })
    }

    data = await r.json()
  } catch {
    return res.status(502).json({ error: 'Failed to reach SNOWCHAT' })
  }

  const plan = parsePlan(data.choices?.[0]?.message?.content ?? '')
  if (!plan) {
    return res.status(502).json({ error: 'invalid_json' })
  }

  return res.status(200).json({ plan, credits: data.credits })
}
