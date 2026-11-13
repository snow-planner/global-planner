import { useEffect, useRef, useState, type FormEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { isMockMode, sendMessage } from '../services/planner'
import type { ChatAction, ChatMessage, Conditions, ViewLang } from '../types'

interface Props {
  lang: ViewLang
  summary: string
  conditions: Conditions
  onAction: (action?: ChatAction) => void
}

export default function ChatPanel({ lang, summary, conditions, onAction }: Props) {
  const ko = lang === 'ko'
  const mock = isMockMode()
  const logRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    mock
      ? [
          { role: 'user', text: summary, local: true },
          {
            role: 'bot',
            local: true,
            text: ko
              ? '2026-2학기 계획을 만들었어요. 모든 항목을 왼쪽 계획표와 체크리스트에 넣었고, 확인이 필요한 것이 3가지 있어요.'
              : 'Here is your plan for 2026 Fall. I put every item into the plan and checklist on the left. Three things need your confirmation.',
            source: ko
              ? '근거: 유학생서비스팀 사이트 (학업 · 비자 및 체류 · 장학금) · 2026-2학기'
              : 'Sources: 유학생서비스팀 사이트 (학업 · 비자 및 체류 · 장학금) · 2026-2학기',
          },
        ]
      : [
          {
            role: 'bot',
            local: true,
            text: ko
              ? '입력한 조건으로 답해 드릴게요. 학업, 체류, 장학에 대해 궁금한 걸 물어보세요.'
              : 'I will answer based on the conditions you entered. Ask me anything about academics, stay, or scholarships.',
          },
        ],
  )
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  // 새 메시지가 생기면 대화 영역 맨 아래로 스크롤
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

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
    const reply = await sendMessage(history, lang, conditions)
    setMessages((prev) => [...prev, { role: 'bot', text: reply.text, source: reply.source }])
    setSending(false)
    onAction(reply.action)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(draft)
  }

  return (
    <aside
      aria-label="Chat with SNOW Planner"
      className="flex h-[600px] min-w-0 flex-[1_1_340px] flex-col rounded-2xl border border-gray-200 bg-white lg:sticky lg:top-6 lg:h-[calc(100vh-48px)] lg:max-h-[820px]"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-200 px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[17px] font-bold">{ko ? 'SNOW 플래너와 대화' : 'Chat with SNOW Planner'}</h2>
          <p className="text-xs text-gray-600">
            {mock ? 'Demo mode · mock answers' : 'Live · SNOWCHAT API'} · 2026-2학기 자료
          </p>
        </div>
        <span className={`h-2.5 w-2.5 rounded-full ${mock ? 'bg-gray-400' : 'bg-[#1F9D55]'}`} aria-hidden="true" />
      </div>

      <div ref={logRef} role="log" aria-live="polite" className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto p-5">
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="flex flex-col items-end">
              <div className="max-w-[85%] whitespace-pre-wrap rounded-[14px_14px_4px_14px] bg-brand px-3.5 py-2.5 text-sm leading-relaxed text-white">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex flex-col items-start gap-1">
              <div className="prose prose-sm max-w-[95%] rounded-[14px_14px_14px_4px] bg-gray-100 px-3.5 py-2.5 prose-headings:my-2 prose-headings:text-[15px] prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-table:text-xs">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ children }) => (
                      <div className="overflow-x-auto">
                        <table>{children}</table>
                      </div>
                    ),
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              </div>
              {m.source && <p className="text-xs leading-relaxed text-gray-600">{m.source}</p>}
            </div>
          ),
        )}
        {sending && <p className="text-sm text-gray-500">{ko ? '답변을 만드는 중…' : 'Thinking…'}</p>}
      </div>

      <div className="flex shrink-0 flex-col gap-2.5 border-t border-gray-100 px-5 py-4">
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