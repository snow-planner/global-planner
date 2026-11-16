// 챗봇 답변 맨 끝의 선택지 목록(- 보기, 1. 보기 …)을 찾아 버튼용 글자로 바꿔요.
// 프롬프트는 건드리지 않고 화면에서만 처리해요.

const MAX_CHOICES = 6 // 이보다 많으면 선택지가 아니라 일반 목록으로 봐요
const MIN_CHOICES = 2
const MAX_CHOICE_LENGTH = 30 // 이보다 긴 항목이 있으면 설명 목록으로 봐요

// 목록 한 줄의 앞 기호: "- ", "* ", "• ", "1. ", "1) ", "①" 등
const MARKER = /^\s*(?:[-*•·]|\d{1,2}[.)]|[①-⑩])\s+/

// **굵게**, `코드` 같은 마크다운 꾸밈 기호를 벗겨 순수한 글자만 남겨요
function clean(line: string): string {
  return line
    .replace(MARKER, '')
    .replace(/(\*\*|__|`)/g, '')
    .trim()
}

// 목록 바로 앞 문장이 물음표로 끝나면 "고르라는 질문"으로 봐요 (**굵게** 같은 기호는 무시)
// → "필요 서류: - 여권 - 외국인등록증" 같은 설명 목록은 버튼으로 바꾸지 않아요
function endsWithQuestion(body: string): boolean {
  const lastLine = body.split('\n').filter((l) => l.trim()).pop() ?? ''
  const line = lastLine.replace(/[*_`\s]+$/g, '')
  // 미얀마어는 물음표 대신 의문 어미(လား, လဲ, သလဲ …) + 마침표(။)로 질문을 끝내요
  return /[?？]$/.test(line) || /(လား|လဲ)\s*[။?]?$/.test(line)
}

export interface ParsedChoices {
  body: string // 선택지 목록을 뺀 본문 (마크다운으로 표시)
  choices: string[] // 버튼으로 보여줄 글자 (누르면 이 글자가 그대로 답으로 전송)
}

export function parseChoices(text: string): ParsedChoices {
  const lines = text.replace(/\s+$/, '').split('\n')

  // 맨 끝에서부터 "목록 줄"이 이어지는 구간만 모아요
  let start = lines.length
  while (start > 0 && MARKER.test(lines[start - 1])) start--

  const items = lines.slice(start).map(clean)
  const valid =
    items.length >= MIN_CHOICES &&
    items.length <= MAX_CHOICES &&
    items.every((s) => s.length > 0 && s.length <= MAX_CHOICE_LENGTH)

  // 목록 앞에 질문 문장(? 로 끝남)이 없으면 선택지로 보지 않아요
  const body = lines.slice(0, start).join('\n').trimEnd()
  if (!valid || !body || !endsWithQuestion(body)) return { body: text, choices: [] }

  return { body, choices: items }
}
