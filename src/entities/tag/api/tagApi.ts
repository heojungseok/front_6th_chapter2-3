import { API_CONFIG, handleApiError } from "@shared/config/api"

import { Tag } from "../model/types"

export const tagApi = {
  // 태그 목록 가져오기
  fetchTags: async (): Promise<Tag[]> => {
    try {
      const response = await fetch(`${API_CONFIG.POSTS.TAGS}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("태그 가져오기 오류:", handleApiError(error))
      throw error
    }
  },

  // 특정 태그 정보 가져오기
  fetchTagBySlug: async (slug: string): Promise<Tag> => {
    try {
      const response = await fetch(`${API_CONFIG.POSTS.TAGS}/${slug}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("태그 정보 가져오기 오류:", handleApiError(error))
      throw error
    }
  },

  // 태그 생성
  createTag: async (tag: Omit<Tag, "id" | "url">): Promise<Tag> => {
    try {
      const response = await fetch(`${API_CONFIG.POSTS.TAGS}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tag),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("태그 생성 오류:", handleApiError(error))
      throw error
    }
  },

  // 태그 수정
  updateTag: async (slug: string, tag: Partial<Tag>): Promise<Tag> => {
    try {
      const response = await fetch(`${API_CONFIG.POSTS.TAGS}/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tag),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("태그 수정 오류:", handleApiError(error))
      throw error
    }
  },

  // 태그 삭제
  deleteTag: async (slug: string): Promise<void> => {
    try {
      const response = await fetch(`${API_CONFIG.POSTS.TAGS}/${slug}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("태그 삭제 오류:", handleApiError(error))
      throw error
    }
  },
}
