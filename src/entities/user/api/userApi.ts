import { useQueryClient } from "@tanstack/react-query"
import { API_CONFIG, handleApiError } from "@shared/config/api"

import { User, UserSlime } from "../model/types"

export const userApi = {
  // 사용자 목록 가져오기 (간단한 정보)
  fetchUsers: async (limit: number = 0): Promise<{ users: UserSlime[] }> => {
    try {
      const params = new URLSearchParams()
      params.append("limit", limit.toString())
      params.append("select", "username,image")

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

  // 특정 사용자 정보 가져오기
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
      const response = await fetch(`${API_CONFIG.USERS.BASE}`, {
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

  // 사용자 수정
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
      console.error("사용자 수정 오류:", handleApiError(error))
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
}

// React Query를 사용하는 훅
export const useUserActions = () => {
  const queryClient = useQueryClient()

  // 사용자 생성 후 캐시 무효화
  const createUserWithCache = async (user: Omit<User, "id">) => {
    try {
      const result = await userApi.createUser(user)
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["users"] })
      return result
    } catch (error) {
      console.error("사용자 생성 오류:", error)
      throw error
    }
  }

  // 사용자 수정 후 캐시 무효화
  const updateUserWithCache = async (id: number, user: Partial<User>) => {
    try {
      const result = await userApi.updateUser(id, user)
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", id] })
      return result
    } catch (error) {
      console.error("사용자 수정 오류:", error)
      throw error
    }
  }

  // 사용자 삭제 후 캐시 무효화
  const deleteUserWithCache = async (id: number) => {
    try {
      await userApi.deleteUser(id)
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", id] })
    } catch (error) {
      console.error("사용자 삭제 오류:", error)
      throw error
    }
  }

  return {
    ...userApi,
    createUser: createUserWithCache,
    updateUser: updateUserWithCache,
    deleteUser: deleteUserWithCache,
  }
}
