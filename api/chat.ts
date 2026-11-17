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

interface IncomingMessage {
  role: 'user' | 'bot'
  text: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { SNOWCHAT_ENDPOINT, SNOWCHAT_API_KEY, DEMO_ACCESS_CODE } = process.env
  if (!SNOWCHAT_ENDPOINT || !SNOWCHAT_API_KEY) {
    return res.status(500).json({ error: 'Server is not configured' })
  }

  // 접근 코드가 설정돼 있으면, 코드가 맞는 요청만 통과
  if (DEMO_ACCESS_CODE && req.headers['x-demo-code'] !== DEMO_ACCESS_CODE) {
    return res.status(401).json({ error: 'Invalid access code' })
  }

  const history = (req.body?.messages ?? []) as IncomingMessage[]
  if (!Array.isArray(history) || history.length === 0 || history.length > 30) {
    return res.status(400).json({ error: 'Invalid messages' })
  }

  // SNOWCHAT은 대화를 저장하지 않아서, 매번 이전 대화 전체를 보내야 해요
  const messages = history
    .filter((m) => typeof m?.text === 'string' && m.text.trim())
    .map((m) => ({
      role: m.role === 'bot' ? 'assistant' : 'user',
      content: m.text.slice(0, 2000),
    }))

  const result = await callSnowchat(SNOWCHAT_ENDPOINT, SNOWCHAT_API_KEY, messages)
  if (!result.ok) {
    return res.status(result.status).json({ error: `SNOWCHAT error ${result.status}` })
  }

  return res.status(200).json({ text: result.content, credits: result.credits })
}