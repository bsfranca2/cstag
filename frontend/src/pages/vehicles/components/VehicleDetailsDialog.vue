<script lang="ts">
import { defineComponent } from 'vue'
import { toLocaleDate } from '@/utils/format'
import { TableColumn } from 'element-plus/lib/el-table/src/table.type'
import AxlesRegistryForm from './AxlesRegistryForm.vue'
import ClientRegistryForm from './ClientRegistryForm.vue'
import VehicleApi from '@/api/vehicle'

interface VehicleDetailsDialog {
  isDialogVisible: boolean
  vehicle?: VehicleDto
  isLoading: boolean
}

export default defineComponent({
  components: {
    AxlesRegistryForm,
    ClientRegistryForm,
  },
  data(): VehicleDetailsDialog {
    return {
      isDialogVisible: false,
      vehicle: undefined,
      isLoading: false,
    }
  },
  methods: {
    open(vehicle: VehicleDto) {
      this.vehicle = { ...vehicle }
      this.isDialogVisible = true
    },
    dateFormatter(row: AccountDto, column: TableColumn, cellValue: string) {
      if (!cellValue) return
      return toLocaleDate(new Date(cellValue))
    },
    createAxlesRegistry() {
      const el = this.$refs.axlesForm as any
      el.open()
    },
    editAxlesRegistry(axlesRegistry: AxlesRegistryDto, index: number) {
      const el = this.$refs.axlesForm as any
      el.open(axlesRegistry, index)
    },
    removeAxlesRegistry(index: number) {
      const vehicle = this.vehicle
      if (!vehicle) return
      vehicle.axlesRegistries = vehicle.axlesRegistries.filter(
        (_, itemIdx) => itemIdx !== index
      )
    },
    createClientRegistry() {
      const el = this.$refs.clientForm as any
      el.open()
    },
    editClientRegistry(
      clientRegistry: VehicleClientRegistryDto,
      index: number
    ) {
      const el = this.$refs.clientForm as any
      el.open(clientRegistry, index)
    },
    removeClientRegistry(index: number) {
      const vehicle = this.vehicle
      if (!vehicle) return
      vehicle.clientRegistries = vehicle.clientRegistries.filter(
        (_, itemIdx) => itemIdx !== index
      )
    },
    reset() {
      this.vehicle = undefined
    },
    close() {
      this.reset()
      this.isDialogVisible = false
    },
    onData(data: { dto: AxlesRegistryDto; index?: number }) {
      const vehicle = this.vehicle
      const { dto, index } = data
      if (!vehicle) return
      if (index === undefined) {
        vehicle.axlesRegistries.push(dto)
      } else {
        const axlesRegistries = [
          ...vehicle.axlesRegistries.filter((_, itemIdx) => itemIdx !== index),
        ]
        const registry = {
          ...vehicle.axlesRegistries.find((_, itemIdx) => itemIdx === index),
          ...dto,
        }
        vehicle.axlesRegistries = [...axlesRegistries, registry]
      }
    },
    onClientData(data: { dto: VehicleClientRegistryDto; index?: number }) {
      const vehicle = this.vehicle
      const { dto, index } = data
      if (!vehicle) return
      if (index === -1) {
        vehicle.clientRegistries.push(dto)
      } else {
        const clientRegistries = [
          ...vehicle.clientRegistries.filter((_, itemIdx) => itemIdx !== index),
        ]
        const registry = {
          ...vehicle.clientRegistries.find((_, itemIdx) => itemIdx === index),
          ...dto,
        }
        vehicle.clientRegistries = [...clientRegistries, registry]
      }
    },
    async save() {
      if (!this.vehicle) return
      try {
        this.isLoading = true
        await VehicleApi.save(this.vehicle)
        this.$emit('saved')
        this.close()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
  },
  computed: {
    dialogTitle(): string {
      const licensePlate = this.vehicle?.licensePlate
      const baseTitle = 'Detalhes veículo '
      return licensePlate ? baseTitle + ' - ' + licensePlate : baseTitle
    },
    registries(): AxlesRegistryDto[] {
      return this.vehicle?.axlesRegistries ?? []
    },
    clientRegistries(): VehicleClientRegistryDto[] {
      return this.vehicle?.clientRegistries ?? []
    },
  },
})
</script>

<template>
  <el-dialog v-model="isDialogVisible" :title="dialogTitle" width="850px">
    <template v-if="vehicle">
      <el-row>
        <el-col :span="16">
          <el-form :model="vehicle">
            <el-form-item label="Marca" label-width="150px">
              <el-input v-model="vehicle.brand" />
            </el-form-item>
            <el-form-item label="Modelo" label-width="150px">
              <el-input v-model="vehicle.model" />
            </el-form-item>
            <el-form-item label="Ano" label-width="150px">
              <el-input v-model="vehicle.year" type="number" />
            </el-form-item>
            <el-form-item label="Descrição" label-width="150px">
              <el-input v-model="vehicle.description" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </template>
    <el-tabs>
      <el-tab-pane label="Eixos">
        <el-table :data="registries">
          <el-table-column prop="total" label="Eixos Carregados" />
          <el-table-column prop="suspended" label="Eixos Suspendidos" />
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
          <el-table-column align="right" width="120">
            <template #header>
              <el-button
                type="primary"
                size="mini"
                plain
                @click="createAxlesRegistry"
              >
                Adicionar
              </el-button>
            </template>
            <template #default="scope">
              <el-button
                size="mini"
                icon="el-icon-edit"
                circle
                @click="editAxlesRegistry(scope.row, scope.$index)"
              />
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                circle
                @click="removeAxlesRegistry(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Cliente">
        <el-table :data="clientRegistries">
          <el-table-column prop="segment" label="Segmento" />
          <el-table-column prop="client" label="Cliente" />
          <el-table-column prop="group" label="Grupo" />
          <el-table-column prop="subgroup" label="Subgrupo" />
          <el-table-column prop="startOfPeriod" label="De" />
          <el-table-column prop="endOfPeriod" label="Até" />
          <el-table-column align="right" width="120">
            <template #header>
              <el-button
                type="primary"
                size="mini"
                plain
                @click="createClientRegistry"
              >
                Adicionar
              </el-button>
            </template>
            <template #default="scope">
              <el-button
                size="mini"
                icon="el-icon-edit"
                circle
                @click="editClientRegistry(scope.row, scope.$index)"
              />
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                circle
                @click="removeClientRegistry(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">Cancelar</el-button>
        <el-button type="primary" :loading="isLoading" @click="save">
          Salvar
        </el-button>
      </span>
    </template>
  </el-dialog>
  <axles-registry-form ref="axlesForm" @data="onData" />
  <client-registry-form ref="clientForm" @data="onClientData" />
</template>
