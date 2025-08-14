import { CreatePostRequest } from "@entities/post/model/types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@shared/ui"

interface AddPostModalProps {
  isOpen: boolean
  newPost: CreatePostRequest
  onClose: () => void
  onSubmit: () => void
  setNewPost: (post: CreatePostRequest) => void
}

export const AddPostModal = ({ isOpen, onClose, newPost, setNewPost, onSubmit }: AddPostModalProps) => {
  if (!isOpen) return null

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            placeholder="제목"
            value={newPost.title}
          />
          <Textarea
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            placeholder="내용"
            rows={30}
            value={newPost.body}
          />
          <Input
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
            placeholder="사용자 ID"
            type="number"
            value={newPost.userId}
          />
          <Button onClick={onSubmit}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
