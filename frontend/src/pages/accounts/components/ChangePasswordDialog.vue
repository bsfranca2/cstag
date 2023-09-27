<script lang="ts">
import { defineComponent } from 'vue'
import AccountApi from '@/api/account'
import { ElMessage } from 'element-plus'

interface ChangePasswordForm {
  account?: AccountDto
  form: Form
  isDialogVisible: boolean
  formLabelWidth: string
}

interface Form {
  password: string
  confirmPassword: string
}

export default defineComponent({
  data: (): ChangePasswordForm => ({
    account: undefined,
    form: {
      password: '',
      confirmPassword: '',
    },
    isDialogVisible: false,
    formLabelWidth: '120px',
  }),
  methods: {
    resetForm() {
      this.form = { password: '', confirmPassword: '' }
    },
    close() {
      this.isDialogVisible = false
      this.resetForm()
    },
    async submit() {
      if (!this.account) throw Error('Account invalid')

      const { companyCNPJ } = this.account
      const { password, confirmPassword } = this.form

      if (password !== confirmPassword)
        return ElMessage.error('As senhas são diferentes')

      try {
        await AccountApi.changePassword(companyCNPJ, { password })
        ElMessage.success('Senha alterada com sucesso')
        this.$emit('success')
        this.close()
      } catch (err) {
        ElMessage.error('Erro ao tentar alterar a senha')
      }
    },
    open(account: AccountDto) {
      this.account = account
      this.isDialogVisible = true
    },
  },
  computed: {
    dialogTitle(): string {
      const companyName = this.account?.companyName
      const baseTitle = 'Alterar senha'
      return companyName ? `${baseTitle} - ${companyName}` : baseTitle
    },
  },
})
</script>

<template>
  <el-dialog v-model="isDialogVisible" :title="dialogTitle" width="500px">
    <el-form :model="form">
      <el-form-item label="Senha" :label-width="formLabelWidth">
        <el-input v-model="form.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Confirmar senha" :label-width="formLabelWidth">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">
          Cancelar
        </el-button>
        <el-button type="primary" @click="submit">
          Salvar senha
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
