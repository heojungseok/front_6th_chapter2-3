### 커밋 내역

- 76241f1 — refactor: UI 컴포넌트 FSD 규칙에 맞게 분리 및 배럴 구성
  - 시간: Tue Aug 12 03:33:24 2025
  - 주요 변경
    - `src/components/Header.tsx` → `src/shared/ui/Header.tsx`
    - `src/components/Footer.tsx` → `src/shared/ui/Footer.tsx`
    - `src/components/index.tsx` 제거
    - `src/pages/PostsManagerPage.tsx` 수정(공용 UI 사용 정리)
    - `src/App.tsx` 수정(import 경로 정리)
    - `src/docs/history/step1.md` → `docs/history/step1.md` 위치 정리

### 방금까지 한 작업 목록

- FSD 레이어 정비 및 alias 적용(`@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`)
- 공용 UI 프리미티브를 `@shared/ui`로 집중 배치
- 레이아웃/섹션 성격 컴포넌트(`Header`, `Footer`)를 `@widgets`로 이동
- `@widgets` 배럴(`src/widgets/index.ts`) 도입 및 공개 API 일원화
- `App.tsx` 등에서 import 경로를 배럴 기반으로 정리
- `tsconfig.app.json` 경로 매핑 보완(필요 시 `@widgets` 배럴 경로 추가)
- 문서 경로 정리(`src/docs/history/step1.md` → `docs/history/step1.md`)

# Q. zustand, tanstack query 설정을 지금 꼭 해야할까? 아니면 FSD 구조로 중간 이상 나눈 후에 해도 무방할까?

## 짧은 답: 꼭 지금 다 할 필요 없습니다. FSD로 경계(entities/features/pages)를 먼저 탄탄히 나눈 뒤, TanStack Query·zustand는 점진 도입해도 무방합니다.

추천 흐름

- 1단계(지금): FSD 분리
  - `entities/<domain>/api.ts`로 fetch 로직 이동
  - `entities/<domain>/types.ts`로 타입 정리
  - 페이지/위젯/피처는 이 함수들만 호출
- 2단계(서버 상태 필요해질 때): TanStack Query 도입
  - `@app/providers`에 Provider 추가
  - `entities/<domain>/queries.ts`에 `useXxxQuery` 훅 작성
  - 페이지에서 `useEffect+fetch` → `useQuery`로 점진 교체
- 3단계(상태 공유가 커질 때): zustand 도입
  - 특정 기능 범위 상태: `features/<domain>/<feature>/model/store.ts`
  - 전역 교차 상태: `shared/model` 또는 `app/model` 중 하나로 정책화

언제 미루면 되는가

- 데이터 캐싱/동시요청 중복 방지/무한스크롤/낙관적 업데이트가 당장 필요 없을 때
- 로컬 UI 상태가 컴포넌트 내부로 충분히 관리될 때

언제 지금 하는 게 유리한가

- 목록/검색/페이지네이션/태그 필터처럼 서버 상태가 많고 캐싱·무효화가 필요한 경우(TanStack Query를 빨리)
- 여러 피처 간 상태 공유로 prop drilling이 커지는 경우(zustand를 빨리)

지금 최소 선행만 해두면 좋은 것!

- fetch는 반드시 `entities/api.ts`로 감싸서 사용(나중에 `useQuery`로 바꾸기 쉬움)
- 로딩/에러 UI를 컴포넌트 내부에서만 처리하지 말고, 한 곳(피처/엔티티 레벨)에서 통일

- 요약
  - 필수 아님: FSD 경계 정리 먼저, Query·zustand는 점진 도입 권장.
  - 지금 해두면 좋은 준비: `entities/api.ts`와 타입 정리.
  - 서버 상태가 복잡하면 TanStack Query를 조기 도입, UI 상태 공유가 크면 zustand 조기 도입.
