<script lang="ts">
import { defineComponent, reactive, ref, toRefs, watchEffect } from 'vue'
import TollTicketFilter from './TollTicketFilter.vue'
import TollTicketDetails from './TollTicketDetails.vue'
import TollTicketApi from '@/api/analyze'
import {
  moneyFormatter,
  tollTicketTypeFormatter,
} from '@/utils/columnFormatter'
import { toLocaleTime } from '@/utils/format'

export default defineComponent({
  components: {
    TollTicketFilter,
    TollTicketDetails,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const analyzes = ref<TollTicketAnalysisSearchDto[]>([])
    const state = reactive({
      isLoading: false,
      total: 0,
      perPage: 20,
      page: 1,
      filter: { q: '', tollTicketType: props.type },
    })

    watchEffect(() => {
      state.isLoading = true
      TollTicketApi.searchTollTicket(state.filter, {
        perPage: state.perPage,
        page: state.page,
      })
        .then(({ data }) => {
          analyzes.value = data.list
          state.total = data.hits
        })
        .finally(() => {
          state.isLoading = false
        })
    })

    const onFilter = (newFilter: TollTicketAnalysisFilterDto) => {
      state.filter = { ...newFilter, tollTicketType: props.type }
    }

    return {
      analyzes,
      onFilter,
      moneyFormatter,
      tollTicketTypeFormatter,
      ...toRefs(state),
    }
  },
  methods: {
    tableRowClassName({ row }: any) {
      if (row.type === 'Positive') return 'warning-row'
      else if (row.type === 'Negative') return 'danger-row'
      return ''
    },
    handleSizeChange(perPage: number) {
      this.perPage = perPage
    },
    dateFormatter(row: unknown, column: unknown, cellValue: string) {
      if (!cellValue) return
      return new Date(parseInt(cellValue) * 1000).toLocaleDateString()
    },
    timeFormatter(row: unknown, column: unknown, cellValue: string) {
      if (!cellValue) return
      return toLocaleTime(new Date(parseInt(cellValue) * 1000))
    },
    openDetails(id: number) {
      const details = this.$refs.details as any
      details.open(id)
    },
  },
  computed: {
    maxHeight(): number {
      const defaultHeight = 545
      const clientHeight = document.documentElement.clientHeight * 0.75
      return defaultHeight > clientHeight ? defaultHeight : clientHeight
    },
  },
})
</script>

<template>
  <toll-ticket-filter @filter="onFilter" />
  <el-table
    :data="analyzes"
    ref="table"
    style="width: 100%"
    :row-class-name="tableRowClassName"
    :max-height="maxHeight"
    v-loading="isLoading"
    strip
  >
    <el-table-column prop="licensePlate" label="Placa" width="100" />
    <el-table-column
      prop="paidAt"
      label="Data"
      width="100"
      :formatter="dateFormatter"
    />
    <el-table-column
      prop="paidAt"
      label="Hora"
      width="60"
      :formatter="timeFormatter"
    />
    <el-table-column
      prop="type"
      label="Tipo"
      width="100"
      :formatter="tollTicketTypeFormatter"
    />
    <el-table-column prop="highway" label="Praça de Pedágio" min-width="400" />
    <el-table-column
      prop="fare"
      label="Valor Cobrado"
      width="120"
      :formatter="moneyFormatter"
    />
    <el-table-column
      prop="tollPlazaValue"
      label="Valor Tabela"
      width="120"
      :formatter="moneyFormatter"
    />
    <el-table-column
      prop="tollPlazaHighway"
      label="Praça Tabela"
      min-width="400"
    />
    <el-table-column prop="category" label="Cobrado" width="75" />
    <el-table-column prop="axlesSuspended" label="Suspenso" width="82" />
    <el-table-column prop="axlesTotal" label="Carregado" width="86" />
    <el-table-column width="100">
      <template #default="scope">
        <el-button size="mini" @click="openDetails(scope.row.analysisId)"
          >Detalhes</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    background
    layout="sizes, prev, pager, next"
    :page-size="perPage"
    v-model:total="total"
    v-model:current-page="page"
    :page-sizes="[20, 50, 100]"
    @size-change="handleSizeChange"
  />
  <toll-ticket-details ref="details" />
</template>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .danger-row {
  background: #f9b9b7;
}
</style>
