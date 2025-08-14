import { commentsApi } from "@entities/comment/api/commentApi"
import { CommentType } from "@entities/comment/model/types"
import { useCommentStore } from "@entities/comment/store/commentStore"
import { Post, postApi, UpdatePostRequest } from "@entities/post"
import { usePostStore } from "@entities/post/store/postStore"
import { Tag, useTagStore } from "@entities/tag"
import { User, userApi, UserSlime, useUserStore } from "@entities/user"
import { highlightText } from "@shared/lib/highlightText"
import { getUrlParams, updateURL } from "@shared/lib/urlUtils"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Pagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@shared/ui"
import { isCommentDuplicate, isCommentExists } from "@shared/utils/commentUtils"
import { CommentSection } from "@widgets/comments"
import { PostsTable } from "@widgets/posts/PostsTable"
import { Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const { skip, limit, searchQuery, sortBy, sortOrder, selectedTag } = getUrlParams(location.search)
    setSkip(skip)
    setLimit(limit)
    setSearchQuery(searchQuery)
    setSortBy(sortBy)
    setSortOrder(sortOrder)
    setSelectedTag(selectedTag)
  }, [location.search])

  // == 태그 도메인 ==
  const { tags, selectedTag, setTags, setSelectedTag } = useTagStore()

  // == 게시글 도메인 ==
  const {
    posts,
    total,
    selectedPost,
    setPosts,
    setTotal,
    setSelectedPost,
    skip,
    limit,
    setSkip,
    setLimit,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    newPost,
    setNewPost,
    isLoading,
    setLoading,
  } = usePostStore()

  // == 댓글 도메인 ==
  const {
    comments,
    selectedComment,
    newComment,
    addComment,
    updateComment,
    deleteComment,
    resetNewComment,
    setSelectedComment,
    setNewComment,
    fetchCommentsForPost,
    likeComment,
  } = useCommentStore()

  // == 사용자 도메인 ==
  const { selectedUser, setSelectedUser } = useUserStore()

  // == UI 상태 도메인 ==
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  // 게시물 가져오기
  const fetchPosts = async () => {
    setLoading(true)
    try {
      const data = await postApi.fetchPosts(skip, limit)
      setPosts(data.posts as Post[])
      setTotal(data.total as number)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const data = await postApi.searchPosts(searchQuery)
      setPosts(data.posts as Post[])
      setTotal(data.total as number)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const postsData = await postApi.fetchPostsByTag(tag)
      const usersData = await userApi.fetchUsers()

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: UserSlime) => user.id === post.author.id),
      }))

      setPosts(postsWithUsers as Post[])
      setTotal(postsData.total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }

  // 게시물 추가
  const addPost = async () => {
    try {
      const data = await postApi.createPost(newPost)
      setPosts([data as Post, ...posts])
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1, tagIds: [] })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  // 게시물 업데이트
  const updatePost = async () => {
    try {
      const data = await postApi.updatePost(selectedPost as unknown as UpdatePostRequest)
      setPosts(posts.map((post: Post) => (post.id === data.id ? data : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await postApi.deletePost(id)
      setPosts(posts.filter((post: Post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 사용자 정보 가져오기
  // const fetchUsersForPosts = async (posts: Post[]) => {
  //   try {
  //     const usersData = await userApi.fetchUsers()

  //     const postsWithUsers = posts.map((post) => ({
  //       ...post,
  //       author: usersData.users.find((user: UserSlime) => user.id === post.author.id),
  //     }))

  //     setPosts(postsWithUsers as Post[])
  //   } catch (error) {
  //     console.error("사용자 정보 가져오기 오류:", error)
  //   }
  // }

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/posts/tags")
      const data = await response.json()
      setTags(data as Tag[])
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  // 댓글 가져오기
  const handleFetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await commentsApi.fetchComments(postId)
      // 스토어 액션 사용
      fetchCommentsForPost(postId, response as CommentType[])
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 추가
  const handleAddComment = async () => {
    if (!newComment.postId) return

    try {
      // 1. 클라이언트에서 중복 체크
      const existingComments = comments[newComment.postId] || []
      if (isCommentDuplicate(newComment as CommentType, existingComments)) {
        alert("이미 동일한 댓글이 존재합니다.")
        return
      }

      // 2. API 호출
      const response = await commentsApi.addComment(newComment as CommentType)

      // 3. 스토어에 추가
      addComment(response as CommentType)
      setShowAddCommentDialog(false)
      resetNewComment()
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // 댓글 업데이트
  const handleUpdateComment = async () => {
    try {
      const response = await commentsApi.updateComment(selectedComment as CommentType)
      updateComment(response)
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const handleDeleteComment = async (id: number, postId: number) => {
    try {
      // 1. 클라이언트에서 존재 여부 체크
      const currentComments = comments[postId] || []
      if (!isCommentExists(id, currentComments)) {
        alert("댓글을 찾을 수 없습니다.")
        return
      }

      // 2. API 호출
      await commentsApi.deleteComment(id)

      // 3. 스토어에서 제거
      deleteComment(id, postId)
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const handleLikeComment = async (id: number, postId: number) => {
    try {
      const currentComment = comments[postId]?.find((c) => c.id === id)
      if (!currentComment) return

      const response = await commentsApi.likeComment(id, currentComment.likes)
      likeComment(response.id, response.postId)
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    handleFetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (user: UserSlime) => {
    try {
      const userData = await userApi.fetchUserById(user.id)
      setSelectedUser(userData as User)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    updateURL(skip, limit, searchQuery, sortBy, sortOrder, selectedTag, navigate)
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchPosts()}
                  placeholder="게시물 검색..."
                  value={searchQuery}
                />
              </div>
            </div>
            <Select
              onValueChange={(value) => {
                setSelectedTag(value)
                fetchPostsByTag(value)
                updateURL(skip, limit, searchQuery, sortBy, sortOrder, value, navigate)
              }}
              value={selectedTag}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setSortBy} value={sortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setSortOrder} value={sortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 게시물 테이블 */}
          {isLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable
              deletePost={deletePost}
              editPost={setSelectedPost}
              openPostDetail={openPostDetail}
              openUserModal={openUserModal}
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag as string}
              setSelectedTag={setSelectedTag}
              setShowEditDialog={setShowEditDialog}
              updateURL={() => updateURL(skip, limit, searchQuery, sortBy, sortOrder, selectedTag, navigate)}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination
            limit={limit}
            onLimitChange={setLimit}
            onSkipChange={setSkip}
            skip={skip}
            total={total}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <Dialog onOpenChange={setShowAddDialog} open={showAddDialog}>
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
            <Button onClick={addPost}>게시물 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 대화상자 */}
      <Dialog onOpenChange={setShowEditDialog} open={showEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value } as Post)}
              placeholder="제목"
              value={selectedPost?.title || ""}
            />
            <Textarea
              onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value } as Post)}
              placeholder="내용"
              rows={15}
              value={selectedPost?.body || ""}
            />
            <Button onClick={updatePost}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
      <Dialog onOpenChange={setShowAddCommentDialog} open={showAddCommentDialog}>
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
            <Button onClick={handleAddComment}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog onOpenChange={setShowEditCommentDialog} open={showEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value } as CommentType)}
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
            />
            <Button onClick={handleUpdateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog onOpenChange={setShowPostDetailDialog} open={showPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title || "", searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
            <CommentSection
              comments={comments[selectedPost?.id || 0] || []}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onEditComment={handleUpdateComment}
              onLikeComment={handleLikeComment}
              postId={selectedPost?.id || 0}
              searchQuery={searchQuery}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog onOpenChange={setShowUserModal} open={showUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img alt={selectedUser?.username} className="w-24 h-24 rounded-full mx-auto" src={selectedUser?.image} />
            <h3 className="text-xl font-semibold text-center">{selectedUser?.username}</h3>
            <div className="space-y-2">
              <p>
                <strong>이름:</strong> {selectedUser?.firstName} {selectedUser?.lastName}
              </p>
              <p>
                <strong>나이:</strong> {selectedUser?.age}
              </p>
              <p>
                <strong>이메일:</strong> {selectedUser?.email}
              </p>
              <p>
                <strong>전화번호:</strong> {selectedUser?.phone}
              </p>
              <p>
                <strong>주소:</strong> {selectedUser?.address?.address}, {selectedUser?.address?.city},{" "}
                {selectedUser?.address?.state}
              </p>
              <p>
                <strong>직장:</strong> {selectedUser?.company?.name} - {selectedUser?.company?.title}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PostsManager
