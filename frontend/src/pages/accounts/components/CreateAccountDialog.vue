<script lang="ts">
import { defineComponent } from 'vue'
import AccountApi from '@/api/account'
import { ElMessage } from 'element-plus'
import { isCNPJ } from '@/utils/validate'

interface CreateAccountForm {
  isDialogVisible: boolean
  accounts: AccountDto[]
  form: Form
  formLabelWidth: string
  rules: Record<string, unknown>
  isButtonLoading: boolean
}

interface Form {
  cnpj: string
  name: string
  password: string
  role: string
  headquarterCNPJ?: string
}

export default defineComponent({
  data(): CreateAccountForm {
    const cnpjValidator = (
      rule: unknown,
      value: string,
      callback: Function
    ) => {
      if (!value) return callback()
      if (!isCNPJ(value)) {
        return callback(new Error('CNPJ inválido'))
      }
      const form = this.$refs.form as ElForm
      form.validateField('cnpj')
      return callback()
    }
    return {
      isDialogVisible: false,
      accounts: [],
      form: {
        cnpj: '',
        name: '',
        password: '',
        role: 'Client',
        headquarterCNPJ: undefined,
      },
      formLabelWidth: '120px',
      rules: {
        cnpj: [
          {
            required: true,
            message: 'Por favor insira um CNPJ',
            trigger: 'blur',
          },
          {
            validator: cnpjValidator,
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: 'Por favor insira um nome',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            min: 6,
            message: 'Por favor insira uma senha de no minimo 6 caracteres',
            trigger: 'blur',
          },
        ],
        headquarterCNPJ: [
          {
            validator: cnpjValidator,
            trigger: 'blur',
          },
        ],
      },
      isButtonLoading: false,
    }
  },
  methods: {
    open() {
      this.loadAccounts().then(() => (this.isDialogVisible = true))
    },
    submit() {
      const form = this.$refs.form as ElForm
      form.validate(async (valid: boolean) => {
        if (!valid) return
        try {
          this.isButtonLoading = true
          await AccountApi.create({ ...this.form })
          ElMessage.success('Conta criada com sucesso')
          this.$emit('success')
          this.close()
        } catch (err) {
          ElMessage.error('Erro ao tentar criar conta')
        } finally {
          this.isButtonLoading = false
        }
      })
    },
    reset() {
      this.form = {
        cnpj: '',
        name: '',
        password: '',
        role: 'Client',
        headquarterCNPJ: undefined,
      }
      const form = this.$refs.form as ElForm
      form.resetFields()
    },
    close() {
      this.reset()
      this.isDialogVisible = false
    },
    async loadAccounts() {
      const { data } = await AccountApi.getAll()
      this.accounts = data
    },
  },
})
</script>

<template>
  <el-dialog
    title="Criar uma nova conta"
    v-model="isDialogVisible"
    width="500px"
  >
    <el-form ref="form" :model="form" status-icon :rules="rules">
      <el-form-item
        label="Empresa CNPJ"
        :label-width="formLabelWidth"
        prop="cnpj"
      >
        <el-input v-model="form.cnpj" v-mask="'##.###.###/####-##'" />
      </el-form-item>
      <el-form-item
        label="Empresa Nome"
        :label-width="formLabelWidth"
        prop="name"
      >
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Senha" :label-width="formLabelWidth" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item label="Função" :label-width="formLabelWidth">
        <el-radio v-model="form.role" label="Client">
          Cliente
        </el-radio>
        <el-radio v-model="form.role" label="Admin">
          Admin
        </el-radio>
      </el-form-item>
      <el-form-item
        label="Matriz"
        :label-width="formLabelWidth"
        prop="headquarterCNPJ"
      >
        <el-select
          v-model="form.headquarterCNPJ"
          filterable
          clearable
          placeholder="Selecionar Matriz"
        >
          <el-option
            v-for="item in accounts"
            :key="item.companyCNPJ"
            :label="item.companyName"
            :value="item.companyCNPJ"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">
          Cancelar
        </el-button>
        <el-button type="primary" :loading="isButtonLoading" @click="submit">
          Criar conta
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
