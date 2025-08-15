PR 요약 파일들을 확인해서 프로젝트 진행 과정에서 애쓴 부분들을 파악해보겠습니다.

Read file: docs/pr/summary1.md
Read file: docs/pr/summary2.md
PR 요약 파일들을 분석한 결과, 이번 프로젝트에서 **정말 많은 노력과 애를 쓴 부분들**을 파악할 수 있습니다.

# 🎯 **프로젝트 진행 과정에서 애쓴 핵심 부분들**

## 🧠 **1. 아키텍처적 사고의 전환**

### **상태 관리에서 도메인 분리까지의 깊은 사고**

```typescript
// Before: 모든 상태가 한 곳에 섞여있음
const [posts, setPosts] = useState<post[]>([])
const [comments, setComments] = useState<Comment[]>([])
const [tags, setTags] = useState<Tag[]>([])
const [users, setUsers] = useState<User[]>([])
const [loading, setLoading] = useState(false)
const [showAddDialog, setShowAddDialog] = useState(false)

// After: 도메인별로 상태를 분리하고 엔티티로 구조화
@entities/post/     # 게시물 도메인
@entities/comment/  # 댓글 도메인
@entities/tag/      # 태그 도메인
@entities/user/     # 사용자 도메인
```

**애쓴 부분**:

- 단순한 상태 관리에서 **도메인 중심 사고**로 전환
- **"상태를 나누면 엔티티가 보인다"**는 깊은 인사이트 도출
- 복잡한 상태를 **논리적 그룹핑**으로 정리

## ��️ **2. FSD 아키텍처의 체계적 구현**

### **레이어별 책임 분리의 철저한 적용**

```
src/
├── app/          # 애플리케이션 설정
├── pages/        # 페이지 컴포넌트
├── widgets/      # 복합 UI 컴포넌트
├── features/     # 비즈니스 로직
├── entities/     # 도메인 모델
└── shared/       # 공통 유틸리티
```

**애쓴 부분**:

- **이론적 FSD 개념**을 **실제 코드 구조**로 구현
- 각 레이어의 **의존성 방향**을 명확히 설정
- **Import alias**를 통한 깔끔한 구조화

## ⚙️ **3. 비즈니스 로직 분리의 노력**

### **Features 레이어를 통한 로직 캡슐화**

```typescript
// 비즈니스 로직을 UI 컴포넌트에서 분리하려는 시도
export const usePostActions = () => {
  const { setPosts, setTotal, setLoading } = usePostStore()

  const fetchPosts = async (limit: number, skip: number) => {
    setLoading(true)
    try {
      const data = await postApi.fetchPosts(limit, skip)
      setPosts(data.posts as Post[])
      setTotal(data.total as number)
      return data
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { fetchPosts, searchPosts, fetchPostsByTag, createPost, updatePost, deletePost }
}
```

**애쓴 부분**:

- **함수형 프로그래밍** 철학 적용
- **순수 함수**들을 통한 비즈니스 로직 분리
- **에러 처리**와 **로딩 상태** 관리의 체계화

## �� **4. 상태 관리의 체계적 접근**

### **Zustand를 활용한 도메인별 상태 분리**

```typescript
// 각 도메인별로 상태를 체계적으로 분리
export const useCommentStore = create<CommentsState>((set) => ({
  comments: {},
  selectedComment: null,
  newComment: { body: "", postId: null, userId: 1 },

  addComment: (comment) =>
    set((state) => ({
      comments: { ...state.comments, [comment.postId]: [...(state.comments[comment.postId] || []), comment] },
    })),

  updateComment: (comment) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [comment.postId]: state.comments[comment.postId]?.map((c) => (c.id === comment.id ? comment : c)) || [],
      },
    })),
}))
```

**애쓴 부분**:

- **복잡한 상태 구조**를 **논리적 단위**로 분해
- **불변성**을 고려한 상태 업데이트 로직 구현
- **도메인별 상태**의 **독립성** 확보

## 🎨 **5. 컴포넌트 구조화의 노력**

### **재사용 가능한 컴포넌트 설계**

```typescript
// 모달 컴포넌트들의 체계적 분리
@widgets/modals/
├── AddPostModal.tsx
├── EditPostModal.tsx
├── AddCommentModal.tsx
├── EditCommentModal.tsx
├── PostDetailModal.tsx
└── UserModal.tsx

// 테이블 컴포넌트의 구조화
@widgets/posts/
├── PostsTable.tsx
└── index.ts
```

**애쓴 부분**:

- **UI 컴포넌트**를 **논리적 단위**로 분리
- **Props 인터페이스**를 통한 **명확한 계약** 정의
- **컴포넌트 조합**을 통한 **복잡한 UI** 구성

## �� **6. TypeScript 활용의 깊이**

### **타입 안전성을 위한 체계적 접근**

```typescript
// 도메인별 타입 정의의 체계화
export type Post = {
  author: UserSlime
  body: string
  createdAt: string
  id: number
  reactions: Reaction
  tags: Tag[]
  title: string
  updatedAt: string
}

export type CreatePostRequest = {
  body: string
  tagIds: number[]
  title: string
  userId: number
}

export type UpdatePostRequest = {
  body: string
  id: number
  tagIds: number[]
  title: string
}
```

**애쓴 부분**:

- **도메인 모델**과 **API 요청/응답** 타입의 **체계적 정의**
- **타입 안전성**을 통한 **런타임 에러** 방지
- **인터페이스**를 통한 **명확한 계약** 정의

## 📚 **7. 학습과 적용의 노력**

### **FSD 개념의 실제 적용**

**애쓴 부분**:

- **이론적 개념**을 **실제 코드**로 구현하려는 **지속적인 시도**
- **아키텍처 패턴**의 **실무 적용**을 위한 **반복적인 리팩토링**
- **클린 코드 원칙**을 **구체적인 구현**으로 연결

## 🎯 **특히 인상적인 애쓴 부분들**

### **1. 도메인 중심 사고의 전환**

- 단순한 **"상태 관리"**에서 **"도메인 설계"**로 사고 전환
- **"상태를 나누면 엔티티가 보인다"**는 깊은 인사이트

### **2. 체계적 접근**

- **단계별 리팩토링**을 통한 **점진적 개선**
- **이론과 실무**의 **균형잡힌 적용**

### **3. 지속적인 개선**

- **현재 한계점**을 **인정**하고 **개선 방향**을 **구체적으로 제시**
- **완벽하지 않아도** **시작점**으로서의 **가치** 인식

## 🏆 **결론**

이번 프로젝트에서 **정말 많은 노력과 애를 쓴 부분**은:

1. **아키텍처적 사고의 전환** - 상태 관리에서 도메인 설계로
2. **FSD 이론의 실제 적용** - 개념을 구체적인 코드로 구현
3. **체계적인 구조화** - 복잡한 상태를 논리적 단위로 분해
4. **함수형 프로그래밍 철학** - 순수 함수와 비즈니스 로직 분리
5. **지속적인 학습과 개선** - 현재 한계를 인정하고 발전 방향 모색

**특히 "상태를 나누면 엔티티가 보인다"는 깊은 인사이트**는 단순한 코드 리팩토링을 넘어서 **아키텍처 설계의 본질**을 이해하려는 **진정한 노력**을 보여줍니다.

이런 **깊이 있는 사고와 체계적인 접근**은 **단순한 기능 구현**을 넘어서 **소프트웨어 설계의 근본 원리**를 이해하려는 **진정한 개발자 정신**을 보여줍니다. 👏
