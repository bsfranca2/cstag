<script lang="ts">
import { defineComponent } from 'vue'
import VehicleApi from '@/api/vehicle'
import { ElMessage } from 'element-plus'

export default defineComponent({
  data() {
    return {
      isDialogVisible: false,
      formLabelWidth: '150px',
      form: {
        licensePlate: '',
        brand: '',
      },
    }
  },
  methods: {
    async submit() {
      try {
        await VehicleApi.save({
          ...this.form,
          axlesRegistries: [],
          clientRegistries: [],
        })
        ElMessage.success('Veículo criado com sucesso')
        this.close()
        this.$emit('success')
      } catch (err) {
        ElMessage.error('Erro ao tentar criar veiculo')
      }
    },
    reset() {
      this.form = {
        licensePlate: '',
        brand: '',
      }
    },
    close() {
      this.reset()
      this.isDialogVisible = false
    },
    open() {
      this.isDialogVisible = true
    },
  },
})
</script>

<template>
  <el-dialog title="Adionar veículo" v-model="isDialogVisible" width="500px">
    <el-form :model="form">
      <el-form-item label="Placa" :label-width="formLabelWidth">
        <el-input
          v-model="form.licensePlate"
          v-mask="['XXX#X##', 'XXX####']"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="Marca" :label-width="formLabelWidth">
        <el-input v-model="form.brand" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">Cancelar</el-button>
        <el-button type="primary" @click="submit">
          Criar
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
