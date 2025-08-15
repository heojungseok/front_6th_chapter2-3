/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_COMMENTS_API_URL: string
  readonly VITE_POSTS_API_URL: string
  readonly VITE_TAGS_API_URL: string
  readonly VITE_USERS_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
