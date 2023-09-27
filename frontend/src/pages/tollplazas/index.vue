<script lang="ts">
import { defineComponent, nextTick } from 'vue'
import TollPlazaApi from '@/api/tollplaza'
import { toServeDate, fromServerDate, toLocaleDate } from '@/utils/format'
import { TableColumn } from 'element-plus/lib/el-table/src/table.type'
import { ElMessage } from 'element-plus'

interface TollPlazas {
  randomKey: number
  periodList: TollPlazaPeriodDto[]
  isUploadModalVisible: boolean
  uploadForm: UploadForm
  formLabelWidth: string
  isButtonLoading: boolean
  rules: Record<string, unknown>
  isEditModalVisible: boolean
  editFor?: EditForm
}

interface UploadForm extends Period {
  file?: File
}

interface EditForm extends Period {
  id: number
}

interface Period {
  startOfPeriod?: Date
  endOfPeriod?: Date
}

export default defineComponent({
  data(): TollPlazas {
    return {
      randomKey: 1,
      periodList: [],
      isUploadModalVisible: false,
      formLabelWidth: '140px',
      isButtonLoading: false,
      uploadForm: {
        file: undefined,
        startOfPeriod: undefined,
        endOfPeriod: undefined,
      },
      rules: {
        startOfPeriod: [
          {
            required: true,
            message: 'Por favor insira uma data',
            trigger: 'blur',
          },
        ],
        endOfPeriod: [
          {
            required: true,
            message: 'Por favor insira uma data',
            trigger: 'blur',
          },
        ],
        file: [
          {
            required: true,
            message: 'Por favor selecionar um arquivo',
            trigger: 'blur',
          },
        ],
      },
      isEditModalVisible: false,
      editFor: undefined,
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const { data } = await TollPlazaApi.listAllPeriod()
      this.periodList = data
    },
    dateFormatter(row: AccountDto, column: TableColumn, cellValue: string) {
      const date = fromServerDate(cellValue)
      return date ? toLocaleDate(date) : ''
    },
    statusFormatter(row: AccountDto, column: TableColumn, cellValue: string) {
      if (cellValue === 'Pending') return 'Pendente'
      if (cellValue === 'Done') return 'Importado'
      return 'Falhou'
    },
    showUploadModal() {
      this.isButtonLoading = false
      this.isUploadModalVisible = true
    },
    onFileChange() {
      const inputFile = this.$refs.file as HTMLInputElement
      const files = inputFile.files
      if (files && files[0]) {
        this.uploadForm.file = files[0]
      }
    },
    async upload() {
      const form = this.$refs.form as any
      form.validate(async (valid: boolean) => {
        if (valid) {
          const { file, startOfPeriod, endOfPeriod } = this.uploadForm
          const formData = new FormData()
          formData.append('file', file!!)
          formData.append('startOfPeriod', toServeDate(startOfPeriod!!))
          if (endOfPeriod)
            formData.append('endOfPeriod', toServeDate(endOfPeriod))
          try {
            this.isButtonLoading = true
            await TollPlazaApi.upload(formData)
            ElMessage.success('Planilha enviado para importar com sucesso')
            this.loadData()
            this.resetUploadForm()
          } catch (err) {
            ElMessage.error('Erro ao tentar enviar planilha para importar')
          } finally {
            this.isButtonLoading = false
          }
        } else {
          return false
        }
      })
    },
    resetUploadForm() {
      this.isUploadModalVisible = false
      this.uploadForm = {
        file: undefined,
        startOfPeriod: undefined,
        endOfPeriod: undefined,
      }
      this.randomKey++
    },
    showEditModal(index: number, row: TollPlazaPeriodDto) {
      this.editFor = {
        id: row.id,
        startOfPeriod: fromServerDate(row.startOfPeriod),
        endOfPeriod: row.endOfPeriod
          ? fromServerDate(row.endOfPeriod)
          : undefined,
      }
      this.isButtonLoading = false
      this.isEditModalVisible = true
      nextTick(() => this.randomKey++)
    },
    update() {
      const form = this.$refs.editForm as any
      form.validate(async (valid: boolean) => {
        if (valid) {
          const { id, startOfPeriod, endOfPeriod } = this.editFor!!
          const data = {
            startOfPeriod: toServeDate(startOfPeriod!!),
            endOfPeriod: endOfPeriod ? toServeDate(endOfPeriod) : undefined,
          }
          try {
            this.isButtonLoading = true
            await TollPlazaApi.changePeriod(id, data)
            ElMessage.success('Periodo atualizado com sucesso')
            this.loadData()
            this.resetEditForm()
          } catch (err) {
            ElMessage.error('Erro ao tentar atualizar periodo')
          } finally {
            this.isButtonLoading = false
          }
        } else {
          return false
        }
      })
    },
    resetEditForm() {
      this.isEditModalVisible = false
      this.isButtonLoading = false
    },
  },
})
</script>

