<script lang="ts">
import { defineComponent } from 'vue'
import VehicleApi from '@/api/vehicle'
import VehicleDetailsDialog from './VehicleDetailsDialog.vue'

interface VehiclesTable {
  vehicles: VehicleDto[]
  isLoading: boolean
  search: string
}

export default defineComponent({
  components: {
    VehicleDetailsDialog,
  },
  data(): VehiclesTable {
    return {
      vehicles: [],
      isLoading: false,
      search: '',
    }
  },
  methods: {
    async loadData() {
      this.isLoading = true
      const { data } = await VehicleApi.getAll()
      this.vehicles = data
      this.isLoading = false
    },
    showDetails(vehicle: VehicleDto) {
      const details = this.$refs.details as any
      details.open({ ...vehicle })
    },
  },
  computed: {
    filteredData(): VehicleDto[] {
      const vehicles = this.vehicles
      const query = this.search.toLowerCase()
      if (query === '') return vehicles
      return vehicles.filter((i) =>
        `${i.licensePlate} ${i.brand}`.toLowerCase().includes(query)
      )
    },
  },
  created() {
    this.loadData()
  },
})
</script>

<template>
  <el-table ref="table" :data="filteredData" style="width: 100%" stripe>
    <el-table-column prop="licensePlate" label="Placa" />
    <el-table-column prop="brand" label="Marca" />
    <el-table-column prop="model" label="Modelo" />
    <el-table-column prop="year" label="Ano" />
    <el-table-column prop="description" label="Descrição" />
    <el-table-column fixed="right" width="200px">
      <template #header>
        <el-input v-model="search" size="mini" placeholder="Pesquisar" />
      </template>
      <template #default="scope">
        <el-button @click="showDetails(scope.row)" type="text">
          Detalhes
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <vehicle-details-dialog ref="details" @saved="loadData" />
</template>
