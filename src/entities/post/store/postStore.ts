import { create } from "zustand"

import { CreatePostRequest, Post } from "../model/types"

interface PostState {
  addPost: (post: Post) => void
  deletePost: (id: number) => void
  error: string | null
  isLoading: boolean
  limit: number
  newPost: CreatePostRequest
  order: string
  // 상태들
  posts: Post[]
  resetNewPost: () => void
  searchQuery: string
  selectedPost: Post | null

  setLimit: (limit: number) => void
  setLoading: (loading: boolean) => void
  setNewPost: (post: CreatePostRequest) => void
  setOrder: (order: string) => void
  // 액션들
  setPosts: (posts: Post[]) => void
  setSearchQuery: (searchQuery: string) => void
  setSelectedPost: (post: Post | null) => void
  setSkip: (skip: number) => void
  setSortBy: (sortBy: string) => void
  setTotal: (total: number) => void
  skip: number
  sortBy: string
  total: number
  updatePost: (post: Post) => void
}

export const usePostStore = create<PostState>((set) => ({
  // 초기 상태
  posts: [],
  selectedPost: null,
  newPost: { body: "", tags: [], title: "", userId: 1 },
  total: 0,
  isLoading: false,
  error: null,
  skip: 0,
  limit: 10,
  searchQuery: "",
  sortBy: "",
  order: "asc",

  // 액션들
  setPosts: (posts) => set({ posts }),

  setSelectedPost: (post) => set({ selectedPost: post }),

  setNewPost: (post) => set({ newPost: post }),

  setTotal: (total) => set({ total }),

  setSkip: (skip) => set({ skip }),
  setLimit: (limit) => set({ limit }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setOrder: (order) => set({ order }),
  setSortBy: (sortBy) => set({ sortBy }),

  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),

  updatePost: (post) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === post.id ? post : p)),
      selectedPost: state.selectedPost?.id === post.id ? post : state.selectedPost,
    })),

  deletePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
      selectedPost: state.selectedPost?.id === id ? null : state.selectedPost,
    })),

  resetNewPost: () =>
    set({
      newPost: { body: "", tags: [], title: "", userId: 1 },
    }),

  setLoading: (loading) => set({ isLoading: loading }),
}))
