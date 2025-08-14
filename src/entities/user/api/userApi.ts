import { User, UserSlime } from "../model/types"

export const userApi = {
  // 사용자 목록 가져오기 (간단한 정보)
  fetchUsers: async (limit: number = 0, select?: string): Promise<{ users: UserSlime[] }> => {
    const params = new URLSearchParams()
    params.append("limit", limit.toString())
    if (select) {
      params.append("select", select)
    }

    const response = await fetch(`/api/users?${params.toString()}`)
    if (!response.ok) {
      throw new Error("사용자 목록을 가져오는데 실패했습니다.")
    }
    return response.json()
  },

  // 특정 사용자 상세 정보 가져오기
  fetchUserById: async (id: number): Promise<User> => {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) {
      throw new Error("사용자 정보를 가져오는데 실패했습니다.")
    }
    return response.json()
  },

  // 사용자 생성
  createUser: async (user: Omit<User, "id">): Promise<User> => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    if (!response.ok) {
      throw new Error("사용자 생성에 실패했습니다.")
    }
    return response.json()
  },

  // 사용자 정보 수정
  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    if (!response.ok) {
      throw new Error("사용자 정보 수정에 실패했습니다.")
    }
    return response.json()
  },

  // 사용자 삭제
  deleteUser: async (id: number): Promise<void> => {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("사용자 삭제에 실패했습니다.")
    }
  },

  // 사용자 검색
  searchUsers: async (query: string): Promise<{ users: UserSlime[] }> => {
    const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error("사용자 검색에 실패했습니다.")
    }
    return response.json()
  },
}
