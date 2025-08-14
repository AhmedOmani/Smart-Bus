import { AdminRepository } from '../../domain/repositories/AdminRepository.js'
import api from '../../lib/api.js'

// Infrastructure Implementation - Admin Repository
export class ApiAdminRepository extends AdminRepository {
  // Dashboard
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard')
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get dashboard stats')
    }
  }

  // User Management
  async getUsers() {
    try {
      const response = await api.get('/admin/users')
      return response.data.data.users
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get users')
    }
  }

  async searchUsers(filters) {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      const response = await api.get(`/admin/users/search?${params}`)
      return response.data.data.users
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search users')
    }
  }

  async createUser(userData) {
    try {
      const response = await api.post('/admin/users', userData)
      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user')
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData)
      return response.data.data.user
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user')
    }
  }

  async deleteUser(userId) {
    try {
      await api.delete(`/admin/users/${userId}`)
      return true
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user')
    }
  }

  // Student Management
  async getStudents() {
    try {
      const response = await api.get('/admin/students')
      return response.data.data.students
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get students')
    }
  }

  async createStudent(studentData) {
    try {
      const response = await api.post('/admin/students', studentData)
      return response.data.data.student
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create student')
    }
  }

  async updateStudent(studentId, studentData) {
    try {
      const response = await api.put(`/admin/students/${studentId}`, studentData)
      return response.data.data.student
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update student')
    }
  }

  async deleteStudent(studentId) {
    try {
      await api.delete(`/admin/students/${studentId}`)
      return true
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete student')
    }
  }

  // Bus Management
  async getBuses() {
    try {
      const response = await api.get('/admin/buses')
      return response.data.data.buses
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get buses')
    }
  }

  async createBus(busData) {
    try {
      const response = await api.post('/admin/buses', busData)
      return response.data.data.bus
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create bus')
    }
  }

  async updateBus(busId, busData) {
    try {
      const response = await api.put(`/admin/buses/${busId}`, busData)
      return response.data.data.bus
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update bus')
    }
  }

  async deleteBus(busId) {
    try {
      await api.delete(`/admin/buses/${busId}`)
      return true
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete bus')
    }
  }

  // Supervisor Management
  async getSupervisors() {
    try {
      const response = await api.get('/admin/supervisors')
      console.log('🌐 ApiAdminRepository: Supervisors response:', response.data)
      return response.data.data.supervisors
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get supervisors')
    }
  }

  // Absences & Permissions
  async getAbsences(filters = {}) {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      const response = await api.get(`/admin/absences?${params}`)
      return response.data.data.absences
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get absences')
    }
  }

  async getPermissions(filters = {}) {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      const response = await api.get(`/admin/permissions?${params}`)
      return response.data.data.permissions
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get permissions')
    }
  }

  // Credentials Management
  async getAllCredentials() {
    try {
      console.log('🌐 ApiAdminRepository: Making credentials request...')
      const response = await api.get('/admin/credentials')
      console.log('🌐 ApiAdminRepository: Credentials response:', response.data)
      return response.data.data.credentials
    } catch (error) {
      console.error('🌐 ApiAdminRepository: Credentials error:', error)
      throw new Error(error.response?.data?.message || 'Failed to get credentials')
    }
  }

  // Bus Tracking
  async getBusesWithLocations() {
    try {
      const response = await api.get('/admin/buses/locations')
      return response.data.data.buses
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get buses locations')
    }
  }
}
