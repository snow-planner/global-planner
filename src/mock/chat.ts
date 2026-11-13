export type ChatAction = { type: 'setTab'; tab: 'this' | 'next' } | { type: 'setLang'; lang: 'en' | 'ko' }

export interface ChatReply {
  text: string
  source?: string
  action?: ChatAction
}

export function mockReply(input: string): ChatReply {
  const q = input.toLowerCase()

  if (q.includes('next') || input.includes('다음 학기')) {
    return { text: 'Here is your plan for next semester.', action: { type: 'setTab', tab: 'next' } }
  }
  if (input.includes('한국어')) {
    return { text: '한국어로 바꿨어요.', action: { type: 'setLang', lang: 'ko' } }
  }
  if (q.includes('visa') || input.includes('비자')) {
    return {
      text: 'I cannot judge whether your extension will be approved. You can apply from 4 months before expiry. Please confirm with 유학생서비스팀.',
      source: '유학생서비스팀 사이트 > 비자 및 체류 > 유학(D-2) 비자 연장',
    }
  }
  return { text: '(Demo) In the real app, this question goes to the SNOWCHAT API.' }
}