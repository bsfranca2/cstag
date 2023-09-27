<script lang="ts">
import { defineComponent } from 'vue'

interface AxlesRegistryForm {
  index?: number
  isDialogVisible: boolean
  formLabelWidth: string
  form: Form
  randomKey: number
  rules: unknown
}

interface Form {
  id: number
  total: number
  suspended: number
  startOfPeriod?: Date
  endOfPeriod?: Date
}

export default defineComponent({
  data(): AxlesRegistryForm {
    return {
      isDialogVisible: false,
      formLabelWidth: '150px',
      index: undefined,
      form: {
        id: -1,
        total: 0,
        suspended: 0,
        startOfPeriod: undefined,
        endOfPeriod: undefined,
      },
      randomKey: 150,
      rules: {
        suspended: [
          {
            required: true,
            message: 'Por favor inserir eixos suspendidos',
          },
        ],
        total: [
          {
            required: true,
            message: 'Por favor inserir eixos suspendidos',
          },
        ],
        startOfPeriod: [
          {
            required: true,
            message: 'Por favor insira uma data',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    getData() {
      const form = this.$refs.form as ElForm
      form.validate((valid: boolean) => {
        if (!valid) return
        const form = { ...this.form }
        this.$emit('data', {
          index: this.index,
          dto: {
            ...form,
            startOfPeriod: form.startOfPeriod!!.toISOString(),
            endOfPeriodd: form.endOfPeriod
              ? form.endOfPeriod.toISOString()
              : undefined,
          },
        })
        this.cancel()
      })
    },
    cancel() {
      this.reset()
      this.isDialogVisible = false
    },
    reset() {
      this.index = undefined
      this.form = {
        id: -1,
        total: 0,
        suspended: 0,
        startOfPeriod: undefined,
        endOfPeriod: undefined,
      }
    },
    open(dto?: AxlesRegistryDto, index?: number) {
      this.reset()
      this.index = index
      if (dto) {
        const { id, total, suspended, startOfPeriod, endOfPeriod } = dto
        this.form = {
          id,
          total,
          suspended,
          startOfPeriod: new Date(startOfPeriod),
          endOfPeriod: endOfPeriod ? new Date(endOfPeriod) : undefined,
        }
      }
      this.isDialogVisible = true
      console.log('index', this.index, 'dto', this.form)
      this.$nextTick(() => {
        ++this.randomKey
      })
    },
  },
  computed: {
    saveText() {
      if (this.index === undefined) return 'Adicionar registro'
      return 'Atualizar'
    },
  },
})
</script>

<template>
  <el-dialog title="Registro de eixo" v-model="isDialogVisible" width="500px">
    <el-form ref="form" :model="form" :rules="rules" :key="randomKey">
      <el-form-item
        label="Eixos carregados"
        :label-width="formLabelWidth"
        prop="total"
      >
        <el-input v-model="form.total" />
      </el-form-item>
      <el-form-item
        label="Eixos Suspendidos"
        :label-width="formLabelWidth"
        prop="suspended"
      >
        <el-input v-model="form.suspended" />
      </el-form-item>
      <el-form-item
        label="Incio do periodo"
        :label-width="formLabelWidth"
        prop="startOfPeriod"
      >
        <el-date-picker
          v-model="form.startOfPeriod"
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
          v-model="form.endOfPeriod"
          type="date"
          format="DD-MM-YYYY"
          placeholder="Escolher data"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">Cancelar</el-button>
        <el-button type="primary" @click="getData">
          {{ saveText }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
