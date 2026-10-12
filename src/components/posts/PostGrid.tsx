import type { Post } from '@/appwrite/config'
import { Skeleton } from '@/components/ui/skeleton'
import PostCard from './PostCard'

const gridClasses = 'grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3'

export function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className={gridClasses}>
      {posts.map((post) => (
        <PostCard key={post.$id} post={post} />
      ))}
    </div>
  )
}

export function PostGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={gridClasses} aria-busy aria-label="Loading posts">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex flex-col gap-4">
          <Skeleton className="aspect-[16/10] rounded-xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
