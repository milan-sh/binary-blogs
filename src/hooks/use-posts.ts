import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import service, { type Post, type PostStatus } from '@/appwrite/config'
import { useAppSelector } from '@/store/store'

export interface PostInput {
  title: string
  slug: string
  content: string
  status: PostStatus
  image: File | null
}

// 'published' is what readers see, 'all' also includes drafts
export function usePosts(scope: 'published' | 'all' = 'published') {
  return useQuery({
    queryKey: ['posts', scope],
    queryFn: () => (scope === 'all' ? service.getPosts([]) : service.getPosts()),
  })
}

export function usePost(slug: string | undefined) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => service.getPost(slug!),
    enabled: Boolean(slug),
  })
}

// Creates a post, or updates `existing` when it is passed
export function useSavePost(existing?: Post) {
  const queryClient = useQueryClient()
  const userId = useAppSelector((state) => state.auth.userData?.$id)

  return useMutation({
    mutationFn: async ({ image, title, slug, content, status }: PostInput) => {
      if (existing) {
        const file = image ? await service.uploadFile(image) : null
        try {
          const post = await service.updatePost(existing.$id, {
            title,
            content,
            status,
            featuredImage: file ? file.$id : existing.featuredImage,
          })
          //the old cover is only removed once the post points at the new one
          if (file) void service.deleteFile(existing.featuredImage)
          return post
        } catch (error) {
          if (file) void service.deleteFile(file.$id)
          throw error
        }
      }

      if (!userId) throw new Error('You need to be logged in to publish.')
      if (!image) throw new Error('Add a cover image.')

      const file = await service.uploadFile(image)
      try {
        return await service.createPost({
          title,
          slug,
          content,
          status,
          featuredImage: file.$id,
          userId,
        })
      } catch (error) {
        //don't leave an orphaned upload behind
        void service.deleteFile(file.$id)
        throw error
      }
    },
    onSuccess: (post) => {
      queryClient.setQueryData(['post', post.$id], post)
      return queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (post: Post) => {
      await service.deletePost(post.$id)
      void service.deleteFile(post.featuredImage)
    },
    onSuccess: (_, post) => {
      queryClient.removeQueries({ queryKey: ['post', post.$id] })
      return queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
