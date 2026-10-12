import { FileSearchIcon, PenLineIcon, SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
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
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePosts } from '@/hooks/use-posts'
import { htmlToText } from '@/lib/utils'
import { useAppSelector } from '@/store/store'

const filters = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'drafts', label: 'Drafts' },
  { value: 'mine', label: 'Mine' },
] as const

type Filter = (typeof filters)[number]['value']

function AllPosts() {
  const userId = useAppSelector((state) => state.auth.userData?.$id)
  const { data: posts, isPending, isError, refetch } = usePosts('all')
  const [search, setSearch] = useState('')

  //the filter lives in the url so "My posts" in the user menu can link to it
  const [searchParams, setSearchParams] = useSearchParams()
  const param = searchParams.get('filter')
  const filter: Filter = filters.some((item) => item.value === param) ? (param as Filter) : 'all'

  const visiblePosts = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (posts ?? []).filter((post) => {
      if (filter === 'published' && post.status !== 'active') return false
      if (filter === 'drafts' && post.status !== 'inactive') return false
      if (filter === 'mine' && post.userId !== userId) return false
      if (!term) return true
      return (
        post.title.toLowerCase().includes(term) ||
        htmlToText(post.content).toLowerCase().includes(term)
      )
    })
  }, [posts, filter, search, userId])

  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader
        eyebrow="Library"
        title="All posts"
        description="Everything on Binary Blogs, including drafts that are not live yet."
      >
        <Button asChild size="lg">
          <Link to="/add-post">
            <PenLineIcon data-icon="inline-start" />
            New post
          </Link>
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-3 pb-10 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={filter}
          onValueChange={(value) =>
            setSearchParams(value === 'all' ? {} : { filter: value }, { replace: true })
          }
        >
          <TabsList>
            {filters.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <InputGroup className="sm:max-w-xs">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder="Search posts…"
            aria-label="Search posts"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </InputGroup>
      </div>

      {isPending ? (
        <PostGridSkeleton />
      ) : isError ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyTitle>Couldn&rsquo;t load posts</EmptyTitle>
            <EmptyDescription>Check your connection and try again.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      ) : visiblePosts.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileSearchIcon />
            </EmptyMedia>
            <EmptyTitle>No posts found</EmptyTitle>
            <EmptyDescription>
              {posts.length === 0
                ? 'Nothing has been written yet. Start with your first post.'
                : 'Try a different search term or filter.'}
            </EmptyDescription>
          </EmptyHeader>
          {posts.length === 0 && (
            <EmptyContent>
              <Button asChild>
                <Link to="/add-post">Write a post</Link>
              </Button>
            </EmptyContent>
          )}
        </Empty>
      ) : (
        <PostGrid posts={visiblePosts} />
      )}
    </div>
  )
}

export default AllPosts
