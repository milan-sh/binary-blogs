import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface AuthCardProps {
  title: string
  description: string
  footer: ReactNode
  children: ReactNode
}

//shared shell of the login and signup pages
function AuthCard({ title, description, footer, children }: AuthCardProps) {
  return (
    <div className="relative grid min-h-[calc(100svh-3.5rem)] place-items-center px-4 py-12">
      <div aria-hidden className="bg-dots absolute inset-0 -z-10" />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">{footer}</CardFooter>
      </Card>
    </div>
  )
}

export default AuthCard
