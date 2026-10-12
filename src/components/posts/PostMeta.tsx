import type { Post } from '@/appwrite/config'
import { cn, formatDate, readingTime } from '@/lib/utils'

function PostMeta({ post, className }: { post: Post; className?: string }) {
  return (
    <p className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}>
      <time dateTime={post.$createdAt}>{formatDate(post.$createdAt)}</time>
      <span aria-hidden>·</span>
      <span>{readingTime(post.content)} min read</span>
    </p>
  )
}

export default PostMeta
