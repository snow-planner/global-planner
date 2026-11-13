import type { VercelRequest, VercelResponse } from '@vercel/node'

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
  if (!SNOWCHAT_ENDPOINT || !SNOWCHAT_API_KEY) {
    return res.status(500).json({ error: 'Server is not configured' })
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

  try {
    const r = await fetch(SNOWCHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SNOWCHAT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, stream: false }),
    })

    if (!r.ok) {
      return res.status(r.status).json({ error: `SNOWCHAT error ${r.status}` })
    }

    const data = await r.json()
    return res.status(200).json({
      text: data.choices?.[0]?.message?.content ?? '',
      credits: data.credits,
    })
  } catch {
    return res.status(502).json({ error: 'Failed to reach SNOWCHAT' })
  }
}