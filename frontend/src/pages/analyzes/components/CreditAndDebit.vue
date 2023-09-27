<script lang="ts">
import { defineComponent, reactive, ref, toRefs, watchEffect } from 'vue'
import AnalyzeApi from '@/api/analyze'
import {
  creditAndDebitTypeFormatter,
  moneyFormatter,
} from '@/utils/columnFormatter'
import CreditAndDebitFilter from './CreditAndDebitFilter.vue'
import CreditAndDebitDetails from './CreditAndDebitDetails.vue'

export default defineComponent({
  components: {
    CreditAndDebitFilter,
    CreditAndDebitDetails,
  },
  setup() {
    const analyzes = ref<CreditAndDebitAnalysisDto[]>([])
    const state = reactive({
      isLoading: false,
      total: 0,
      perPage: 20,
      page: 1,
      filter: { q: '' },
    })

    watchEffect(() => {
      state.isLoading = true
      AnalyzeApi.searchCreditAndDebit(state.filter, {
        perPage: state.perPage,
        page: state.page,
      })
        .then(({ data }) => {
          analyzes.value = data.list
          state.total = data.hits
        })
        .finally(() => (state.isLoading = false))
    })
    const onFilter = (newFilter: TollTicketAnalysisFilterDto) => {
      state.filter = { ...newFilter }
    }

    return {
      analyzes,
      onFilter,
      ...toRefs(state),
      creditAndDebitTypeFormatter,
      moneyFormatter,
    }
  },
  methods: {
    tableRowClassName({ row }: any) {
      if (row.divergenceType === 'Credit') return 'warning-row'
      else if (row.divergenceType === 'Debit') return 'danger-row'
      return ''
    },
    handleSizeChange(perPage: number) {
      this.perPage = perPage
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
  <credit-and-debit-filter @filter="onFilter" />
  <el-table
    :data="analyzes"
    style="width: 100%"
    :row-class-name="tableRowClassName"
    :max-height="maxHeight"
    v-loading="isLoading"
    strip
  >
    <el-table-column prop="trip" label="Viagem" />
    <el-table-column prop="licensePlate" label="Placa" />
    <el-table-column
      prop="divergenceType"
      label="Tipo"
      :formatter="creditAndDebitTypeFormatter"
    />
    <el-table-column prop="numberOfTransactions" label="Transações" />
    <el-table-column
      prop="totalOfDebit"
      label="Total de débito"
      :formatter="moneyFormatter"
    />
    <el-table-column
      prop="totalOfCredit"
      label="Total de crédito"
      :formatter="moneyFormatter"
    />
    <el-table-column
      prop="differenceOfValue"
      label="Diferença"
      :formatter="moneyFormatter"
    />
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
  <credit-and-debit-details ref="details" />
</template>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .danger-row {
  background: #f9b9b7;
}
</style>
