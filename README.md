# SNOW 글로벌 플래너 (SNOW Global Planner)

숙명여대 외국인 유학생이 학년·전공·비자 유형·한국어 수준을 입력하면, 유학생서비스팀 자료 중 해당하는 요건만 골라 학기별 계획표와 체크리스트로 정리해 주는 웹앱입니다.

2026 SNOWCHAT AI 서비스 경진대회 · 팀 플랜짜송

🔗 https://snow-global-planner.vercel.app

## 주요 기능
- **조건 입력**: 응답 언어, 학적, 학년, 전공, TOPIK, 입학 시기, 수업 트랙, 비자 유형
- **학기별 계획표**: 이번 학기·다음 학기 할 일을 근거 메뉴 경로·담당 부서와 함께 표시
- **요약 카드**: 비자 만료 D-day, 체크리스트 진행률, 이번 학기 꼭 할 일
- **체크리스트**: 체류·학업·장학별 항목, 체크 상태는 브라우저에만 저장
- **채팅**: SNOWCHAT 챗봇과 대화, 입력한 조건을 자동으로 함께 전달, 질문한 언어로 답변
- **다국어**: 한국어·영어·중국어·베트남어·미얀마어·몽골어, 학교 공식 용어는 한국어 병기

## 구조
```
React 웹앱 (화면, 조건·체크 상태는 브라우저에만 저장)
   ↓
Vercel 서버리스 함수
   - api/chat.ts → 대화용 SNOWCHAT 챗봇
   - api/plan.ts → 계획 생성용 JSON 챗봇
   ↓
SNOWCHAT Studio 챗봇 (유학생서비스팀 공개 자료 기반)
```
- 별도 백엔드 서버와 DB는 없고, 사용자 정보를 서버에 저장하지 않습니다.
- SNOWCHAT API 키는 서버리스 함수에만 있고 브라우저에 노출되지 않습니다.

## 기술 스택
React · TypeScript · Vite · Tailwind CSS · Vercel Functions · SNOWCHAT API

## 로컬 실행
```cmd
npm install
npm run dev
```
- `npm run dev`는 목업 데이터로 화면만 실행합니다.
- 실제 SNOWCHAT API까지 테스트하려면 Vercel CLI로 환경변수를 받은 뒤 실행합니다.
```cmd
vercel env pull .env.local
vercel dev
```

## 환경변수 (Vercel)
| 이름 | 설명 |
|---|---|
| `SNOWCHAT_ENDPOINT` | 대화용 챗봇 엔드포인트 |
| `SNOWCHAT_PLAN_ENDPOINT` | 계획 생성용 JSON 챗봇 엔드포인트 |
| `SNOWCHAT_API_KEY` | SNOWCHAT API 키 |
| `DEMO_ACCESS_CODE` | 접근 코드 (설정 시 코드가 맞는 요청만 API 호출) |
| `VITE_USE_MOCK` | `false`면 실제 API 사용 |

## 안내
본 서비스는 유학생서비스팀 공개 자료(2026-2학기 기준)를 바탕으로 한 안내이며 공식 결정이 아닙니다. 최종 확인은 유학생서비스팀 또는 관할 출입국·외국인관서에서 해 주세요.
