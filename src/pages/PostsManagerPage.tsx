import { commentsApi } from "@entities/comment/api/commentApi"
import { CommentType } from "@entities/comment/model/types"
import { useCommentStore } from "@entities/comment/store/commentStore"
import { useModalStore } from "@entities/modal"
import { CreatePostRequest, Post, postApi, UpdatePostRequest } from "@entities/post"
import { usePostStore } from "@entities/post/store/postStore"
import { Tag, useTagStore } from "@entities/tag"
import { User, userApi, UserSlime, useUserStore } from "@entities/user"
import { getUrlParams, updateURL } from "@shared/lib/urlUtils"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Pagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui"
import { isCommentDuplicate, isCommentExists } from "@shared/utils/commentUtils"
// 모달 import
import { AddCommentModal } from "@widgets/modals/AddCommentModal"
import { AddPostModal } from "@widgets/modals/AddPostModal"
import { EditCommentModal } from "@widgets/modals/EditCommentModal"
import { EditPostModal } from "@widgets/modals/EditPostModal"
import { PostDetailModal } from "@widgets/modals/PostDetailModal"
import { UserModal } from "@widgets/modals/UserModal"
import { PostsTable } from "@widgets/posts/PostsTable"
import { Plus, Search } from "lucide-react"
import { useEffect } from "react"
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

  // == 모달 상태 도메인 ==
  const {
    showAddDialog,
    showEditDialog,
    showAddCommentDialog,
    showEditCommentDialog,
    showPostDetailDialog,
    showUserModal,
    openAddDialog,
    closeAddDialog,
    openEditDialog,
    closeEditDialog,
    openAddCommentDialog,
    closeAddCommentDialog,
    openEditCommentDialog,
    closeEditCommentDialog,
    openPostDetailDialog,
    closePostDetailDialog,
    openUserModal: openUserModalStore,
    closeUserModal,
    closeAllModals,
  } = useModalStore()

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
      closeAllModals() // 모든 모달 닫기
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
      closeAllModals() // 모든 모달 닫기
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
      closeAllModals() // 모든 모달 닫기
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
      closeAllModals() // 모든 모달 닫기
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
    openPostDetailDialog() // 모달 열기
  }

  // 사용자 모달 열기
  const openUserModal = async (user: UserSlime) => {
    try {
      const userData = await userApi.fetchUserById(user.id)
      setSelectedUser(userData as User)
      openUserModalStore() // 모달 열기
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  // 댓글 추가 모달 열기 함수
  const openAddCommentModal = (postId: number) => {
    setNewComment({ ...newComment, postId })
    openAddCommentDialog()
  }

  // 댓글 수정 모달 열기 함수
  const openEditCommentModal = (comment: CommentType) => {
    setSelectedComment(comment)
    openEditCommentDialog()
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
          <Button onClick={openAddDialog}>
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
              setShowEditDialog={openEditDialog}
              updateURL={() => updateURL(skip, limit, searchQuery, sortBy, sortOrder, selectedTag, navigate)}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination limit={limit} onLimitChange={setLimit} onSkipChange={setSkip} skip={skip} total={total} />
        </div>
      </CardContent>

      {/* 모달들 */}
      <AddPostModal
        isOpen={showAddDialog}
        newPost={newPost}
        onClose={closeAddDialog}
        onSubmit={addPost}
        setNewPost={setNewPost as (post: CreatePostRequest) => void}
      />

      <EditPostModal
        isOpen={showEditDialog}
        onClose={closeEditDialog}
        onSubmit={updatePost}
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
      />

      <AddCommentModal
        isOpen={showAddCommentDialog}
        newComment={newComment as CommentType}
        onClose={closeAddCommentDialog}
        onSubmit={handleAddComment}
        setNewComment={setNewComment}
      />

      <EditCommentModal
        isOpen={showEditCommentDialog}
        onClose={closeEditCommentDialog}
        onSubmit={handleUpdateComment}
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
      />

      <PostDetailModal
        comments={comments[selectedPost?.id || 0] || []}
        isOpen={showPostDetailDialog}
        onAddComment={openAddCommentModal}
        onClose={closePostDetailDialog}
        onDeleteComment={handleDeleteComment}
        onEditComment={openEditCommentModal}
        onLikeComment={handleLikeComment}
        searchQuery={searchQuery}
        selectedPost={selectedPost}
      />

      <UserModal isOpen={showUserModal} onClose={closeUserModal} selectedUser={selectedUser} />
    </Card>
  )
}

export default PostsManager
