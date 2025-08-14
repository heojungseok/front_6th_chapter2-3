import { CreatePostRequest, Post, PostList, UpdatePostRequest } from "../model/types"

export const postApi = {
  // 게시물 목록 가져오기
  fetchPosts: async (limit: number, skip: number): Promise<PostList> => {
    const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
    if (!response.ok) {
      throw new Error("게시물 목록을 가져오는데 실패했습니다.")
    }
    return response.json()
  },

  // 게시물 생성
  createPost: async (post: CreatePostRequest): Promise<Post> => {
    const response = await fetch("/api/posts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
    if (!response.ok) {
      throw new Error("게시물 생성에 실패했습니다.")
    }
    return response.json()
  },

  // 게시물 수정
  updatePost: async (post: UpdatePostRequest): Promise<Post> => {
    const response = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
    if (!response.ok) {
      throw new Error("게시물 수정에 실패했습니다.")
    }
    return response.json()
  },

  // 게시물 삭제
  deletePost: async (id: number): Promise<void> => {
    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("게시물 삭제에 실패했습니다.")
    }
  },

  // 게시물 검색
  searchPosts: async (query: string): Promise<PostList> => {
    const response = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error("게시물 검색에 실패했습니다.")
    }
    return response.json()
  },

  fetchPostsByTag: async (tag: string): Promise<PostList> => {
    const response = await fetch(`/api/posts/tag/${tag}`)
    if (!response.ok) {
      throw new Error("게시물 태그 검색에 실패했습니다.")
    }
    return response.json()
  },
}
