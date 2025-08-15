import { Post } from "@entities/post/model/types"
import { UserSlime } from "@entities/user/model/types"
import { highlightText } from "@shared/lib/highlightText"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shared/ui"
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"

interface PostsTableProps {
  deletePost: (id: number) => void
  editPost: (post: Post) => void
  openPostDetail: (post: Post) => void
  openUserModal: (user: UserSlime) => void
  posts: Post[]
  searchQuery: string
  selectedTag: string
  setSelectedTag: (tag: string) => void
  setShowEditDialog: (show: boolean) => void
  updateURL: () => void
}

export const PostsTable = ({
  posts,
  searchQuery,
  selectedTag,
  setSelectedTag,
  openUserModal,
  openPostDetail,
  editPost,
  deletePost,
  updateURL,
  setShowEditDialog,
}: PostsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, searchQuery)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag: string) => (
                    <span
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      key={tag}
                      onClick={() => {
                        setSelectedTag(tag)
                        updateURL()
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => openUserModal(post.author)}>
                <img alt={post.author?.username} className="w-8 h-8 rounded-full" src={post.author?.image} />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button onClick={() => openPostDetail(post)} size="sm" variant="ghost">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    editPost(post)
                    setShowEditDialog(true)
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button onClick={() => deletePost(post.id)} size="sm" variant="ghost">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
