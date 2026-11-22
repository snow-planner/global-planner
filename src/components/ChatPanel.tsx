import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { isMockMode, sendMessage } from '../services/planner'
import { messages as dict } from '../i18n'
import { getDashboardText } from '../i18n/dashboard'
import { DATA_TERM, TERMS } from '../constants'
import { parseChoices } from '../utils/choices'
import { ChevronRightIcon, SendIcon, SnowMark } from './icons'
import type { ChatAction, ChatMessage, Conditions, ViewLang } from '../types'

// 화면을 옮겨도 대화가 남도록 브라우저 탭 동안만 저장해요 (탭을 닫으면 사라짐)
const CHAT_KEY = 'snow-planner:chat'

// 저장 형식: { key: 저장 당시 조건(문자열), messages: 대화 }
// 조건이 바뀌면 이전 대화는 새 조건과 맞지 않으니 저장된 대화를 쓰지 않고 새로 시작해요
function readSavedChat(conditionsKey: string): ChatMessage[] | null {
  try {
    const raw = sessionStorage.getItem(CHAT_KEY)
    if (!raw) return null
    const saved: unknown = JSON.parse(raw)
    if (typeof saved !== 'object' || saved === null) return null
    const { key, messages } = saved as { key?: unknown; messages?: unknown }
    if (key !== conditionsKey || !Array.isArray(messages) || messages.length === 0) return null
    return messages as ChatMessage[]
  } catch {
    return null
  }
}

interface Props {
  lang: ViewLang
  summary: string
  chips: string // 첫 화면 안내 문구에 들어가는 조건 요약
  conditions: Conditions
  onAction: (action?: ChatAction) => void
  prefill?: { id: number; text: string } | null // 체크리스트 "물어보기"로 입력창에 채울 질문
  todaySlot?: ReactNode // 첫 화면 아래 "오늘 할 일" 카드
}

