import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/store'

interface AuthLayoutProps {
  children: ReactNode
  authentication?: boolean
}

function AuthLayout({ children, authentication = true }: AuthLayoutProps) {
  const authStatus = useAppSelector((state) => state.auth.status)
  const location = useLocation()

  // The page needs a logged in user but there is none: send them to login,
  // remembering where they were headed.
  if (authentication && !authStatus) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // The page is only for guests (login / signup) but the user is already
  // logged in: send them back to where they came from, or home.
  if (!authentication && authStatus) {
    const from = (location.state as { from?: string } | null)?.from
    return <Navigate to={from ?? '/'} replace />
  }

  return <>{children}</>
}

export default AuthLayout
