<script lang="ts">
import { defineComponent } from 'vue'
import AccountApi from '@/api/account'
import { cnpjFormatter, roleFormatter } from '@/utils/columnFormatter'

interface AccountsTable {
  accounts: AccountDto[]
  search: string
}

export default defineComponent({
  setup() {
    return { cnpjFormatter, roleFormatter }
  },
  data(): AccountsTable {
    return {
      accounts: [],
      search: '',
    }
  },
  methods: {
    async loadData() {
      const { data } = await AccountApi.getAll()
      this.accounts = data
    },
    changePassword(account: AccountDto) {
      this.$emit('change-password', account)
    },
  },
  computed: {
    total(): number {
      return this.accounts.length
    },
    dataFiltered(): AccountDto[] {
      return this.accounts.filter((account) => {
        const str = account.companyName + ' ' + account.companyCNPJ
        return str.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    maxHeight(): number {
      const defaultHeight = 545
      const clientHeight = document.documentElement.clientHeight * 0.8
      return defaultHeight > clientHeight ? defaultHeight : clientHeight
    },
  },
  created() {
    this.loadData()
  },
})
</script>

<template>
  <el-row>
    <el-table ref="table" :data="dataFiltered" :max-height="maxHeight" stripe>
      <el-table-column
        prop="companyCNPJ"
        label="Empresa CNPJ"
        :formatter="cnpjFormatter"
      />
      <el-table-column prop="companyName" label="Empresa Nome" />
      <el-table-column prop="role" label="Função" :formatter="roleFormatter" />
      <el-table-column prop="headquarterName" label="Matriz" />
      <el-table-column align="right" width="200">
        <template #header>
          <el-input v-model="search" size="mini" placeholder="Pesquisar" />
        </template>
        <template #default="scope">
          <el-button size="mini" @click="changePassword(scope.row)">
            Alterar senha
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>
