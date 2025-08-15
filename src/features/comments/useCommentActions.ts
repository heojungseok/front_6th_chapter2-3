import { useQueryClient } from "@tanstack/react-query"
import { useCommentStore } from "@entities/comment"
import { commentsApi } from "@entities/comment/api/commentApi"
import { CommentType } from "@entities/comment/model/types"
import { isCommentDuplicate, isCommentExists } from "@shared/utils/commentUtils"

export const useCommentActions = () => {
  const queryClient = useQueryClient()
  const { comments, addComment, updateComment, deleteComment, fetchCommentsForPost, likeComment } = useCommentStore()

  const handleAddComment = async (newComment: CommentType) => {
    try {
      // 1. 클라이언트에서 중복 체크
      const existingComments = comments[newComment.postId] || []
      if (isCommentDuplicate(newComment, existingComments)) {
        throw new Error("이미 동일한 댓글이 존재합니다.")
      }

      // 2. API 호출
      const response = await commentsApi.addComment(newComment)

      // 3. 스토어에 추가
      addComment(response as CommentType)

      // 4. 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", newComment.postId] })
      queryClient.invalidateQueries({ queryKey: ["posts"] })

      return response
    } catch (error) {
      console.error("댓글 추가 오류:", error)
      throw error
    }
  }

  const handleUpdateComment = async (comment: CommentType) => {
    try {
      const response = await commentsApi.updateComment(comment)
      updateComment(response)

      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", comment.postId] })
      queryClient.invalidateQueries({ queryKey: ["posts"] })

      return response
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
      throw error
    }
  }

  const handleDeleteComment = async (id: number, postId: number) => {
    try {
      // 1. 클라이언트에서 존재 여부 체크
      const currentComments = comments[postId] || []
      if (!isCommentExists(id, currentComments)) {
        throw new Error("댓글을 찾을 수 없습니다.")
      }

      // 2. API 호출
      await commentsApi.deleteComment(id)

      // 3. 스토어에서 제거
      deleteComment(id, postId)

      // 4. 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
      throw error
    }
  }

  const handleLikeComment = async (id: number, postId: number) => {
    try {
      const currentComment = comments[postId]?.find((c) => c.id === id)
      if (!currentComment) {
        throw new Error("댓글을 찾을 수 없습니다.")
      }

      const response = await commentsApi.likeComment(id, currentComment.likes)
      likeComment(response.id, response.postId)

      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })

      return response
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
      throw error
    }
  }

  const handleFetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음

    try {
      const response = await commentsApi.fetchComments(postId)
      fetchCommentsForPost(postId, response as CommentType[])
      return response
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
      throw error
    }
  }

  return {
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
    handleFetchComments,
  }
}
