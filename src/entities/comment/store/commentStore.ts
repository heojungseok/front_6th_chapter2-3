import { create } from "zustand"

import { Comment } from "../model/types"

interface CommentsState {
  // 상태들
  comments: Record<number, Comment[]>
  newComment: { body: string; postId: number | null; userId: number }
  selectedComment: Comment | null

  // 액션들
  addComment: (comment: Comment) => void
  deleteComment: (id: number, postId: number) => void
  fetchCommentsForPost: (postId: number, comments: Comment[]) => void
  likeComment: (id: number, postId: number) => void
  resetNewComment: () => void
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
    set((state) => ({
      comments: {
        ...state.comments,
        [comment.postId]: [...(state.comments[comment.postId] || []), comment],
      },
    })),
  deleteComment: (id, postId) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: state.comments[postId].filter((c) => c.id !== id),
      },
    })),
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
