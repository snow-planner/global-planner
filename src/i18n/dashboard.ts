// 대시보드 레이아웃에서 새로 쓰는 문구 (기계 번역 초안: 원어민 검토 필요)
// 미얀마어(my)는 아직 없어서 영어로 보여 줘요
import type { ChecklistItem, ViewLang } from '../types'

type Category = ChecklistItem['category']

export interface DashboardText {
  brand: string
  brandSub: string
  menu: string
  nav: { chat: string; plan: string; checklist: string; conditions: string }
  myConditions: string
  editConditions: string
  footer: string
  chatTitle: string
  chatSub: string
  dday: (n: number) => string
  langSelect: string
  close: string
  ask: string
  askTemplate: (item: string) => string
  all: string
  planTitle: string
  checklistTitle: string
  viewPlan: string
  homeTitle: string
  homeSub: (summary: string) => string
  homeCards: { cat: Category; q: string }[]
  today: string
  openChecklist: string
  modalTitle: string
  modalDesc: string
  cancel: string
  save: string
  heroTitle: string
  heroFeatures: string[]
}

const ko: DashboardText = {
  brand: 'SNOW 글로벌 플래너',
  brandSub: '숙명 유학생을 위한',
  menu: 'MENU',
  nav: { chat: '질문하기', plan: '내 계획', checklist: '체크리스트', conditions: '내 조건 수정' },
  myConditions: '내 조건',
  editConditions: '조건 수정하기 →',
  footer: '학교 규정 기반 안내 · 최종 확인은 담당 부서',
  chatTitle: '질문하기',
  chatSub: '모르는 건 모국어로 물어보세요',
  dday: (n) => `비자 만료 D-${n}`,
  langSelect: '화면 언어',
  close: '닫기',
  ask: '물어보기',
  askTemplate: (item) => `"${item}" 자세히 알려줘`,
  all: '전체',
  planTitle: '내 계획',
  checklistTitle: '체크리스트',
  viewPlan: '학기별 계획 전체 보기 →',
  homeTitle: '무엇이 궁금하세요?',
  homeSub: (s) => `입력한 조건(${s})에 맞춰 학교 규정으로 답해 드려요`,
  homeCards: [
    { cat: 'stay', q: '비자 연장은 언제부터 신청해?' },
    { cat: 'academics', q: '다음 학기 최소 몇 학점 들어야 해?' },
    { cat: 'stay', q: '유학생 보험은 꼭 들어야 해?' },
    { cat: 'scholarship', q: '유학생이 받을 수 있는 장학금은?' },
  ],
  today: '오늘 할 일',
  openChecklist: '체크리스트',
  modalTitle: '내 조건 수정',
  modalDesc: '바꾸면 계획과 체크리스트를 새 조건으로 다시 만들어요.',
  cancel: '취소',
  save: '저장하고 다시 만들기',
  heroTitle: '내 조건에 맞춘\n유학생 학기 플래너',
  heroFeatures: ['학기별 계획표', '마감일 체크리스트 · 비자 D-day', '6개 언어로 질문하기'],
}

const en: DashboardText = {
  brand: 'SNOW Global Planner',
  brandSub: 'For Sookmyung international students',
  menu: 'MENU',
  nav: { chat: 'Ask', plan: 'My plan', checklist: 'Checklist', conditions: 'Edit conditions' },
  myConditions: 'My conditions',
  editConditions: 'Edit →',
  footer: 'Based on school rules · Confirm with the office',
  chatTitle: 'Ask',
  chatSub: 'Ask in your own language',
  dday: (n) => `Visa expires D-${n}`,
  langSelect: 'Screen language',
  close: 'Close',
  ask: 'Ask',
  askTemplate: (item) => `Tell me more about "${item}"`,
  all: 'All',
  planTitle: 'My plan',
  checklistTitle: 'Checklist',
  viewPlan: 'See full semester plan →',
  homeTitle: 'What would you like to know?',
  homeSub: (s) => `Answers follow school rules for your conditions (${s})`,
  homeCards: [
    { cat: 'stay', q: 'When can I apply for a visa extension?' },
    { cat: 'academics', q: 'How many credits do I need next semester?' },
    { cat: 'stay', q: 'Do I need student health insurance?' },
    { cat: 'scholarship', q: 'What scholarships can I get?' },
  ],
  today: "Today's to-do",
  openChecklist: 'Checklist',
  modalTitle: 'Edit conditions',
  modalDesc: 'Your plan and checklist will be rebuilt with the new conditions.',
  cancel: 'Cancel',
  save: 'Save and rebuild',
  heroTitle: 'A semester planner\nmade for your conditions',
  heroFeatures: ['Semester plan', 'Deadline checklist · visa D-day', 'Ask in 6 languages'],
}

const zh: DashboardText = {
  brand: 'SNOW Global Planner',
  brandSub: '为淑明留学生打造',
  menu: 'MENU',
  nav: { chat: '提问', plan: '我的计划', checklist: '清单', conditions: '修改条件' },
  myConditions: '我的条件',
  editConditions: '修改 →',
  footer: '依据学校规定 · 最终请向负责部门确认',
  chatTitle: '提问',
  chatSub: '用母语提问即可',
  dday: (n) => `签证到期 D-${n}`,
  langSelect: '界面语言',
  close: '关闭',
  ask: '提问',
  askTemplate: (item) => `请详细说明“${item}”`,
  all: '全部',
  planTitle: '我的计划',
  checklistTitle: '清单',
  viewPlan: '查看完整学期计划 →',
  homeTitle: '想了解什么？',
  homeSub: (s) => `根据你的条件（${s}）按学校规定回答`,
  homeCards: [
    { cat: 'stay', q: '签证延期什么时候可以申请？' },
    { cat: 'academics', q: '下学期至少要修多少学分？' },
    { cat: 'stay', q: '留学生必须买保险吗？' },
    { cat: 'scholarship', q: '留学生能申请哪些奖学金？' },
  ],
  today: '今日待办',
  openChecklist: '清单',
  modalTitle: '修改条件',
  modalDesc: '修改后会按新条件重新生成计划和清单。',
  cancel: '取消',
  save: '保存并重新生成',
  heroTitle: '按你的条件定制的\n留学生学期规划',
  heroFeatures: ['学期计划表', '截止日期清单 · 签证倒计时', '6种语言提问'],
}

