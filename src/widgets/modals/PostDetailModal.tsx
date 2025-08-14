import { CommentType } from "@entities/comment/model/types"
import { Post } from "@entities/post/model/types"
import { highlightText } from "@shared/lib/highlightText"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui"
import { CommentSection } from "@widgets/comments"

interface PostDetailModalProps {
  comments: CommentType[]
  isOpen: boolean
  onAddComment: (postId: number) => void
  onClose: () => void
  onDeleteComment: (id: number, postId: number) => void
  onEditComment: (comment: CommentType) => void
  onLikeComment: (id: number, postId: number) => void
  searchQuery: string
  selectedPost: Post | null
}

export const PostDetailModal = ({
  comments,
  isOpen,
  onClose,
  selectedPost,
  searchQuery,
  onAddComment,
  onDeleteComment,
  onEditComment,
  onLikeComment,
}: PostDetailModalProps) => {
  if (!isOpen || !selectedPost) return null

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost.body, searchQuery)}</p>
          <CommentSection
            comments={comments}
            onAddComment={onAddComment}
            onDeleteComment={onDeleteComment}
            onEditComment={onEditComment}
            onLikeComment={onLikeComment}
            postId={selectedPost.id}
            searchQuery={searchQuery}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
