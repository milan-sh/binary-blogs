import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface NotFoundProps {
  title?: string
  description?: string
}

function NotFound({
  title = 'Page not found',
  description = 'The page you’re looking for doesn’t exist or has been moved.',
}: NotFoundProps) {
  return (
    <div className="container-page flex min-h-[60svh] flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="font-mono text-sm tracking-widest text-primary">404</p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="max-w-md text-muted-foreground">{description}</p>
      <Button asChild size="lg" className="mt-2">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  )
}

export default NotFound
