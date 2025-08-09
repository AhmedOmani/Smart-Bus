// Domain Entity - User
export class User {
  constructor({ id, name, email, role, username, nationalId, createdAt }) {
    this.id = id
    this.name = name
    this.email = email
    this.role = role
    this.username = username
    this.nationalId = nationalId
    this.createdAt = createdAt
  }

  isAdmin() {
    return this.role === 'ADMIN'
  }

  isSupervisor() {
    return this.role === 'SUPERVISOR'
  }

  isParent() {
    return this.role === 'PARENT'
  }
}
