<script lang="ts">
import { defineComponent } from 'vue'
import AccountsTable from './components/AccountsTable.vue'
import CreateAccountDialog from './components/CreateAccountDialog.vue'
import ChangePasswordDialog from './components/ChangePasswordDialog.vue'
import {
  AccountsTableComponent,
  ChangePasswordDialogComponent,
  CreateAccountDialogComponent,
} from './types'

export default defineComponent({
  components: {
    AccountsTable,
    CreateAccountDialog,
    ChangePasswordDialog,
  },
  methods: {
    async refreshTable() {
      const table = this.$refs.table as AccountsTableComponent
      await table.loadData()
    },
    onChangePassword(account: AccountDto) {
      const el = this.$refs.changePassword as ChangePasswordDialogComponent
      el.open(account)
    },
    openCreateAccountDialog() {
      const el = this.$refs.createAccount as CreateAccountDialogComponent
      el.open()
    },
  },
})
</script>

<template>
  <div>
    <el-row>
      <el-button @click="openCreateAccountDialog">Criar conta</el-button>
    </el-row>
    <accounts-table ref="table" @change-password="onChangePassword" />
    <change-password-dialog ref="changePassword" />
    <create-account-dialog ref="createAccount" @success="refreshTable" />
  </div>
</template>
