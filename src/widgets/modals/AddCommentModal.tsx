import { CommentType } from "@entities/comment/model/types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@shared/ui"

interface AddCommentModalProps {
  isOpen: boolean
  newComment: CommentType
  onClose: () => void
  onSubmit: () => void
  setNewComment: (comment: CommentType) => void
}

export const AddCommentModal = ({ isOpen, onClose, newComment, setNewComment, onSubmit }: AddCommentModalProps) => {
  if (!isOpen) return null

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
            placeholder="댓글 내용"
            value={newComment.body}
          />
          <Button onClick={onSubmit}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
