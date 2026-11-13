import type { ChecklistItem, Plan, ViewLang } from '../types'

export const SRC = {
  edu: '유학생서비스팀 사이트 > 학업 > 외국인유학생 필수교육',
  course: '유학생서비스팀 사이트 > 학업 > 수강신청 및 수강 과목 > 외국인 필수 과목',
  credit: '유학생서비스팀 사이트 > 학업 > 수강신청 및 수강 과목 > 필수 학점',
  grad: '유학생서비스팀 사이트 > 학업 > 학적 변동 > 졸업',
  visa: '유학생서비스팀 사이트 > 비자 및 체류 > 유학(D-2) 비자 연장',
  schol: '유학생서비스팀 사이트 > 캠퍼스생활 > 장학금 > 학부',
}

const OFFICE = '유학생서비스팀 · 2026-2학기'
const OFFICE_GRAD = '학사팀 · 유학생서비스팀 · 2026-2학기'

export const mockChecklist: ChecklistItem[] = [
  { id: 's1', category: 'stay', text: 'Check the D-2 expiry date on your residence card', ko: '외국인등록증', due: 'Now', source: '비자 및 체류 > 유학(D-2) 비자 연장 · 유학생서비스팀', urgent: true },
  { id: 's2', category: 'stay', text: 'Prepare extension documents and confirm them with the office', ko: '유학(D-2) 비자 연장', due: '4 months before expiry', source: '비자 및 체류 > 유학(D-2) 비자 연장 · final review: 출입국·외국인관서', urgent: true },
  { id: 'a1', category: 'academics', text: 'Check which required courses you have completed', ko: '외국인 필수 과목', due: 'Before registration', source: '학업 > 수강신청 및 수강 과목 > 외국인 필수 과목 · 유학생서비스팀', urgent: false },
  { id: 'a2', category: 'academics', text: 'Plan at least 12 credits, excluding P/F courses', ko: '필수 학점', due: 'This semester', source: '학업 > 수강신청 및 수강 과목 > 필수 학점 · 유학생서비스팀', urgent: false },
  { id: 'a3', category: 'academics', text: 'Prepare for TOPIK 4, the Korean-track graduation requirement', ko: '졸업 요건', due: 'Before graduation', source: '학업 > 학적 변동 > 졸업 · 학사팀, 유학생서비스팀', urgent: false },
  { id: 'c1', category: 'scholarship', text: 'Complete Korean Life and Laws Education', ko: '한국생활법령교육', due: 'Announced period', source: '학업 > 외국인유학생 필수교육 · 유학생서비스팀', urgent: true },
  { id: 'c2', category: 'scholarship', text: 'Complete Sexual Violence Prevention Education', ko: '성폭력예방교육', due: 'Announced period', source: '학업 > 외국인유학생 필수교육 · 유학생서비스팀', urgent: true },
  { id: 'c3', category: 'scholarship', text: 'Check scholarship criteria against last semester’s GPA and TOPIK level', ko: '외국인 유학생 장학금(학부)', due: 'Before next semester', source: '캠퍼스생활 > 장학금 > 학부 · 유학생서비스팀', urgent: false },
]

