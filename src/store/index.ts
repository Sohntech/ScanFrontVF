import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import presenceReducer from './slices/presenceSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    presence: presenceReducer,
    users: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch