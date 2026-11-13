import type { ChatReply, ViewLang } from '../types'
import { SRC } from './plan'

export function mockReply(input: string, lang: ViewLang): ChatReply {
  const q = input.toLowerCase()
  const ko = lang === 'ko'

  if (q.includes('english')) {
    return { text: 'Switched to English. Official terms stay in Korean so you can find them on the school website.', action: { type: 'setLang', lang: 'en' } }
  }
  if (input.includes('한국어')) {
    return { text: '한국어로 바꿨어요. 왼쪽 화면도 한국어로 바뀌었어요.', action: { type: 'setLang', lang: 'ko' } }
  }
  if (q.includes('next') || input.includes('다음 학기')) {
    return {
      text: ko ? '2027-1학기 계획으로 바꿨어요. 왼쪽 계획표를 확인하세요.' : 'Here is your plan for 2027 Spring. I switched the plan on the left.',
      source: (ko ? '근거: ' : 'Source: ') + SRC.course,
      action: { type: 'setTab', tab: 'next' },
    }
  }
  if (q.includes('this semester') || input.includes('이번 학기')) {
    return {
      text: ko ? '이번 학기 계획으로 바꿨어요.' : 'Here is your plan for this semester again.',
      action: { type: 'setTab', tab: 'this' },
    }
  }
  if (q.includes('visa') || q.includes('extend') || input.includes('비자')) {
    return {
      text: ko
        ? '연장 승인 여부는 판단할 수 없어요. 체류만료일 4개월 전부터 신청할 수 있고, 내 상황에 필요한 서류는 유학생서비스팀이나 관할 출입국·외국인관서에 꼭 확인하세요.'
        : 'I cannot judge whether your extension will be approved. You can apply from 4 months before your expiry date. Please confirm the documents for your case with 유학생서비스팀 or the immigration office.',
      source: (ko ? '근거: ' : 'Source: ') + SRC.visa + ' · 유학생서비스팀',
    }
  }
  return {
    text: ko
      ? '(데모) 실제 서비스에서는 이 질문이 SNOWCHAT API로 전달되고, 답변이 여기에 표시돼요.'
      : '(Demo) In the real app, this question goes to the SNOWCHAT API and the answer appears here.',
  }
}