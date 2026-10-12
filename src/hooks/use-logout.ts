import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import authService from '@/appwrite/auth'
import { getErrorMessage } from '@/lib/utils'
import { logout } from '@/store/authSlice'
import { useAppDispatch } from '@/store/store'

export function useLogout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return async () => {
    try {
      await authService.logout()
      //leave the current page first, otherwise a protected route would bounce to /login
      await navigate('/')
      dispatch(logout())
      queryClient.clear()
      toast.success('You have been logged out.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }
}
