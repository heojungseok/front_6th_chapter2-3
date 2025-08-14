import { create } from "zustand"

import { Tag } from "../model/types"

interface TagState {
  selectedTag: string
  setSelectedTag: (tag: string) => void
  // 2. 액션 (Actions)
  setTags: (tags: Tag[]) => void
  // 1. 상태 (State)
  tags: Tag[]
}

export const useTagStore = create<TagState>((set) => ({
  // 초기 상태
  tags: [],
  selectedTag: "",
  // 액션
  setTags: (tags) => set({ tags }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
}))
