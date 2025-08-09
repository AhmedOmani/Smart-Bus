// Application Use Case - Get Dashboard Stats
export class GetDashboardStatsUseCase {
  constructor(adminRepository) {
    this.adminRepository = adminRepository
  }

  async execute() {
    const stats = await this.adminRepository.getDashboardStats()
    
    // Business logic transformations
    return {
      totalUsers: stats.totalUsers || 0,
      totalStudents: stats.totalStudents || 0,
      activeBuses: stats.activeBuses || 0,
      // Calculate percentage changes if historical data exists
      userGrowth: this.calculateGrowth(stats.totalUsers, stats.previousUsers),
      studentGrowth: this.calculateGrowth(stats.totalStudents, stats.previousStudents)
    }
  }

  calculateGrowth(current, previous) {
    if (!previous || previous === 0) return 0
    return ((current - previous) / previous) * 100
  }
}
