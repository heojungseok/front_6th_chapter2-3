import { API_CONFIG, handleApiError } from "@shared/config/api"

import { User, UserSlime } from "../model/types"

export const userApi = {
  // 사용자 목록 가져오기 (간단한 정보)
  fetchUsers: async (limit: number = 0, select?: string): Promise<{ users: UserSlime[] }> => {
    try {
      const params = new URLSearchParams()
      params.append("limit", limit.toString())
      if (select) {
        params.append("select", select)
      }

      const response = await fetch(`${API_CONFIG.USERS.BASE}?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("사용자 목록 가져오기 오류:", handleApiError(error))
      throw error
    }
  },

  // 특정 사용자 상세 정보 가져오기
  fetchUserById: async (id: number): Promise<User> => {
    try {
      const response = await fetch(`${API_CONFIG.USERS.BASE}/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", handleApiError(error))
      throw error
    }
  },

  // 사용자 생성
  createUser: async (user: Omit<User, "id">): Promise<User> => {
    try {
      const response = await fetch(API_CONFIG.USERS.BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("사용자 생성 오류:", handleApiError(error))
      throw error
    }
  },

  // 사용자 정보 수정
  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    try {
      const response = await fetch(`${API_CONFIG.USERS.BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("사용자 정보 수정 오류:", handleApiError(error))
      throw error
    }
  },

  // 사용자 삭제
  deleteUser: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_CONFIG.USERS.BASE}/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("사용자 삭제 오류:", handleApiError(error))
      throw error
    }
  },

  // 사용자 검색
  searchUsers: async (query: string): Promise<{ users: UserSlime[] }> => {
    try {
      const response = await fetch(`${API_CONFIG.USERS.BASE}/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("사용자 검색 오류:", handleApiError(error))
      throw error
    }
  },
}
