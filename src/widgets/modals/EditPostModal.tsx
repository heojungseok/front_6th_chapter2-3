import { Post } from "@entities/post/model/types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@shared/ui"

interface EditPostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  selectedPost: Post | null
  setSelectedPost: (post: Post) => void
}

export const EditPostModal = ({ isOpen, onClose, selectedPost, setSelectedPost, onSubmit }: EditPostModalProps) => {
  if (!isOpen || !selectedPost) return null

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
            placeholder="제목"
            value={selectedPost.title}
          />
          <Textarea
            onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })}
            placeholder="내용"
            rows={15}
            value={selectedPost.body}
          />
          <Button onClick={onSubmit}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