<template>
  <div>
    <el-row>
      <el-button @click="showUploadModal">Importar planilha</el-button>
    </el-row>
    <el-row>
      <el-table :data="periodList" style="width: 100%" strip>
        <el-table-column prop="id" label="#" />
        <el-table-column
          prop="startOfPeriod"
          label="Incio do periodo"
          :formatter="dateFormatter"
        />
        <el-table-column
          prop="endOfPeriod"
          label="Fim do periodo"
          :formatter="dateFormatter"
        />
        <el-table-column
          prop="status"
          label="Status"
          :formatter="statusFormatter"
        />
        <el-table-column align="right">
          <template #default="scope">
            <el-button
              size="mini"
              @click="showEditModal(scope.$index, scope.row)"
            >
              Editar
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
  <!-- Importar planilha -->
  <el-dialog
    title="Importar planilha - Valores da praça"
    v-model="isUploadModalVisible"
    width="500px"
  >
    <el-form :model="uploadForm" :rules="rules" ref="form" :key="randomKey">
      <el-form-item
        label="Incio do periodo"
        :label-width="formLabelWidth"
        prop="startOfPeriod"
      >
        <el-date-picker
          v-model="uploadForm.startOfPeriod"
          type="date"
          format="DD-MM-YYYY"
          placeholder="Escolher data"
        />
      </el-form-item>
      <el-form-item
        label="Fim do periodo"
        :label-width="formLabelWidth"
        prop="endOfPeriod"
      >
        <el-date-picker
          v-model="uploadForm.endOfPeriod"
          type="date"
          format="DD-MM-YYYY"
          placeholder="Escolher data"
        />
      </el-form-item>
      <el-form-item label="Planilha" :label-width="formLabelWidth" prop="file">
        <div class="el-input">
          <input
            ref="file"
            type="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            @change="onFileChange"
          />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetUploadForm"> Cancelar </el-button>
        <el-button type="primary" :loading="isButtonLoading" @click="upload">
          Importar
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- Editar periodo -->
  <el-dialog title="Editar periodo" v-model="isEditModalVisible" width="500px">
    <el-form :model="editFor" :rules="rules" ref="editForm" :key="randomKey">
      <el-form-item
        label="Incio do periodo"
        :label-width="formLabelWidth"
        prop="startOfPeriod"
      >
        <el-date-picker
          v-model="editFor.startOfPeriod"
          type="date"
          format="DD-MM-YYYY"
          placeholder="Escolher data"
        />
      </el-form-item>
      <el-form-item
        label="Fim do periodo"
        :label-width="formLabelWidth"
        prop="endOfPeriod"
      >
        <el-date-picker
          v-model="editFor.endOfPeriod"
          type="date"
          format="DD-MM-YYYY"
          placeholder="Escolher data"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetEditForm"> Cancelar </el-button>
        <el-button type="primary" :loading="isButtonLoading" @click="update">
          Salvar
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
