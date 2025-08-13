import { UserSlime } from "@entities/user/model/types"

export type Reaction = { dislikes: number; likes: number }
export type post = {
  author: UserSlime
  body: string
  id: number
  reactions: Reaction
  tags?: string[]
  title: string
  userId: number
}
export type postList = { posts: post[]; total: number }
