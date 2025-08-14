// Domain Repository Interface - Admin
export class AdminRepository {
  // Dashboard
  async getDashboardStats() {
    throw new Error('Method not implemented')
  }

  // User Management
  async getUsers() {
    throw new Error('Method not implemented')
  }

  async searchUsers(filters) {
    throw new Error('Method not implemented')
  }

  async createUser(userData) {
    throw new Error('Method not implemented')
  }

  async updateUser(userId, userData) {
    throw new Error('Method not implemented')
  }

  async deleteUser(userId) {
    throw new Error('Method not implemented')
  }

  // Student Management
  async getStudents() {
    throw new Error('Method not implemented')
  }

  async createStudent(studentData) {
    throw new Error('Method not implemented')
  }

  async updateStudent(studentId, studentData) {
    throw new Error('Method not implemented')
  }

  async deleteStudent(studentId) {
    throw new Error('Method not implemented')
  }

  // Bus Management
  async getBuses() {
    throw new Error('Method not implemented')
  }

  async createBus(busData) {
    throw new Error('Method not implemented')
  }

  async updateBus(busId, busData) {
    throw new Error('Method not implemented')
  }

  async deleteBus(busId) {
    throw new Error('Method not implemented')
  }

  // Supervisor Management
  async getSupervisors() {
    throw new Error('Method not implemented')
  }

  // Absences & Permissions
  async getAbsences(filters) {
    throw new Error('Method not implemented')
  }

  async getPermissions(filters) {
    throw new Error('Method not implemented')
  }

  // Credentials Management
  async getAllCredentials() {
    throw new Error('Method not implemented')
  }

  // Bus Tracking
  async getBusesWithLocations() {
    throw new Error('Method not implemented')
  }
}