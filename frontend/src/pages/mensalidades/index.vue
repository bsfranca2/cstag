<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  watchEffect,
} from 'vue'
import MonthlyApi from '@/api/monthly'
import { moneyFormatter } from '@/utils/columnFormatter'

export default defineComponent({
  setup() {
    const state = reactive({
      year: 0,
      category: undefined,
    })
    const payments = ref<MonthlyPaymentDto[]>([])
    const paymentsFiltered = computed(() =>
      payments.value.filter((i) =>
        state.category ? i.category == state.category : true
      )
    )

    onMounted(() => {
      state.year = new Date().getFullYear()
    })

    watchEffect(() => {
      MonthlyApi.getByYear(state.year).then(({ data }) => {
        payments.value = data
      })
    })

    return { payments, ...toRefs(state), moneyFormatter, paymentsFiltered }
  },
  computed: {
    maxHeight(): number {
      const defaultHeight = 545
      const clientHeight = document.documentElement.clientHeight * 0.8
      return defaultHeight > clientHeight ? defaultHeight : clientHeight
    },
  },
})
</script>

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-input v-model="year" type="number" />
      </el-col>
      <el-col :span="4">
        <el-input
          v-model="category"
          type="number"
          placeholder="Categoria"
          clearable
        />
      </el-col>
    </el-row>
    <el-table
      :data="paymentsFiltered"
      style="width: 100%"
      :max-height="maxHeight"
      stripe
    >
      <el-table-column prop="licensePlate" label="Placa" />
      <el-table-column prop="category" label="Cat." width="50" />
      <el-table-column
        prop="january"
        label="Janeiro"
        :formatter="moneyFormatter"
      />
      <el-table-column
        prop="february"
        label="Fevereiro"
        :formatter="moneyFormatter"
      />
      <el-table-column prop="march" label="Março" :formatter="moneyFormatter" />
      <el-table-column prop="april" label="Abril" :formatter="moneyFormatter" />
      <el-table-column prop="may" label="Maio" :formatter="moneyFormatter" />
      <el-table-column prop="june" label="Junho" :formatter="moneyFormatter" />
      <el-table-column prop="july" label="Julho" :formatter="moneyFormatter" />
      <el-table-column
        prop="august"
        label="Agosto"
        :formatter="moneyFormatter"
      />
      <el-table-column
        prop="september"
        label="Setembro"
        :formatter="moneyFormatter"
      />
      <el-table-column
        prop="october"
        label="Outubro"
        :formatter="moneyFormatter"
      />
      <el-table-column
        prop="november"
        label="Novembro"
        :formatter="moneyFormatter"
      />
      <el-table-column
        prop="december"
        label="Dezembro"
        :formatter="moneyFormatter"
      />
    </el-table>
  </div>
</template>
