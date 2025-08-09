import { useState, useEffect } from 'react'
import { AuthService } from '../../application/services/AuthService.js'

// Presentation Hook - Auth
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const authService = new AuthService()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      }
    } catch (err) {
      setError(err.message)
      // Clear invalid token
      await authService.logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      setError(null)
      console.log('🎯 useAuth: Starting login...')
      const user = await authService.login(credentials)
      console.log('🎯 useAuth: Login response:', user)
      setUser(user)
      console.log('🎯 useAuth: User state updated')
      return user
    } catch (err) {
      console.log('🎯 useAuth: Login error:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      setError(null)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin() || false,
    isSupervisor: user?.isSupervisor() || false,
    isParent: user?.isParent() || false
  }
}
