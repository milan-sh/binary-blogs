import { Suspense, useEffect, useState } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import authService from '@/appwrite/auth'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import PageLoader from '@/components/PageLoader'
import { login, logout } from '@/store/authSlice'
import { useAppDispatch } from '@/store/store'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useAppDispatch()

  //on page load, check whether there is a logged in user and update the store
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => dispatch(userData ? login(userData) : logout()))
      .finally(() => setLoading(false))
  }, [dispatch])

  if (loading) return <PageLoader className="min-h-svh" />

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}

export default App
