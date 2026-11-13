import type { Plan } from '../types'

export const mockPlan: Plan = {
  thisSemester: [
    {
      when: 'Within the announced period (by email)',
      what: 'Complete 한국생활법령교육 and 성폭력예방교육. Missing them excludes you from next semester’s scholarship.',
      source: '유학생서비스팀 사이트 > 학업 > 외국인유학생 필수교육',
      office: '유학생서비스팀 · 2026-2학기',
    },
    // ...
  ],
  nextSemester: [
    // ...
  ],
  checklist: [
    {
      id: 's1',
      category: 'stay',
      text: 'Check the D-2 expiry date on your residence card',
      ko: '외국인등록증',
      due: 'Now',
      source: '비자 및 체류 > 유학(D-2) 비자 연장 · 유학생서비스팀',
    },
    // ...
  ],
  needsConfirmation: [
    'We do not know which required courses you have already completed.',
    // ...
  ],
}