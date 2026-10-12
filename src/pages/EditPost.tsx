import { useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import PageLoader from '@/components/PageLoader'
import PostForm from '@/components/posts/PostForm'
import { usePost } from '@/hooks/use-posts'
import { useAppSelector } from '@/store/store'
import NotFound from './NotFound'

function EditPost() {
  const { slug } = useParams()
  const userId = useAppSelector((state) => state.auth.userData?.$id)
  const { data: post, isPending } = usePost(slug)

  if (isPending) return <PageLoader />

  //only the author gets the edit form
  if (!post || post.userId !== userId) {
    return (
      <NotFound
        title="Post not found"
        description="This post doesn’t exist, or you don’t have permission to edit it."
      />
    )
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader eyebrow="Editing" title={post.title} />
      {/* keyed so the form is rebuilt if a different post is opened */}
      <PostForm key={post.$id} post={post} />
    </div>
  )
}

export default EditPost
