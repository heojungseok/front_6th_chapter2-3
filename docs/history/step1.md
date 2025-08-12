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
