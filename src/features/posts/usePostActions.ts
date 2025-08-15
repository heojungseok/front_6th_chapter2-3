import { usePostStore } from "@entities/post"
import { postApi } from "@entities/post/api/postApi"
import { CreatePostRequest, Post, UpdatePostRequest } from "@entities/post/model/types"
import { userApi } from "@entities/user/api/userApi"
import { UserSlime } from "@entities/user/model/types"

export const usePostActions = () => {
  const {
    setPosts,
    setTotal,
    setLoading,
    addPost: addPostToStore,
    updatePost: updatePostInStore,
    deletePost: deletePostFromStore,
  } = usePostStore()

  const fetchPosts = async (limit: number, skip: number) => {
    setLoading(true)
    try {
      const data = await postApi.fetchPosts(limit, skip) 
      setPosts(data.posts as Post[])
      setTotal(data.total as number)
      return data
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const searchPosts = async (query: string) => {
    if (!query) {
      return await fetchPosts(0, 10)
    }

    setLoading(true)
    try {
      const data = await postApi.searchPosts(query)
      setPosts(data.posts as Post[])
      setTotal(data.total as number)
      return data
    } catch (error) {
      console.error("게시물 검색 오류:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      return await fetchPosts(0, 10)
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
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
      throw error
    }
  }

  return {
    fetchPosts,
    searchPosts,
    fetchPostsByTag,
    createPost,
    updatePost,
    deletePost,
  }
}
