import { create } from "zustand"

import { CommentType } from "../model/types"

interface CommentsState {
  // 액션들
  addComment: (comment: CommentType) => void
  // 상태들
  comments: Record<number, CommentType[]>
  deleteComment: (id: number, postId: number) => void

  fetchCommentsForPost: (postId: number, comments: CommentType[]) => void
  likeComment: (id: number, postId: number) => void
  newComment: { body: string; postId: number | null; userId: number }
  resetNewComment: () => void
  selectedComment: CommentType | null
  setComments: (comments: Record<number, CommentType[]>) => void
  setNewComment: (comment: { body: string; postId: number | null; userId: number }) => void
  setSelectedComment: (comment: CommentType | null) => void
  updateComment: (comment: CommentType) => void
}

export const useCommentStore = create<CommentsState>((set) => ({
  comments: {},
  newComment: { body: "", postId: null, userId: 1 },
  selectedComment: null,
  addComment: (comment) =>
    set((state) => {
      const existingComments = state.comments[comment.postId] || []
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
      return {
        comments: {
          ...state.comments,
          [postId]: currentComments.filter((c) => c.id !== id),
        },
      }
    }),
  fetchCommentsForPost: (postId: number, comments: CommentType[]) =>
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
