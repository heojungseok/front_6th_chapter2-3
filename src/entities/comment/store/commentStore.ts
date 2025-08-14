import { isCommentDuplicate, isCommentExists } from "@shared/utils/commentUtils"
import { create } from "zustand" 

import { Comment } from "../model/types"

interface CommentsState {
  // 액션들
  addComment: (comment: Comment) => void
  // 상태들
  comments: Record<number, Comment[]>
  deleteComment: (id: number, postId: number) => void

  fetchCommentsForPost: (postId: number, comments: Comment[]) => void
  likeComment: (id: number, postId: number) => void
  newComment: { body: string; postId: number | null; userId: number }
  resetNewComment: () => void
  selectedComment: Comment | null
  setComments: (comments: Record<number, Comment[]>) => void
  setNewComment: (comment: { body: string; postId: number | null; userId: number }) => void
  setSelectedComment: (comment: Comment | null) => void
  updateComment: (comment: Comment) => void
}

export const useCommentStore = create<CommentsState>((set) => ({
  comments: {},
  newComment: { body: "", postId: null, userId: 1 },
  selectedComment: null,
  addComment: (comment) =>
    set((state) => {
      const existingComments = state.comments[comment.postId] || []
      // 중복 체크
      if (isCommentDuplicate(comment, existingComments)) {
        return state // 중복이면 상태 변경 안함
      }
      return {
        comments: {
          ...state.comments,
          [comment.postId]: [...existingComments, comment],
        },
      }
    }),
  deleteComment: (id, postId) =>
    set((state) => {
      const currentComments = state.comments[postId] || []
      // 존재 여부 체크
      if (!isCommentExists(id, currentComments)) {
        return state // 댓글이 없으면 상태 변경 안함
      }
      return {
        comments: {
          ...state.comments,
          [postId]: currentComments.filter((c) => c.id !== id),
        },
      }
    }),
  fetchCommentsForPost: (postId: number, comments: Comment[]) =>
    set((state) => ({
      comments: { ...state.comments, [postId]: comments },
    })),
  resetNewComment: () => set({ newComment: { body: "", postId: null, userId: 1 } }),
  setComments: (comments) => set({ comments }),
  setNewComment: (comment) => set({ newComment: comment }),
  setSelectedComment: (comment) => set({ selectedComment: comment }),
  updateComment: (comment) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [comment.postId]: state.comments[comment.postId]?.map((c) => (c.id === comment.id ? comment : c)) || [],
      },
    })),
  likeComment: (id: number, postId: number) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: state.comments[postId]?.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c)) || [],
      },
    })),
}))
