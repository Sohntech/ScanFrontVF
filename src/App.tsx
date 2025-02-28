import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { getProfile } from '@/store/slices/authSlice'
import Layout from '@/components/Layout'
import PrivateRoute from '@/components/PrivateRoute'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ResetPassword from '@/pages/ResetPassword'
import AdminDashboard from '@/pages/admin/Dashboard'
import VigilDashboard from '@/pages/vigil/Dashboard'
import StudentDashboard from '@/pages/student/Dashboard'

function App() {
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (token && !user) {
      dispatch(getProfile())
    }
  }, [dispatch, token, user])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route path="dashboard" element={
          <PrivateRoute>
            {user?.role === 'ADMIN' && <AdminDashboard />}
            {user?.role === 'VIGIL' && <VigilDashboard />}  
            {user?.role === 'APPRENANT' && <StudentDashboard />}
          </PrivateRoute>
        } />
      </Route>
    </Routes>
  )
}

export default App