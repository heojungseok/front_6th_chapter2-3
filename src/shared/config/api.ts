// API 기본 설정
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  POSTS: {
    BASE: import.meta.env.VITE_POSTS_API_URL || "/api/posts",
    TAGS: import.meta.env.VITE_TAGS_API_URL || "/api/posts/tags",
  },
  USERS: {
    BASE: import.meta.env.VITE_USERS_API_URL || "/api/users",
  },
  COMMENTS: {
    BASE: import.meta.env.VITE_COMMENTS_API_URL || "/api/comments",
  },
} as const

// API 응답 타입
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// API 에러 처리
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return "알 수 없는 오류가 발생했습니다."
}
