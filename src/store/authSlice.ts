import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/appwrite/auth'

interface AuthState {
  //tracks whether the user is logged in or logged out
  status: boolean
  userData: User | null
}

const initialState: AuthState = {
  status: false,
  userData: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.status = true
      state.userData = action.payload
    },
    logout: (state) => {
      state.status = false
      state.userData = null
    },
  },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
