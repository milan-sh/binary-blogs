import { ArrowRightIcon, NewspaperIcon, PenLineIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import PostCard from '@/components/posts/PostCard'
import { PostGrid, PostGridSkeleton } from '@/components/posts/PostGrid'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { usePosts } from '@/hooks/use-posts'
import { useAppSelector } from '@/store/store'

function Home() {
  const authStatus = useAppSelector((state) => state.auth.status)
  const { data: posts, isPending, isError } = usePosts('published')

  const [featured, ...rest] = posts ?? []

  return (
    <>
      <section className="relative border-b">
        <div aria-hidden className="bg-dots absolute inset-0 -z-10" />
        <div className="container-page flex flex-col items-start gap-6 py-16 sm:py-24">
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            01 — Write. Publish. Repeat.
          </p>
          <h1 className="max-w-3xl font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
            Ideas worth more than <span className="text-primary italic">ones and zeros</span>.
          </h1>
          <p className="max-w-xl text-lg text-pretty text-muted-foreground">
            Binary Blogs is a home for stories about code and craft. Read what others are building,
            or publish your own in a couple of minutes.
          </p>
          <div className="flex flex-wrap gap-3">
            {authStatus ? (
              <Button asChild size="lg">
                <Link to="/add-post">
                  <PenLineIcon data-icon="inline-start" />
                  Write a post
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link to="/signup">
                  Start writing
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" size="lg">
              <a href="#latest">Browse posts</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="latest" className="container-page scroll-mt-14 py-12 sm:py-16">
        {isPending ? (
          <div className="flex flex-col gap-14">
            <div className="grid gap-4 md:grid-cols-5 md:items-center md:gap-10">
              <Skeleton className="aspect-[16/10] rounded-xl md:col-span-3" />
              <div className="flex flex-col gap-3 md:col-span-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <PostGridSkeleton count={3} />
          </div>
        ) : !featured ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <NewspaperIcon />
              </EmptyMedia>
              <EmptyTitle>
                {authStatus ? 'No posts yet' : isError ? 'Log in to read posts' : 'Nothing published yet'}
              </EmptyTitle>
              <EmptyDescription>
                {authStatus
                  ? 'Be the first to publish something.'
                  : 'Log in to read and create posts.'}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link to={authStatus ? '/add-post' : '/login'}>
                  {authStatus ? 'Write the first post' : 'Log in'}
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="flex flex-col gap-14">
            <PostCard post={featured} featured />
            {rest.length > 0 && (
              <div className="flex flex-col gap-8">
                <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  Latest posts
                </h2>
                <PostGrid posts={rest} />
              </div>
            )}
          </div>
        )}
      </section>
    </>
  )
}

export default Home