export default function ChatPanel({ lang, summary, chips, conditions, onAction, prefill, todaySlot }: Props) {
  const T = dict[lang].chat
  const D = getDashboardText(lang)
  const groups = dict[lang].checklist.groups
  const mock = isMockMode()
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 처음 인사 메시지 (새 대화를 누르면 이 상태로 돌아가요)
  const initialMessages = (): ChatMessage[] =>
    mock
      ? [
          { role: 'user', text: summary, local: true },
          { role: 'bot', local: true, text: T.mockGreeting(TERMS.current), source: T.mockSource(DATA_TERM) },
        ]
      : [{ role: 'bot', local: true, text: T.greeting }]

  // 조건이 같을 때만 저장된 대화를 이어가요 (언어는 대화 중에 바뀔 수 있어서 비교에서 뺐어요)
  const conditionsKey = JSON.stringify(conditions)
  const [messages, setMessages] = useState<ChatMessage[]>(() => readSavedChat(conditionsKey) ?? initialMessages())
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  // "물어보기"로 새 질문이 들어오면 입력창에 채워요 (렌더 중에 상태를 맞추는 방식, useLocalStorage와 같은 패턴)
  const [prefillId, setPrefillId] = useState(prefill?.id ?? 0)
  if (prefill && prefill.id !== prefillId) {
    setPrefillId(prefill.id)
    setDraft(prefill.text)
  }
  useEffect(() => {
    if (prefill) inputRef.current?.focus()
  }, [prefill])

  // 대화가 바뀔 때마다 sessionStorage에 저장
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_KEY, JSON.stringify({ key: conditionsKey, messages }))
    } catch {
      // 저장 실패해도 대화는 계속 가능
    }
  }, [messages, conditionsKey])

  // 새 메시지가 생기면 대화 영역 맨 아래로 스크롤
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  // 사용자가 직접 보낸 질문이 하나도 없으면 첫 화면(추천 질문 카드)을 보여줘요
  const started = messages.some((m) => m.role === 'user' && !m.local)

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

  const resetChat = () => {
    if (sending) return
    setMessages(initialMessages())
    setDraft('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(draft)
  }

  return (
    <section aria-label={T.title} className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 pt-4 lg:px-8">
        <p className="flex items-center gap-2 text-xs text-gray-500">
          <span className={`h-2 w-2 rounded-full ${mock ? 'bg-gray-400' : 'bg-[#1F9D55]'}`} aria-hidden="true" />
          {mock ? T.demo : T.live} · {T.data(DATA_TERM)}
        </p>
        {started && (
          <button
            type="button"
            onClick={resetChat}
            disabled={sending}
            className="h-8 cursor-pointer rounded-lg border border-line bg-white px-3 text-xs font-medium text-gray-700 hover:bg-surface disabled:opacity-50"
          >
            {T.newChat}
          </button>
        )}
      </div>

      <div ref={logRef} role="log" aria-live="polite" className="min-h-0 flex-1 overflow-y-auto px-4 py-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          {!started ? (
            <div className="flex flex-col items-center gap-3 pt-4 text-center lg:pt-14 short:lg:pt-2">
              <SnowMark size={64} className="short:hidden" />
              <h2 className="mt-3 text-2xl font-bold short:mt-0 lg:text-[28px]">{D.homeTitle}</h2>
              <p className="max-w-xl text-[15px] leading-relaxed text-gray-500">{D.homeSub(chips)}</p>
              <div className="mt-6 grid w-full gap-3 short:mt-3 sm:grid-cols-2">
                {D.homeCards.map((card) => (
                  <button
                    key={card.q}
                    type="button"
                    onClick={() => send(card.q)}
                    disabled={sending}
                    className="group flex cursor-pointer flex-col items-start gap-3 rounded-[14px] border border-line bg-white p-5 text-left short:gap-2 short:p-4 transition-colors hover:border-brand disabled:opacity-50"
                  >
                    <span className="rounded bg-surface px-2 py-0.5 text-[11px] font-semibold text-gray-500">{groups[card.cat].title}</span>
                    <span className="flex w-full items-center justify-between gap-2 text-[15px] font-semibold text-ink">
                      {card.q}
                      <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-brand" />
                    </span>
                  </button>
                ))}
              </div>
              {todaySlot}
            </div>
          ) : (
            messages.map((m, i) => {
              // 선택지 버튼은 가장 마지막 봇 답변에만 보여줘요 (답을 보내면 사라짐)
              const isLast = i === messages.length - 1
              const parsed = m.role === 'bot' && isLast && !sending ? parseChoices(m.text) : null
              const shownText = parsed && parsed.choices.length > 0 ? parsed.body : m.text

              if (m.role === 'user') {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] whitespace-pre-wrap rounded-[14px] bg-brand px-4 py-3 text-sm leading-relaxed text-white">{m.text}</div>
                  </div>
                )
              }

              return (
                <div key={i} className="flex items-start gap-3">
                  <SnowMark size={32} />
                  <div className="flex min-w-0 max-w-[85%] flex-col gap-3">
                    <div className="rounded-[14px] border border-line bg-white px-5 py-4">
                      <div className="prose prose-sm max-w-none prose-headings:my-2 prose-headings:text-[15px] prose-p:my-1.5 prose-strong:text-ink prose-ul:my-1.5 prose-li:my-0.5 prose-table:text-xs">
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
                          {shownText}
                        </ReactMarkdown>
                      </div>
                      {m.source && (
                        <p className="mt-3 rounded-r-lg border-l-4 border-brand bg-surface px-4 py-3 text-[13px] leading-relaxed text-gray-700">{m.source}</p>
                      )}
                    </div>
                    {parsed && parsed.choices.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {parsed.choices.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => send(c)}
                            className="min-h-9 cursor-pointer rounded-full border border-brand bg-white px-4 py-1.5 text-left text-[13px] font-semibold text-brand hover:bg-brand-soft"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
          {sending && <p className="pl-11 text-sm text-gray-500">{T.thinking}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="shrink-0 px-4 pb-4 lg:px-8 lg:pb-8 short:lg:pb-4">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-full border border-line bg-white py-2 pl-6 pr-2 focus-within:border-brand">
          <label htmlFor="f-ask" className="sr-only">
            {T.askLabel}
          </label>
          <input
            ref={inputRef}
            id="f-ask"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={T.placeholder}
            className="h-10 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            aria-label={T.send}
            disabled={sending || !draft.trim()}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand text-white disabled:opacity-40"
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </section>
  )
}