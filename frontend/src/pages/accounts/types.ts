export interface AccountsTableComponent {
  loadData: () => Promise<void>
}

export interface ChangePasswordDialogComponent {
  open: (account: AccountDto) => void
}

export interface CreateAccountDialogComponent {
  open: () => void
}
