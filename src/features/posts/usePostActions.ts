import { usePostStore } from "@entities/post"
import { postApi } from "@entities/post/api/postApi"
import { CreatePostRequest, Post, UpdatePostRequest } from "@entities/post/model/types"
import { userApi } from "@entities/user/api/userApi"
import { UserSlime } from "@entities/user/model/types"
import { useQueryClient } from "@tanstack/react-query"

export const usePostActions = () => {
  const queryClient = useQueryClient()
  const {
    setPosts,
    setTotal,
    setLoading,
    addPost: addPostToStore,
    updatePost: updatePostInStore,
    deletePost: deletePostFromStore,
  } = usePostStore()

  // fetchPosts 함수를 별도로 제공 (기존 인터페이스 유지)
  const fetchPostsData = async (limit: number, skip: number) => {
    setLoading(true)
    try {
      const data = await postApi.fetchPosts(limit, skip)
      const usersData = await userApi.fetchUsers()

      const postsWithUsers = data.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: UserSlime) => user.id === post.id),
      }))
      setPosts(postsWithUsers as Post[])
      setTotal(data.total as number)
      return data
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // searchPosts 함수를 별도로 제공 (기존 인터페이스 유지)
  const searchPostsData = async (query: string) => {
    if (!query) {
      return await fetchPostsData(0, 10)
    }

    setLoading(true)
    try {
      const data = await postApi.searchPosts(query)
      // 사용자 정보를 함께 가져오기
      const usersData = await userApi.fetchUsers()
      const postsWithUsers = data.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: UserSlime) => user.id === post.id),
      }))

      setPosts(postsWithUsers as Post[])
      setTotal(data.total as number)
      return data
    } catch (error) {
      console.error("게시물 검색 오류:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // fetchPostsByTag 함수를 별도로 제공 (기존 인터페이스 유지)
  const fetchPostsByTagData = async (tag: string) => {
    if (!tag || tag === "all") {
      return await fetchPostsData(0, 10)
    }

    setLoading(true)
    try {
      const postsData = await postApi.fetchPostsByTag(tag)
      // 사용자 정보를 함께 가져오기
      const usersData = await userApi.fetchUsers()

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: UserSlime) => user.id === post.id),
      }))

      setPosts(postsWithUsers as Post[])
      setTotal(postsData.total)
      return postsData
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (post: CreatePostRequest) => {
    try {
      const data = await postApi.createPost(post)
      addPostToStore(data as Post)
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      return data
    } catch (error) {
      console.error("게시물 생성 오류:", error)
      throw error
    }
  }

  const updatePost = async (post: UpdatePostRequest) => {
    try {
      const data = await postApi.updatePost(post)
      updatePostInStore(data as Post)
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      return data
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
      throw error
    }
  }

  const deletePost = async (id: number) => {
    try {
      await postApi.deletePost(id)
      deletePostFromStore(id)
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
      throw error
    }
  }

  return {
    fetchPosts: fetchPostsData,
    searchPosts: searchPostsData,
    fetchPostsByTag: fetchPostsByTagData,
    createPost,
    updatePost,
    deletePost,
  }
}
