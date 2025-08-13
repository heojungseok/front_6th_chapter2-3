import { UserSlime } from "@entities/user/model/types"

export type Comment = {
  id: number
  postId: number
  body: string
  author: UserSlime
}
export type CommentListResponse = { comments: Comment[] }
