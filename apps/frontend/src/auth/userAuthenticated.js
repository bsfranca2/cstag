import { UserRole } from '../users/userRole';

export class UserAuthenticated {
  constructor(data) {
    this.username = data.username;
    this.role = new UserRole(data.role);
    this.companyName = data.companyName;
    this.headquarterName = data.headquarterName;
  }

  get displayName() {
    return [this.username, this.companyName, this.headquarterName]
      .filter(Boolean)
      .join(' - ');
  }

  get isAdmin() {
    return this.role.isAdmin;
  }

  get isUser() {
    return this.role.isUser;
  }
}
