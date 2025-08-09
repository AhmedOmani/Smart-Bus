import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { LoginForm } from '../components/auth/LoginForm.jsx'
import { useEffect } from 'react'

// Presentation Page - Login
export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, loading, error, isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔄 User already authenticated, redirecting...', user)
      navigate('/admin/dashboard', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const handleLogin = async (credentials) => {
    try {
      console.log('🔑 Starting login with credentials:', credentials)
      const loggedInUser = await login(credentials)
      console.log('✅ Login successful, user:', loggedInUser)
      
      if (loggedInUser.isAdmin()) {
        console.log('🚀 Navigating to admin dashboard...')
        navigate('/admin/dashboard', { replace: true })
      } else {
        // Handle other user types or show error
        throw new Error('Only admin access is currently supported')
      }
    } catch (err) {
      // Error is handled by the hook, but we can log it
      console.error('❌ Login failed:', err)
    }
  }

  return (
    <LoginForm
      onSubmit={handleLogin}
      loading={loading}
      error={error}
    />
  )
}
