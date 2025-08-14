import { CommentType } from "@entities/comment/model/types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@shared/ui"

interface EditCommentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  selectedComment: CommentType | null
  setSelectedComment: (comment: CommentType) => void
}

export const EditCommentModal = ({
  isOpen,
  onClose,
  selectedComment,
  setSelectedComment,
  onSubmit,
}: EditCommentModalProps) => {
  if (!isOpen || !selectedComment) return null

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
            placeholder="댓글 내용"
            value={selectedComment.body}
          />
          <Button onClick={onSubmit}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
