import { AuthRepository } from '../../domain/repositories/AuthRepository.js'
import { User } from '../../domain/entities/User.js'
import api from '../../lib/api.js'

// Infrastructure Implementation - Auth Repository
export class ApiAuthRepository extends AuthRepository {
  async login(credentials) {
    try {
      console.log('🌐 ApiAuthRepository: Making login request...')
      const response = await api.post('/auth/login', credentials)
      console.log('🌐 ApiAuthRepository: Login response:', response.data)
      
      const { token, user } = response.data.data
      
      // Store token and user data
      localStorage.setItem('token', token)
      localStorage.setItem('role', user.role)
      localStorage.setItem('user', JSON.stringify(user))
      
      console.log('🌐 ApiAuthRepository: Creating User entity with:', user)
      return new User(user)
    } catch (error) {
      console.error('🌐 ApiAuthRepository: Login error:', error)
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
    }
  }

  async getCurrentUser() {
    try {
      // First try to get from localStorage
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        return new User(JSON.parse(storedUser))
      }
      
      // If not in storage, fetch from API
      const response = await api.get('/auth/me')
      const user = response.data.data.user
      localStorage.setItem('user', JSON.stringify(user))
      return new User(user)
    } catch (error) {
      throw new Error('Failed to get current user')
    }
  }

  async changePassword(data) {
    try {
      await api.post('/auth/change-password', data)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password change failed')
    }
  }
}
