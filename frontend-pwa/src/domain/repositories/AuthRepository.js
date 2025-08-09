// Domain Repository Interface - Auth
export class AuthRepository {
  async login(credentials) {
    throw new Error('Method must be implemented')
  }

  async logout() {
    throw new Error('Method must be implemented')
  }

  async getCurrentUser() {
    throw new Error('Method must be implemented')
  }

  async changePassword(data) {
    throw new Error('Method must be implemented')
  }
}
