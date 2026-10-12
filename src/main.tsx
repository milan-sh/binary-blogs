import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import AuthLayout from './components/AuthLayout'
import SetupNotice from './components/SetupNotice'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/sonner'
import { TooltipProvider } from './components/ui/tooltip'
import { isAppwriteConfigured } from './conf/conf'
import './index.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Post from './pages/Post'
import { store } from './store/store'

//only the pages a first-time reader lands on are in the main bundle; the forms
//and the editor are loaded when they are visited
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const AllPosts = lazy(() => import('./pages/AllPosts'))
const AddPost = lazy(() => import('./pages/AddPost'))
const EditPost = lazy(() => import('./pages/EditPost'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: 'signup',
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: 'all-posts',
        element: (
          <AuthLayout authentication>
            <AllPosts />
          </AuthLayout>
        ),
      },
      {
        path: 'add-post',
        element: (
          <AuthLayout authentication>
            <AddPost />
          </AuthLayout>
        ),
      },
      {
        path: 'edit-post/:slug',
        element: (
          <AuthLayout authentication>
            <EditPost />
          </AuthLayout>
        ),
      },
      {
        path: 'post/:slug',
        element: <Post />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      {isAppwriteConfigured ? (
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <RouterProvider router={router} />
            </TooltipProvider>
          </QueryClientProvider>
        </Provider>
      ) : (
        <SetupNotice />
      )}
      <Toaster position="bottom-right" />
    </ThemeProvider>
  </StrictMode>
)
