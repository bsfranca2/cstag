<script lang="ts">
import { defineComponent } from 'vue'
import TollTicketTable from './TollTicketTable.vue'
import CreditAndDebit from './CreditAndDebit.vue'
export default defineComponent({
  components: {
    TollTicketTable,
    CreditAndDebit,
  },
})
</script>

<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Eixos/Valor Praça" lazy>
      <toll-ticket-table type="TollValleyTicket" />
    </el-tab-pane>
    <el-tab-pane label="Crédito/Débito" lazy>
      <credit-and-debit />
    </el-tab-pane>
  </el-tabs>
</template>
