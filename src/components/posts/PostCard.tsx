import { ArrowUpRightIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import service, { type Post } from '@/appwrite/config'
import { Badge } from '@/components/ui/badge'
import { cn, excerpt } from '@/lib/utils'
import PostMeta from './PostMeta'

interface PostCardProps {
  post: Post
  //the featured variant is the wide card at the top of the home page
  featured?: boolean
}

function PostCard({ post, featured = false }: PostCardProps) {
  return (
    //the whole card is a link so a click anywhere opens the post
    <Link
      to={`/post/${post.$id}`}
      className={cn(
        'group flex h-full flex-col gap-4 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        featured && 'md:grid md:grid-cols-5 md:items-center md:gap-10'
      )}
    >
      <div
        className={cn(
          'relative aspect-[16/10] overflow-hidden rounded-xl border bg-muted',
          featured && 'md:col-span-3'
        )}
      >
        <img
          src={service.getFilePreview(post.featuredImage)}
          alt=""
          loading={featured ? 'eager' : 'lazy'}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {post.status === 'inactive' && (
          <Badge variant="secondary" className="absolute top-3 left-3">
            Draft
          </Badge>
        )}
      </div>

      <div className={cn('flex flex-1 flex-col gap-2', featured && 'md:col-span-2 md:gap-3')}>
        <PostMeta post={post} />
        <h2
          className={cn(
            'font-heading text-xl leading-snug font-semibold tracking-tight text-balance',
            featured && 'md:text-4xl md:leading-tight'
          )}
        >
          {post.title}
        </h2>
        <p className={cn('line-clamp-2 text-muted-foreground', featured ? 'md:line-clamp-3' : 'text-sm')}>
          {excerpt(post.content, featured ? 220 : 150)}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-primary">
          Read post
          <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}

export default PostCard
