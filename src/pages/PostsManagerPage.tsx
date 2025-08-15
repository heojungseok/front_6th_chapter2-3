import { useCommentActions, useCommentStore } from "@entities/comment"
import { CreatePostRequest, Post, UpdatePostRequest } from "@entities/post"
import { usePostStore } from "@entities/post/store/postStore"
import { tagApi, useTagStore } from "@entities/tag"
import { User, userApi, UserSlime, useUserStore } from "@entities/user"
import { usePostActions } from "@features/posts"
import { useSearchActions } from "@features/search"
import { getUrlParams } from "@shared/lib/urlUtils"
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
// 모달 import
import {
  AddCommentModal,
  AddPostModal,
  EditCommentModal,
  EditPostModal,
  PostDetailModal,
  UserModal,
} from "@widgets/modals"
import { useModalStore } from "@widgets/modals/store/modalStore"
import { PostsTable } from "@widgets/posts/PostsTable"
import { Plus, Search } from "lucide-react"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { CommentType } from "@entities/comment"

const PostsManager = () => {
  const location = useLocation()

  useEffect(() => {
    const { skip, limit, searchQuery, sortBy, order, selectedTag } = getUrlParams(location.search)
    setSelectedTag(selectedTag)
    setSkip(skip)
    setLimit(limit)
    setSearchQuery(searchQuery)
    setSortBy(sortBy)
    setOrder(order)
  }, [location.search])

  // == 태그 도메인 ==
  const { tags, selectedTag, setSelectedTag, setTags } = useTagStore()

  // == 게시글 도메인 ==
  const {
    posts,
    total,
    selectedPost,
    setSelectedPost,
    skip,
    limit,
    setSkip,
    setLimit,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    order,
    setOrder,
    newPost,
    setNewPost,
  } = usePostStore()

  // == 댓글 도메인 ==
  const { comments, selectedComment, newComment, resetNewComment, setSelectedComment, setNewComment } =
    useCommentStore()

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
    closeUserModal,
    closeAllModals,
    openUserModal: openUserModalStore,
  } = useModalStore()

  // == Features ==
  const { fetchComments, addComment, updateComment, deleteComment, likeComment } = useCommentActions()

  const {
    fetchPosts: fetchPostsFromApi,
    searchPosts: searchPostsFromApi,
    fetchPostsByTag: fetchPostsByTagFromApi,
    createPost: addPostFromApi,
    updatePost: updatePostFromApi,
    deletePost: deletePostFromApi,
  } = usePostActions()

  const { updateURLParams } = useSearchActions()

  // 게시물 가져오기
  const fetchPosts = async () => {
    try {
      await fetchPostsFromApi(limit, skip)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    }
  }

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    try {
      await searchPostsFromApi(searchQuery)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    try {
      await fetchPostsByTagFromApi(tag)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
  }

  // 게시물 추가
  const addPost = async () => {
    try {
      await addPostFromApi(newPost)
      closeAllModals()
      setNewPost({ title: "", body: "", userId: 1, tags: [] })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  // 게시물 업데이트
  const updatePost = async () => {
    if (!selectedPost) return

    try {
      const updateData: UpdatePostRequest = {
        id: selectedPost.id,
        tags: selectedPost.tags,
        title: selectedPost.title,
        body: selectedPost.body,
      }
      await updatePostFromApi(updateData)
      closeAllModals()
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // 게시물 삭제
  const deletePost = async () => {
    if (!selectedPost) return

    try {
      await deletePostFromApi(selectedPost.id)
      closeAllModals()
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 댓글 추가
  const onAddComment = async () => {
    if (!newComment.postId) return

    try {
      const commentData: CommentType = {
        id: 0, // 임시 ID, 서버에서 생성됨
        body: newComment.body,
        postId: newComment.postId,
        userId: newComment.userId,
        author: { id: newComment.userId, username: "사용자", image: "" }, // 임시 데이터
        likes: 0,
        user: { id: newComment.userId, username: "사용자", image: "" }, // 임시 데이터
      }
      await addComment(commentData)
      closeAllModals()
      resetNewComment()
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        console.error("댓글 추가 오류:", error)
      }
    }
  }

  // 댓글 업데이트
  const onUpdateComment = async () => {
    if (!selectedComment) return

    try {
      await updateComment(selectedComment)
      closeAllModals()
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const onDeleteComment = async (id: number, postId: number) => {
    try {
      await deleteComment(id, postId)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        console.error("댓글 삭제 오류:", error)
      }
    }
  }

  // 댓글 좋아요
  const onLikeComment = async (id: number, postId: number) => {
    try {
      const currentComment = comments[postId]?.find((c) => c.id === id)
      if (!currentComment) {
        throw new Error("댓글을 찾을 수 없습니다.")
      }
      await likeComment(id, currentComment.likes, postId)
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    openPostDetailDialog()
  }

  // 사용자 모달 열기
  const openUserModal = async (user: UserSlime) => {
    try {
      const userData = await userApi.fetchUserById(user.id)
      setSelectedUser(userData as User)
      openUserModalStore()
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
    const loadTags = async () => {
      try {
        const tagsData = await tagApi.fetchTags()
        setTags(tagsData)
      } catch (error) {
        console.error("태그 로딩 오류:", error)
      }
    }
    loadTags()
  }, [])

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    updateURLParams(skip, limit, searchQuery, sortBy, order, selectedTag)
  }, [skip, limit, sortBy, order, selectedTag])

  return (
    <Card className="w-full max-w-6xl h-full mx-auto">
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
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
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
                updateURLParams(skip, limit, searchQuery, sortBy, order, value)
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
            <Select onValueChange={setOrder} value={order}>
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
          {/* postsLoading 사용 제거 */}
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
            updateURL={() => updateURLParams(skip, limit, searchQuery, sortBy, order, selectedTag)}
          />

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
        onSubmit={onAddComment}
        setNewComment={setNewComment}
      />

      <EditCommentModal
        isOpen={showEditCommentDialog}
        onClose={closeEditCommentDialog}
        onSubmit={onUpdateComment}
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
      />

      <PostDetailModal
        comments={selectedPost?.id ? comments[selectedPost.id] || [] : []}
        isOpen={showPostDetailDialog}
        onAddComment={openAddCommentModal}
        onClose={closePostDetailDialog}
        onDeleteComment={onDeleteComment}
        onEditComment={openEditCommentModal}
        onLikeComment={onLikeComment}
        searchQuery={searchQuery}
        selectedPost={selectedPost}
      />

      <UserModal isOpen={showUserModal} onClose={closeUserModal} selectedUser={selectedUser} />
    </Card>
  )
}

export default PostsManager
