import { useState, type FormEvent } from 'react'
import { isMockMode, sendMessage } from '../services/planner'
import type { ChatAction, ChatMessage, ViewLang } from '../types'

interface Props {
  lang: ViewLang
  summary: string
  onAction: (action?: ChatAction) => void
}

export default function ChatPanel({ lang, summary, onAction }: Props) {
  const ko = lang === 'ko'
  const mock = isMockMode()

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { role: 'user', text: summary },
    {
      role: 'bot',
      text: ko
        ? '2026-2학기 계획을 만들었어요. 모든 항목을 왼쪽 계획표와 체크리스트에 넣었고, 확인이 필요한 것이 3가지 있어요.'
        : 'Here is your plan for 2026 Fall. I put every item into the plan and checklist on the left. Three things need your confirmation.',
      source: ko
        ? '근거: 유학생서비스팀 사이트 (학업 · 비자 및 체류 · 장학금) · 2026-2학기'
        : 'Sources: 유학생서비스팀 사이트 (학업 · 비자 및 체류 · 장학금) · 2026-2학기',
    },
  ])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  const suggestions = ko
    ? ['다음 학기는?', 'Show in English', '비자 연장 가능할까요?']
    : ['What about next semester?', '한국어로 보여줘', 'Can I extend my visa?']

  const send = async (text: string) => {
    const q = text.trim()
    if (!q || sending) return
    const history: ChatMessage[] = [...messages, { role: 'user', text: q }]
    setMessages(history)
    setDraft('')
    setSending(true)
    const reply = await sendMessage(history, lang)
    setMessages((prev) => [...prev, { role: 'bot', text: reply.text, source: reply.source }])
    setSending(false)
    onAction(reply.action)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(draft)
  }

  return (
    <aside aria-label="Chat with SNOW Planner" className="flex min-w-0 flex-[1_1_340px] flex-col rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[17px] font-bold">{ko ? 'SNOW 플래너와 대화' : 'Chat with SNOW Planner'}</h2>
          <p className="text-xs text-gray-600">
            {mock ? 'Demo mode · mock answers' : 'Live · SNOWCHAT API'} · 2026-2학기 자료
          </p>
        </div>
        <span className={`h-2.5 w-2.5 rounded-full ${mock ? 'bg-gray-400' : 'bg-[#1F9D55]'}`} aria-hidden="true" />
      </div>

      <div role="log" aria-live="polite" className="flex flex-col gap-3.5 p-5">
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="flex flex-col items-end">
              <div className="max-w-[85%] rounded-[14px_14px_4px_14px] bg-brand px-3.5 py-2.5 text-sm leading-relaxed text-white">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex flex-col items-start gap-1">
              <div className="max-w-[90%] whitespace-pre-wrap rounded-[14px_14px_14px_4px] bg-gray-100 px-3.5 py-2.5 text-sm leading-relaxed">
                {m.text}
              </div>
              {m.source && <p className="text-xs leading-relaxed text-gray-600">{m.source}</p>}
            </div>
          ),
        )}
        {sending && <p className="text-sm text-gray-500">{ko ? '답변을 만드는 중…' : 'Thinking…'}</p>}
      </div>

      <div className="mt-auto flex flex-col gap-2.5 px-5 pb-5">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              disabled={sending}
              className="min-h-10 cursor-pointer rounded-full border border-[#C9D5F7] bg-[#F5F7FE] px-3.5 text-[13px] text-brand-dark disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <label htmlFor="f-ask" className="sr-only">
            {ko ? '질문 입력' : 'Ask a question'}
          </label>
          <input
            id="f-ask"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={ko ? '어떤 언어로든 질문하세요' : 'Ask in any language'}
            className="h-12 min-w-0 flex-1 rounded-xl border border-gray-300 px-3.5 text-[15px]"
          />
          <button
            type="submit"
            aria-label={ko ? '보내기' : 'Send'}
            disabled={sending}
            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-brand disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
      </div>
    </aside>
  )
}