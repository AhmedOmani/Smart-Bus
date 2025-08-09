// Application Use Case - Login
export class LoginUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository
  }

  async execute(credentials) {
    // Validation
    if (!credentials.username || !credentials.password) {
      throw new Error('Username and password are required')
    }

    if (credentials.username.length < 3) {
      throw new Error('Username must be at least 3 characters')
    }

    // Execute login
    return await this.authRepository.login(credentials)
  }
}
