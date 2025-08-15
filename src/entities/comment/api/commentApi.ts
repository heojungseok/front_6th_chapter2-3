import { useQueryClient } from "@tanstack/react-query"
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

// React Query를 사용하는 훅
export const useCommentActions = () => {
  const queryClient = useQueryClient()

  // 댓글 생성 후 캐시 무효화
  const addCommentWithCache = async (comment: CommentType) => {
    try {
      const result = await commentsApi.addComment(comment)
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", comment.postId] })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      return result
    } catch (error) {
      console.error("댓글 추가 오류:", error)
      throw error
    }
  }

  // 댓글 수정 후 캐시 무효화
  const updateCommentWithCache = async (comment: CommentType) => {
    try {
      const result = await commentsApi.updateComment(comment)
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", comment.postId] })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      return result
    } catch (error) {
      console.error("댓글 수정 오류:", error)
      throw error
    }
  }

  // 댓글 삭제 후 캐시 무효화
  const deleteCommentWithCache = async (id: number, postId: number) => {
    try {
      await commentsApi.deleteComment(id)
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
      throw error
    }
  }

  // 댓글 좋아요 후 캐시 무효화
  const likeCommentWithCache = async (id: number, currentLikes: number, postId: number) => {
    try {
      const result = await commentsApi.likeComment(id, currentLikes)
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
      return result
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
      throw error
    }
  }

  return {
    ...commentsApi,
    addComment: addCommentWithCache,
    updateComment: updateCommentWithCache,
    deleteComment: deleteCommentWithCache,
    likeComment: likeCommentWithCache,
  }
}
