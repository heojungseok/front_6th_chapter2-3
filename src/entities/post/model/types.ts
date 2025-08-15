import { UserSlime } from "@entities/user/model/types"

export type Reaction = { dislikes: number; likes: number }
export type Post = {
  author: UserSlime
  body: string
  createdAt: string
  id: number
  reactions: Reaction
  tags: string[]
  title: string
  updatedAt: string
}
export type PostList = { posts: Post[]; total: number }

// 게시물 생성용 타입
export type CreatePostRequest = {
  body: string
  tags: string[]
  title: string
  userId: number
}

// 게시물 수정용 타입
export type UpdatePostRequest = {
  body: string
  id: number
  tags: string[]
  title: string
}