// 목업 계획은 en, ko 만 있어요. 그 밖의 언어는 en 을 씁니다 (mockPlanFor)
export const mockPlans: Record<'en' | 'ko', Plan> = {
  en: {
    mustDos: [
      'Complete the required education (외국인유학생 필수교육)',
      'Earn 12+ credits, excluding P/F (필수 학점)',
      'Prepare for TOPIK 4 (졸업 요건)',
    ],
    thisSemester: [
      { when: 'Within the announced period (by email)', what: 'Complete Korean Life and Laws Education (한국생활법령교육) and Sexual Violence Prevention Education (성폭력예방교육). Missing them excludes you from next semester’s scholarship.', source: SRC.edu, office: OFFICE },
      { when: 'During course registration', what: 'Check which required courses for international students (외국인 필수 과목) you have completed. The requirement is 12 credits in total.', source: SRC.course, office: OFFICE },
      { when: 'This semester', what: 'If you receive the continuing scholarship (재학 장학금), earn at least 12 credits excluding P/F courses.', source: SRC.credit, office: OFFICE },
      { when: 'This semester', what: 'Work toward TOPIK 4 or higher, the graduation requirement for the Korean track (졸업 요건).', source: SRC.grad, office: OFFICE_GRAD },
      { when: 'From 4 months before expiry', what: 'Check the documents and timing for your D-2 extension (유학(D-2) 비자 연장).', source: SRC.visa, office: '유학생서비스팀 · final review: 출입국·외국인관서' },
    ],
    nextSemester: [
      { when: 'During course registration', what: 'Register for any required courses for international students (외국인 필수 과목) you still need. The course list can change each semester.', source: SRC.course, office: OFFICE },
      { when: 'Within the announced period (by email)', what: 'Complete both required education courses (외국인유학생 필수교육) again for that semester.', source: SRC.edu, office: OFFICE },
      { when: 'Before the semester starts', what: 'Check the undergraduate scholarship criteria (외국인 유학생 장학금(학부)) against last semester’s GPA and your TOPIK level.', source: SRC.schol, office: OFFICE },
      { when: 'Next semester', what: 'Keep at least 12 credits excluding P/F courses if you receive the scholarship (필수 학점).', source: SRC.credit, office: OFFICE },
      { when: 'Next semester', what: 'Keep working toward TOPIK 4 or higher (졸업 요건).', source: SRC.grad, office: OFFICE_GRAD },
    ],
    needsConfirmation: [
      'We do not know which required courses you have already completed. Check your academic record.',
      'The 2026 TOPIK application periods in our guide have passed. Check the next test schedule.',
      'D-2 extension documents can differ by case. Confirm with 유학생서비스팀 or the immigration office (출입국·외국인관서).',
    ],
    checklist: mockChecklist,
  },
  ko: {
    mustDos: [
      '외국인유학생 필수교육 이수',
      'P/F 제외 12학점 이상 취득 (필수 학점)',
      'TOPIK 4급 준비 (졸업 요건)',
    ],
    thisSemester: [
      { when: '안내 기간 내 (이메일 안내)', what: '한국생활법령교육과 성폭력예방교육을 이수하세요. 미이수 시 다음 학기 장학금 대상에서 제외됩니다.', source: SRC.edu, office: OFFICE },
      { when: '수강신청 기간', what: '이미 이수한 외국인 필수 과목을 확인하세요. 총 12학점이 필요합니다.', source: SRC.course, office: OFFICE },
      { when: '이번 학기', what: '재학 장학금 수혜 중이라면 P/F 과목을 제외하고 12학점 이상 취득하세요.', source: SRC.credit, office: OFFICE },
      { when: '이번 학기', what: '한국어 트랙 졸업 요건인 TOPIK 4급 이상을 목표로 준비하세요.', source: SRC.grad, office: OFFICE_GRAD },
      { when: '만료 4개월 전부터', what: '유학(D-2) 비자 연장 서류와 신청 시기를 확인하세요.', source: SRC.visa, office: '유학생서비스팀 · 최종 심사: 출입국·외국인관서' },
    ],
    nextSemester: [
      { when: '수강신청 기간', what: '남은 외국인 필수 과목을 신청하세요. 외국인 전용 과목 목록은 학기마다 바뀔 수 있습니다.', source: SRC.course, office: OFFICE },
      { when: '안내 기간 내 (이메일 안내)', what: '해당 학기 외국인유학생 필수교육 두 과정을 다시 이수하세요.', source: SRC.edu, office: OFFICE },
      { when: '학기 시작 전', what: '직전 학기 성적과 TOPIK 급수로 외국인 유학생 장학금(학부) 기준을 확인하세요.', source: SRC.schol, office: OFFICE },
      { when: '다음 학기', what: '장학금 수혜 중이라면 P/F 제외 12학점 이상을 유지하세요.', source: SRC.credit, office: OFFICE },
      { when: '다음 학기', what: 'TOPIK 4급 이상 취득을 계속 준비하세요.', source: SRC.grad, office: OFFICE_GRAD },
    ],
    needsConfirmation: [
      '이미 이수한 외국인 필수 과목은 확인되지 않았어요. 성적 기록에서 확인하세요.',
      '자료에 안내된 2026년 TOPIK 접수 기간은 지났어요. 다음 시험 일정을 확인하세요.',
      'D-2 연장 서류는 개인 상황에 따라 다를 수 있어요. 유학생서비스팀 또는 관할 출입국·외국인관서에 확인하세요.',
    ],
    checklist: mockChecklist,
  },
}

export function mockPlanFor(lang: ViewLang): Plan {
  return mockPlans[lang === 'ko' ? 'ko' : 'en']
}
