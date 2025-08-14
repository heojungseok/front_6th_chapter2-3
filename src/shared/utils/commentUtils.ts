import { Comment } from "@entities/comment/model/types"

// 댓글 중복 체크
export const isCommentDuplicate = (
  comment: Comment, 
  existingComments: Comment[]
): boolean => {
  return existingComments.some(c => c.id === comment.id)
}

// 댓글 존재 여부 체크
export const isCommentExists = (
  commentId: number, 
  comments: Comment[]
): boolean => {
  return comments.some(c => c.id === commentId)
}