const vi: DashboardText = {
  brand: 'SNOW Global Planner',
  brandSub: 'Dành cho du học sinh Sookmyung',
  menu: 'MENU',
  nav: { chat: 'Hỏi đáp', plan: 'Kế hoạch', checklist: 'Danh sách việc', conditions: 'Sửa điều kiện' },
  myConditions: 'Điều kiện của tôi',
  editConditions: 'Sửa →',
  footer: 'Theo quy định của trường · Hãy xác nhận với phòng phụ trách',
  chatTitle: 'Hỏi đáp',
  chatSub: 'Hãy hỏi bằng ngôn ngữ của bạn',
  dday: (n) => `Visa hết hạn D-${n}`,
  langSelect: 'Ngôn ngữ hiển thị',
  close: 'Đóng',
  ask: 'Hỏi',
  askTemplate: (item) => `Cho tôi biết thêm về "${item}"`,
  all: 'Tất cả',
  planTitle: 'Kế hoạch',
  checklistTitle: 'Danh sách việc',
  viewPlan: 'Xem toàn bộ kế hoạch học kỳ →',
  homeTitle: 'Bạn muốn biết điều gì?',
  homeSub: (s) => `Trả lời theo quy định của trường cho điều kiện của bạn (${s})`,
  homeCards: [
    { cat: 'stay', q: 'Khi nào có thể xin gia hạn visa?' },
    { cat: 'academics', q: 'Học kỳ sau cần học tối thiểu bao nhiêu tín chỉ?' },
    { cat: 'stay', q: 'Du học sinh có bắt buộc mua bảo hiểm không?' },
    { cat: 'scholarship', q: 'Du học sinh có thể nhận học bổng nào?' },
  ],
  today: 'Việc hôm nay',
  openChecklist: 'Danh sách',
  modalTitle: 'Sửa điều kiện',
  modalDesc: 'Kế hoạch và danh sách việc sẽ được tạo lại theo điều kiện mới.',
  cancel: 'Hủy',
  save: 'Lưu và tạo lại',
  heroTitle: 'Kế hoạch học kỳ\ntheo điều kiện của bạn',
  heroFeatures: ['Kế hoạch học kỳ', 'Danh sách hạn chót · D-day visa', 'Hỏi bằng 6 ngôn ngữ'],
}

const mn: DashboardText = {
  brand: 'SNOW Global Planner',
  brandSub: 'Сукмёнгийн гадаад оюутнуудад',
  menu: 'MENU',
  nav: { chat: 'Асуух', plan: 'Миний төлөвлөгөө', checklist: 'Шалгах жагсаалт', conditions: 'Нөхцөл засах' },
  myConditions: 'Миний нөхцөл',
  editConditions: 'Засах →',
  footer: 'Сургуулийн журамд үндэслэсэн · Хариуцсан албанаас лавлана уу',
  chatTitle: 'Асуух',
  chatSub: 'Өөрийн хэлээр асуугаарай',
  dday: (n) => `Виз дуусах D-${n}`,
  langSelect: 'Дэлгэцийн хэл',
  close: 'Хаах',
  ask: 'Асуух',
  askTemplate: (item) => `"${item}"-ийн талаар дэлгэрэнгүй хэлээч`,
  all: 'Бүгд',
  planTitle: 'Миний төлөвлөгөө',
  checklistTitle: 'Шалгах жагсаалт',
  viewPlan: 'Улирлын төлөвлөгөөг бүтнээр харах →',
  homeTitle: 'Юу мэдэхийг хүсэж байна вэ?',
  homeSub: (s) => `Таны нөхцөлд (${s}) тохируулан сургуулийн журмаар хариулна`,
  homeCards: [
    { cat: 'stay', q: 'Визийн сунгалтыг хэзээнээс хүсэх вэ?' },
    { cat: 'academics', q: 'Дараагийн улиралд хамгийн багадаа хэдэн кредит авах вэ?' },
    { cat: 'stay', q: 'Гадаад оюутан даатгалд заавал хамрагдах уу?' },
    { cat: 'scholarship', q: 'Ямар тэтгэлэг авч болох вэ?' },
  ],
  today: 'Өнөөдрийн ажил',
  openChecklist: 'Жагсаалт',
  modalTitle: 'Нөхцөл засах',
  modalDesc: 'Шинэ нөхцөлөөр төлөвлөгөө, жагсаалтыг дахин гаргана.',
  cancel: 'Болих',
  save: 'Хадгалаад дахин гаргах',
  heroTitle: 'Таны нөхцөлд тохирсон\nулирлын төлөвлөгөө',
  heroFeatures: ['Улирлын төлөвлөгөө', 'Хугацааны жагсаалт · визийн D-day', '6 хэлээр асуух'],
}

const dashboard: Partial<Record<ViewLang, DashboardText>> = { ko, en, zh, vi, mn }

export function getDashboardText(lang: ViewLang): DashboardText {
  return dashboard[lang] ?? en
}