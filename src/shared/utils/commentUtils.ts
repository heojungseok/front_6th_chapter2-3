import { CommentType } from "@entities/comment/model/types"

// 댓글 중복 체크 - body와 postId로만 체크
export const isCommentDuplicate = (
  comment: { body: string; postId: number },
  existingComments: CommentType[],
): boolean => {
  return existingComments.some((c) => c.body === comment.body && c.postId === comment.postId)
}

// 댓글 존재 여부 체크
export const isCommentExists = (commentId: number, comments: CommentType[]): boolean => {
  return comments.some((c) => c.id === commentId)
}
