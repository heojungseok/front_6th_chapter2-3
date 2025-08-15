import { API_CONFIG, handleApiError } from "@shared/config/api"

import { CommentType } from "../model/types"

export const commentsApi = {
  fetchComments: async (postId: number): Promise<CommentType[]> => {
    try {
      const response = await fetch(`${API_CONFIG.COMMENTS.BASE}/post/${postId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("댓글 가져오기 오류:", handleApiError(error))
      throw error
    }
  },

  addComment: async (comment: CommentType): Promise<CommentType> => {
    try {
      const response = await fetch(API_CONFIG.COMMENTS.BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("댓글 추가 오류:", handleApiError(error))
      throw error
    }
  },

  updateComment: async (comment: CommentType): Promise<CommentType> => {
    try {
      const response = await fetch(`${API_CONFIG.COMMENTS.BASE}/${comment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("댓글 업데이트 오류:", handleApiError(error))
      throw error
    }
  },

  deleteComment: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_CONFIG.COMMENTS.BASE}/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("댓글 삭제 오류:", handleApiError(error))
      throw error
    }
  },

  likeComment: async (id: number, currentLikes: number): Promise<CommentType> => {
    try {
      const response = await fetch(`${API_CONFIG.COMMENTS.BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: currentLikes + 1 }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("댓글 좋아요 오류:", handleApiError(error))
      throw error
    }
  },
}
