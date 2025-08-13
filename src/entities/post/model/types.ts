import { UserSlime } from "@entities/user/model/types"

export type Reaction = { likes: number; dislikes: number }
export type post = {
  id: number
  userId: number
  title: string
  body: string
  tags?: string[]
  reactions: Reaction
  author: UserSlime
}
export type postList = { posts: post[]; total: number }
