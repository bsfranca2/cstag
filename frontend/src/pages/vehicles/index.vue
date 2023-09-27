<script lang="ts">
import { defineComponent } from 'vue'
import CreateVehicleDialog from './components/CreateVehicleDialog.vue'
import VehiclesTable from './components/VehiclesTable.vue'
import { CreateVehicleDialogComponent, VehiclesTableComponent } from './types'

export default defineComponent({
  components: {
    CreateVehicleDialog,
    VehiclesTable,
  },
  methods: {
    refreshTable() {
      const table = this.$refs.vehiclesTable as VehiclesTableComponent
      table.loadData()
    },
    openCreateVehicleDialog() {
      const dialog = this.$refs.createVehicle as CreateVehicleDialogComponent
      dialog.open()
    },
  },
})
</script>

<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Veículos" lazy>
      <el-row>
        <el-button @click="openCreateVehicleDialog">
          Adicionar veiculo
        </el-button>
      </el-row>
      <vehicles-table ref="vehiclesTable" />
      <create-vehicle-dialog ref="createVehicle" @success="refreshTable" />
    </el-tab-pane>
    <el-tab-pane label="Carretas" lazy></el-tab-pane>
  </el-tabs>
</template>
