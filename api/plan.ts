import type { VercelRequest, VercelResponse } from '@vercel/node'

// SNOWCHAT 호출: 제한 시간을 두고, 일시적으로 실패하면 시간이 남을 때 한 번 더 요청해요
const TIME_BUDGET_MS = 55_000 // vercel.json의 maxDuration(60초)보다 조금 짧게
const RETRY_WITHIN_MS = 20_000 // 첫 요청이 이 시간 안에 실패했을 때만 다시 시도

type SnowchatResult = { ok: true; content: string; credits: unknown } | { ok: false; status: number }

async function requestOnce(endpoint: string, apiKey: string, messages: unknown[], timeoutMs: number): Promise<SnowchatResult> {
  try {
    const r = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, stream: false }),
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (!r.ok) return { ok: false, status: r.status }
    const data = await r.json()
    return { ok: true, content: data.choices?.[0]?.message?.content ?? '', credits: data.credits }
  } catch {
    return { ok: false, status: 504 } // 연결 실패 또는 시간 초과
  }
}

// 5xx·연결 실패, 또는 accept가 거절한 답(예: 깨진 JSON)이면 한 번 더 요청해요
async function callSnowchat(
  endpoint: string,
  apiKey: string,
  messages: unknown[],
  accept?: (content: string) => boolean,
): Promise<SnowchatResult> {
  const started = Date.now()
  const first = await requestOnce(endpoint, apiKey, messages, TIME_BUDGET_MS)
  const shouldRetry = first.ok ? accept !== undefined && !accept(first.content) : first.status >= 500
  const elapsed = Date.now() - started
  if (!shouldRetry || elapsed > RETRY_WITHIN_MS) return first
  return requestOnce(endpoint, apiKey, messages, TIME_BUDGET_MS - elapsed)
}

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

  const result = await callSnowchat(
    SNOWCHAT_PLAN_ENDPOINT,
    SNOWCHAT_API_KEY,
    [{ role: 'user', content }],
    (text) => parsePlan(text) !== null, // JSON이 깨져서 오면 한 번 더 요청
  )
  if (!result.ok) {
    return res.status(result.status).json({ error: `SNOWCHAT error ${result.status}` })
  }

  const plan = parsePlan(result.content)
  if (!plan) {
    return res.status(502).json({ error: 'invalid_json' })
  }

  return res.status(200).json({ plan, credits: result.credits })
}