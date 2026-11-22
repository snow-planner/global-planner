import { messages } from '../i18n'
import type { Conditions, ViewLang } from '../types'

// 조건을 "2학년 · 경영학부 · D-2 …" 같은 짧은 칩 글자로 바꿔요
export function conditionChips(c: Conditions, lang: ViewLang): string[] {
  const { common, planner } = messages[lang]
  const C = planner.chips
  return [
    common.year(Number(c.year)),
    c.major.trim(),
    c.visa === 'd2' ? C.d2 : c.visa === 'other' ? C.otherVisa : C.visaNotGiven,
    c.topik === '0' ? C.noTopik : common.topik(c.topik),
    c.track === 'korean' ? C.koreanTrack : C.englishTrack,
    c.entry === 'after' ? C.entryAfter : C.entryBefore,
  ].filter(Boolean) // 전공처럼 비어 있는 값은 칩으로 안 만들어요
}