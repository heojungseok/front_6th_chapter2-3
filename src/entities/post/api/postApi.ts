import { API_CONFIG, handleApiError } from "@shared/config/api"

import { CreatePostRequest, Post, PostList, UpdatePostRequest } from "../model/types"

export const postApi = {
  // 게시물 목록 가져오기
  fetchPosts: async (limit: number, skip: number): Promise<PostList> => {
    try {
      const response = await fetch(`${API_CONFIG.POSTS.BASE}?limit=${limit}&skip=${skip}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("게시물 가져오기 오류:", handleApiError(error))
      throw error
    }
  },

  // 게시물 생성
  createPost: async (post: CreatePostRequest): Promise<Post> => {
    try {
      const response = await fetch(`${API_CONFIG.POSTS.BASE}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("게시물 생성 오류:", handleApiError(error))
      throw error
    }
  },

  // 게시물 수정
  updatePost: async (post: UpdatePostRequest): Promise<Post> => {
    try {
      const response = await fetch(`${API_CONFIG.POSTS.BASE}/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("게시물 업데이트 오류:", handleApiError(error))
      throw error
    }
  },

  // 게시물 삭제
  deletePost: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_CONFIG.POSTS.BASE}/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("게시물 삭제 오류:", handleApiError(error))
      throw error
    }
  },

  // 게시물 검색
  searchPosts: async (query: string): Promise<PostList> => {
    try {
      const response = await fetch(`${API_CONFIG.POSTS.BASE}/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("게시물 검색 오류:", handleApiError(error))
      throw error
    }
  },

  fetchPostsByTag: async (tag: string): Promise<PostList> => {
    try {
      const response = await fetch(`${API_CONFIG.POSTS.TAGS}/${tag}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", handleApiError(error))
      throw error
    }
  },
}
