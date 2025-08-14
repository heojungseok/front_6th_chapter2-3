import { create } from "zustand"

interface ModalState {
  closeAddCommentDialog: () => void
  closeAddDialog: () => void
  // 모든 모달 닫기
  closeAllModals: () => void
  closeEditCommentDialog: () => void
  closeEditDialog: () => void
  closePostDetailDialog: () => void

  closeUserModal: () => void
  openAddCommentDialog: () => void
  // 모달 열기/닫기 액션들
  openAddDialog: () => void
  openEditCommentDialog: () => void
  openEditDialog: () => void
  openPostDetailDialog: () => void
  openUserModal: () => void
  showAddCommentDialog: boolean
  // 모달 상태들
  showAddDialog: boolean
  showEditCommentDialog: boolean
  showEditDialog: boolean
  showPostDetailDialog: boolean

  showUserModal: boolean
}

export const useModalStore = create<ModalState>((set) => ({
  // 초기 상태
  showAddDialog: false,
  showEditDialog: false,
  showAddCommentDialog: false,
  showEditCommentDialog: false,
  showPostDetailDialog: false,
  showUserModal: false,

  // 개별 모달 열기/닫기
  openAddDialog: () => set({ showAddDialog: true }),
  closeAddDialog: () => set({ showAddDialog: false }),
  openEditDialog: () => set({ showEditDialog: true }),
  closeEditDialog: () => set({ showEditDialog: false }),
  openAddCommentDialog: () => set({ showAddCommentDialog: true }),
  closeAddCommentDialog: () => set({ showAddCommentDialog: false }),
  openEditCommentDialog: () => set({ showEditCommentDialog: true }),
  closeEditCommentDialog: () => set({ showEditCommentDialog: false }),
  openPostDetailDialog: () => set({ showPostDetailDialog: true }),
  closePostDetailDialog: () => set({ showPostDetailDialog: false }),
  openUserModal: () => set({ showUserModal: true }),
  closeUserModal: () => set({ showUserModal: false }),

  // 모든 모달 닫기
  closeAllModals: () =>
    set({
      showAddDialog: false,
      showEditDialog: false,
      showAddCommentDialog: false,
      showEditCommentDialog: false,
      showPostDetailDialog: false,
      showUserModal: false,
    }),
}))
