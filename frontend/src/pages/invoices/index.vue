<script lang="ts">
import { defineComponent } from 'vue'
import SemPararApi from '@/api/semparar'
import { ElMessage } from 'element-plus'
import InvoiceApi from '@/api/invoice'
import { dateFormatter } from '@/utils/columnFormatter'

interface Invoices {
  file?: File
  isLoading: boolean
  invoices: InvoiceDto[]
  isTableLoading: boolean
}

export default defineComponent({
  setup() {
    return { dateFormatter }
  },
  data(): Invoices {
    return {
      file: undefined,
      isLoading: false,
      invoices: [],
      isTableLoading: false,
    }
  },
  methods: {
    handleFileUpload() {
      this.file = (this.$refs as any).file.files[0]
    },
    async submitFile() {
      try {
        const formData = new FormData()
        if (this.file) formData.append('file', this.file)
        this.isLoading = true
        await SemPararApi.uploadInvoice(formData)
        ElMessage.success('Planilha enviada!')
        this.loadData()
      } catch (err) {
        ElMessage.error('Erro ao tentar enviar a planilha!')
      } finally {
        this.isLoading = false
      }
    },
    async loadData() {
      try {
        this.isTableLoading = true
        const { data } = await InvoiceApi.list()
        this.invoices = data
      } catch (err) {
        ElMessage.error('Erro ao tentar carregar dados de fatura')
      } finally {
        this.isTableLoading = false
      }
    },
    async deleteInvoice(invoice: InvoiceDto) {
      try {
        this.isTableLoading = true
        await InvoiceApi.delete(invoice.number)
        ElMessage.success('Fatura apagada com sucesso')
      } catch (err) {
        ElMessage.error('Erro ao tentar apagar fatura')
      } finally {
        this.isTableLoading = false
      }
      this.loadData()
    },
  },
  created() {
    this.loadData()
  },
})
</script>

<template>
  <div>
    <el-row>
      <input
        type="file"
        ref="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        @change="handleFileUpload"
      />
      <label for="file">
        <el-button :loading="isLoading" @click="submitFile">
          Importar planilha
        </el-button>
      </label>
    </el-row>
    <el-row>
      <el-table
        :data="invoices"
        ref="table"
        style="width: 100%"
        strip
        v-loading="isTableLoading"
      >
        <el-table-column prop="number" label="Número" />
        <el-table-column
          :formatter="dateFormatter"
          prop="issueDate"
          label="Data de emissão"
        />
        <el-table-column prop="operatorCompany" label="Operadora" />
        <el-table-column label="Status">
          <template #default="scope">
            <el-tag
              :type="scope.row.progress.isDone ? 'success' : 'warning'"
              disable-transitions
              >{{ scope.row.progress.percentage }}%</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column align="right" width="100">
          <template #default="scope">
            <el-button
              type="danger"
              size="mini"
              @click="deleteInvoice(scope.row)"
            >
              Apagar
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
