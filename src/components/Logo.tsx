import { cn } from '@/lib/utils'

function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-md bg-primary font-mono text-xs font-bold text-primary-foreground"
      >
        01
      </span>
      <span className="font-heading text-lg font-semibold tracking-tight">
        Binary Blogs
      </span>
    </span>
  )
}

export default Logo
