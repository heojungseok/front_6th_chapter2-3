import { UserSlime } from "@entities/user/model/types"

export type CommentType = {
  author: UserSlime // 기존 호환성 유지
  body: string
  id: number
  likes: number
  postId: number
  user: UserSlime
  userId: number
}
