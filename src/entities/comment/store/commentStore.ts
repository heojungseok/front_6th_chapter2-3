import { create } from "zustand"

import { Comment } from "../model/types"

interface CommentsState {
  // 상태들
  comments: Record<number, Comment[]>
  selectedComment: Comment | null
  newComment: { body: string; postId: number | null; userId: number }

  // 액션들
  setComments: (comments: Record<number, Comment[]>) => void
  setSelectedComment: (comment: Comment | null) => void
  setNewComment: (comment: { body: string; postId: number | null; userId: number }) => void
  addComment: (comment: Comment) => void
  updateComment: (comment: Comment) => void
  deleteComment: (id: number, postId: number) => void
  resetNewComment: () => void
  fetchComments: (postId: number) => void
}

export const useCommentStore = create<CommentsState>((set) => ({
  comments: {},
  newComment: { body: "", postId: null, userId: 1 },
  selectedComment: null,
  setComments: (comments) => set({ comments }),
  setNewComment: (comment) => set({ newComment: comment }),
  setSelectedComment: (comment) => set({ selectedComment: comment }),
  addComment: (comment) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [comment.postId]: [...(state.comments[comment.postId] || []), comment],
      },
    })),
  updateComment: (comment) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [comment.postId]: state.comments[comment.postId].map((c) => (c.id === comment.id ? comment : c)),
      },
    })),
  deleteComment: (id, postId) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: state.comments[postId].filter((c) => c.id !== id),
      },
    })),
  resetNewComment: () => set({ newComment: { body: "", postId: null, userId: 1 } }),
  fetchComments: (postId) => set((state) => ({ comments: { ...state.comments, [postId]: state.comments[postId] } })),
}))
