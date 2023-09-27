export const Admin = 'ADMIN';
export const User = 'USER';

export class UserRole {
  constructor(role) {
    this.value = role;
  }

  get isAdmin() {
    return this.value === Admin;
  }

  get isUser() {
    return this.value === User;
  }

  isEqual(role) {
    return this.value === role;
  }

  get roleName() {
    if (this.isUser) return 'Cliente';
    if (this.isAdmin) return 'Admin';
    return this.role;
  }

  static getOptions() {
    return [
      { value: User, label: 'Cliente' },
      { value: Admin, label: 'Admin' },
    ];
  }
}
