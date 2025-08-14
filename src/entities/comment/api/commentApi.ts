import { CommentType } from "../model/types"

export const commentsApi = {
  fetchComments: async (postId: number) => {
    const response = await fetch(`/api/comments/post/${postId}`)
    return response.json()
  },
  addComment: async (comment: CommentType) => {
    const response = await fetch(`/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    })
    return response.json()
  },
  updateComment: async (comment: CommentType) => {
    const response = await fetch(`/api/comments/${comment.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    })
    return response.json()
  },
  deleteComment: async (id: number) => {
    const response = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    })
    return response.json()
  },
  likeComment: async (id: number, currentLikes: number) => {
    const response = await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: currentLikes + 1 }),
    })
    return response.json()
  },
}
