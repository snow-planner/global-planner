import { useEffect, useRef, useState, type FormEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { isMockMode, sendMessage } from '../services/planner'
import { messages as dict } from '../i18n'
import type { ChatAction, ChatMessage, Conditions, ViewLang } from '../types'

interface Props {
  lang: ViewLang
  summary: string
  conditions: Conditions
  onAction: (action?: ChatAction) => void
}

export default function ChatPanel({ lang, summary, conditions, onAction }: Props) {
  const T = dict[lang].chat
  const mock = isMockMode()
  const logRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    mock
      ? [
          { role: 'user', text: summary, local: true },
          {
            role: 'bot',
            local: true,
            text: T.mockGreeting,
            source: T.mockSource,
          },
        ]
      : [
          {
            role: 'bot',
            local: true,
            text: T.greeting,
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

  const suggestions = T.suggestions

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
      aria-label={T.title}
      className="flex h-[640px] min-w-0 flex-col rounded-2xl border border-gray-200 bg-white lg:sticky lg:top-6 lg:h-[calc(100vh-48px)] lg:max-h-[900px]"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-200 px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[17px] font-bold">{T.title}</h2>
          <p className="text-xs text-gray-600">
            {mock ? T.demo : T.live} · {T.data}
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
        {sending && <p className="text-sm text-gray-500">{T.thinking}</p>}
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
            {T.askLabel}
          </label>
          <input
            id="f-ask"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={T.placeholder}
            className="h-12 min-w-0 flex-1 rounded-xl border border-gray-300 px-3.5 text-[15px]"
          />
          <button
            type="submit"
            aria-label={T.send}
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