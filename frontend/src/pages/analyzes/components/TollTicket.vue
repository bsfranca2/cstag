<script lang="ts">
import { defineComponent } from 'vue'
import TollTicketTable from './TollTicketTable.vue'
export default defineComponent({
  components: {
    TollTicketTable,
  },
})
</script>

<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Eixos/Valor Praça">
      <toll-ticket-table type="TollTicket" />
    </el-tab-pane>
    <!-- <el-tab-pane label="Duplicidade">
    </el-tab-pane> -->
  </el-tabs>
</template>
