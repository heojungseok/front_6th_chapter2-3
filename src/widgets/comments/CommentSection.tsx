import { CommentType } from "@entities/comment/model/types"
import { highlightText } from "@shared/lib/highlightText"
import { Button } from "@shared/ui"
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"

interface CommentSectionProps {
  comments: CommentType[]
  onAddComment: (postId: number) => void
  onDeleteComment: (id: number, postId: number) => void
  onEditComment: (comment: CommentType) => void
  onLikeComment: (id: number, postId: number) => void
  postId: number
  searchQuery: string
}

export const CommentSection = ({
  postId,
  comments,
  searchQuery,
  onAddComment,
  onLikeComment,
  onEditComment,
  onDeleteComment,
}: CommentSectionProps) => {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          onClick={() => {
            onAddComment(postId)
          }}
          size="sm"
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {Array.isArray(comments) ? (
          comments.map((comment) => (
            <div className="flex items-center justify-between text-sm border-b pb-1" key={comment.id}>
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className="font-medium truncate">{comment.user.username}:</span>
                <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Button onClick={() => onLikeComment(comment.id, postId)} size="sm" variant="ghost">
                  <ThumbsUp className="w-3 h-3" />
                  <span className="ml-1 text-xs">{comment.likes}</span>
                </Button>
                <Button
                  onClick={() => {
                    onEditComment(comment)
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button onClick={() => onDeleteComment(comment.id, postId)} size="sm" variant="ghost">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">댓글을 불러올 수 없습니다.</div>
        )}
      </div>
    </div>
  )
}
