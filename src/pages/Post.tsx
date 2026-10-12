import DOMPurify from 'dompurify'
import { ArrowLeftIcon, LinkIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import service from '@/appwrite/config'
import PageLoader from '@/components/PageLoader'
import PostMeta from '@/components/posts/PostMeta'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePost, useDeletePost } from '@/hooks/use-posts'
import { cn, getErrorMessage, proseClasses } from '@/lib/utils'
import { useAppSelector } from '@/store/store'
import NotFound from './NotFound'

function Post() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const userData = useAppSelector((state) => state.auth.userData)
  const { data: post, isPending } = usePost(slug)
  const deletePost = useDeletePost()

  //post content is user-written html, so it is sanitised before it is rendered
  const content = useMemo(() => (post ? DOMPurify.sanitize(post.content) : ''), [post])

  if (isPending) return <PageLoader />

  const isAuthor = Boolean(post && userData && post.userId === userData.$id)

  //drafts are only visible to the person who wrote them
  if (!post || (post.status === 'inactive' && !isAuthor)) {
    return (
      <NotFound
        title="Post not found"
        description="This post doesn’t exist, or it hasn’t been published yet."
      />
    )
  }

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(post)
      toast.success('Post deleted.')
      navigate('/all-posts')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard.')
    } catch {
      toast.error('Could not copy the link.')
    }
  }

  return (
    <article className="container-page max-w-3xl py-10 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-8">
        <Button asChild variant="ghost" className="-ml-2.5 text-muted-foreground">
          <Link to="/">
            <ArrowLeftIcon data-icon="inline-start" />
            All posts
          </Link>
        </Button>

        <div className="flex items-center gap-1.5">
          <Button variant="outline" onClick={copyLink}>
            <LinkIcon data-icon="inline-start" />
            Copy link
          </Button>
          {isAuthor && (
            <>
              <Button asChild variant="outline">
                <Link to={`/edit-post/${post.$id}`}>
                  <PencilIcon data-icon="inline-start" />
                  Edit
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2Icon data-icon="inline-start" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                    <AlertDialogDescription>
                      &ldquo;{post.title}&rdquo; and its cover image will be removed permanently.
                      This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep post</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      disabled={deletePost.isPending}
                      onClick={handleDelete}
                    >
                      Delete post
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <header className="flex flex-col gap-4 pb-8">
        <div className="flex items-center gap-3">
          {post.status === 'inactive' && <Badge variant="secondary">Draft</Badge>}
          <PostMeta post={post} />
        </div>
        <h1 className="font-heading text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
          {post.title}
        </h1>
      </header>

      <img
        src={service.getFilePreview(post.featuredImage)}
        alt=""
        className="aspect-[16/9] w-full rounded-xl border bg-muted object-cover"
      />

      <div
        className={cn(proseClasses, 'pt-10 sm:prose-lg')}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  )
}

export default Post
