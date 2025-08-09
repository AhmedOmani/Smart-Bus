import { GetDashboardStatsUseCase } from '../usecases/admin/GetDashboardStatsUseCase.js'
import { ApiAdminRepository } from '../../infrastructure/repositories/ApiAdminRepository.js'

// Application Service - Admin
export class AdminService {
  constructor() {
    this.adminRepository = new ApiAdminRepository()
    this.getDashboardStatsUseCase = new GetDashboardStatsUseCase(this.adminRepository)
  }

  async getDashboardStats() {
    return await this.getDashboardStatsUseCase.execute()
  }

  async getUsers(filters = {}) {
    return await this.adminRepository.getUsers(filters)
  }

  async getBuses(filters = {}) {
    return await this.adminRepository.getBuses(filters)
  }

  async getStudents(filters = {}) {
    return await this.adminRepository.getStudents(filters)
  }
}
