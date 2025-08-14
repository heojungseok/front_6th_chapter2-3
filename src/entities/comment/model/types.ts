import { UserSlime } from "@entities/user/model/types"

export type Comment = {
  author: UserSlime // 기존 호환성 유지
  body: string
  id: number
  likes: number
  postId: number
  user: UserSlime // PostsManagerPage에서 사용하는 속성
  userId: number
}
