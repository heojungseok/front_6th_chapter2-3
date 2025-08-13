import { create } from "zustand"

import { Tag } from "../model/types"

interface TagState {
  // 1. 상태 (State)
  tags: Tag[]
  selectedTag: string
  // 2. 액션 (Actions)
  setTags: (tags: Tag[]) => void
  setSelectedTag: (tag: string) => void
}

export const useTagStore = create<TagState>((set) => ({
  // 초기 상태
  tags: [],
  selectedTag: "",
  // 액션
  setTags: (tags) => set({ tags }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
}))
