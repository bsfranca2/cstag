<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { fromServerDate } from '@/utils/format'
import { ElMessage } from 'element-plus'
import TollTicketApi from '@/api/analyze'

export default defineComponent({
  setup() {
    const state = reactive({
      isDetailsDialogVisible: false,
      isDetailsLoading: false,
      details: {},
    })

    const open = async (id: number) => {
      try {
        state.isDetailsLoading = true
        state.isDetailsDialogVisible = true
        const { data } = await TollTicketApi.getTollTicketById(id)
        if (data) {
          state.details = {
            ...data,
            fare: `R$ ${data.fare.toFixed(2)}`,
            tollPlazaValue: `R$ ${data.tollPlazaValue?.toFixed(2)}`,
            tollPlazaStartOfPeriod: data.tollPlazaStartOfPeriod
              ? fromServerDate(data.tollPlazaStartOfPeriod).toLocaleDateString()
              : null,
            tollPlazaEndOfPeriod: data.tollPlazaEndOfPeriod
              ? fromServerDate(data.tollPlazaEndOfPeriod).toLocaleDateString()
              : null,
            vehicleStartOfPeriod: data.vehicleStartOfPeriod
              ? new Date(data.vehicleStartOfPeriod).toLocaleDateString()
              : null,
            vehicleEndOfPeriod: data.vehicleEndOfPeriod
              ? new Date(data.vehicleEndOfPeriod).toLocaleDateString()
              : null,
          }
        }
      } catch (err) {
        ElMessage.error('Erro ao tentar carregar detalhes')
      } finally {
        state.isDetailsLoading = false
      }
    }

    return { ...toRefs(state), open }
  },
})
</script>

<template>
  <el-dialog v-model="isDetailsDialogVisible" title="Detalhes">
    <div class="details" v-loading="isDetailsLoading">
      <el-divider content-position="left">Passagem</el-divider>
      <el-row>
        <el-col :span="4">Data:</el-col>
        <el-col :span="20">{{ details.paidAt }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">Avenida:</el-col>
        <el-col :span="20">{{ details.highway }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">Tarifa:</el-col>
        <el-col :span="20">{{ details.fare }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">Tag:</el-col>
        <el-col :span="20">{{ details.tag }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">Placa:</el-col>
        <el-col :span="20">{{ details.licensePlate }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">Categoria:</el-col>
        <el-col :span="20">{{ details.category }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">Operadora:</el-col>
        <el-col :span="20">{{ details.operatorCompany }}</el-col>
      </el-row>

      <template v-if="details.tollPlazaDescription">
        <el-divider content-position="left">Praça</el-divider>
        <el-row>
          <el-col :span="4">Local:</el-col>
          <el-col :span="20">{{ details.tollPlazaDescription }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">EntryId:</el-col>
          <el-col :span="20">{{ details.tollPlazaEntryId }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">Categoria:</el-col>
          <el-col :span="20">{{ details.tollPlazaCategory }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">Valor:</el-col>
          <el-col :span="20">{{ details.tollPlazaValue }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">Associação:</el-col>
          <el-col :span="20">{{ details.tollPlazaAssociateCompany }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">Periodo:</el-col>
          <el-col :span="20">
            {{
              `${details.tollPlazaStartOfPeriod} - ${details.tollPlazaEndOfPeriod}`
            }}
          </el-col>
        </el-row>
      </template>

      <template v-if="details.vehicleLicensePlate">
        <el-divider content-position="left">Veículo</el-divider>
        <el-row>
          <el-col :span="4">Placa:</el-col>
          <el-col :span="20">{{ details.vehicleLicensePlate }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">Marca:</el-col>
          <el-col :span="20">{{ details.vehicleBrand }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">Cat. Carregado:</el-col>
          <el-col :span="20">{{ details.vehicleTotal }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">Cat. Suspendido:</el-col>
          <el-col :span="20">{{ details.vehicleSuspended }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">Periodo:</el-col>
          <el-col :span="20">
            {{
              `${details.vehicleStartOfPeriod} - ${details.vehicleEndOfPeriod}`
            }}
          </el-col>
        </el-row>
      </template>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.details {
  font-size: 16px;
  line-height: 1.5;
}
</style>
