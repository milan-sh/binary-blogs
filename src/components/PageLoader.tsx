import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

function PageLoader({ className }: { className?: string }) {
  return (
    <div className={cn('grid min-h-[50svh] place-items-center', className)}>
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  )
}

export default PageLoader
