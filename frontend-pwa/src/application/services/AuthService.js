import { LoginUseCase } from '../usecases/auth/LoginUseCase.js'
import { ApiAuthRepository } from '../../infrastructure/repositories/ApiAuthRepository.js'

// Application Service - Auth
export class AuthService {
  constructor() {
    this.authRepository = new ApiAuthRepository()
    this.loginUseCase = new LoginUseCase(this.authRepository)
  }

  async login(credentials) {
    return await this.loginUseCase.execute(credentials)
  }

  async logout() {
    return await this.authRepository.logout()
  }

  async getCurrentUser() {
    return await this.authRepository.getCurrentUser()
  }

  async changePassword(data) {
    return await this.authRepository.changePassword(data)
  }

  getStoredToken() {
    return localStorage.getItem('token')
  }

  getStoredRole() {
    return localStorage.getItem('role')
  }

  isAuthenticated() {
    return !!this.getStoredToken()
  }
}
