import { UserSlime } from "@entities/user/model/types"

export type Comment = {
  author: UserSlime
  body: string
  id: number
  postId: number
}
