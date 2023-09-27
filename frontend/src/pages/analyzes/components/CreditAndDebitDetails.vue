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
        // const { data } = await TollTicketApi.getTollTicketById(id)
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
      <el-row>Viagem: XXXXXX</el-row>
      <el-row>Placa: XXX0000</el-row>
      <el-row>Débitos</el-row>
      <el-table>
        <el-table-column label="Data" />
        <el-table-column label="Valor" />
        <el-table-column label="Categoria" />
        <!-- <el-table-column label="" /> -->
      </el-table>
      <el-row>Créditos</el-row>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.details {
  font-size: 16px;
  line-height: 1.5;
}
</style>
