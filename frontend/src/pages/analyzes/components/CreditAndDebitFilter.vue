<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { toServeDate } from '@/utils/format'
import VehicleApi from '@/api/vehicle'

interface TollValleyFilter {
  form: FilterForm
  shortcuts: any
}

interface FilterForm {
  q: string
  licensePlate?: string
  type?: string
  period?: Date[]
  trip?: string
}

export default defineComponent({
  setup() {
    const licensePlateList = ref<Record<string, string>[]>([])

    const loadData = async () => {
      const { data } = await VehicleApi.licensePlateEntries()
      licensePlateList.value = data.map((value) => ({ value }))
    }

    onMounted(() => {
      loadData()
    })

    const querySearch = (queryString: string, cb: Function) => {
      console.log(licensePlateList.value)
      cb(licensePlateList.value)
    }

    return { querySearch }
  },
  data(): TollValleyFilter {
    return {
      form: {
        q: '',
        licensePlate: undefined,
        type: undefined,
        period: undefined,
        trip: undefined,
      },
      shortcuts: [
        {
          text: 'Ultimos 30 dias',
          value: (() => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
          })(),
        },
        {
          text: 'Ultimos 60 dias',
          value: (() => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
            return [start, end]
          })(),
        },
        {
          text: 'Ultimos 90 dias',
          value: (() => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
          })(),
        },
        {
          text: 'Ultimos 120 dias',
          value: (() => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 120)
            return [start, end]
          })(),
        },
        {
          text: 'Ultimos 365 dias',
          value: (() => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            return [start, end]
          })(),
        },
      ],
    }
  },
  methods: {
    onSubmit() {
      const { period } = this.form
      const data: CreditAndDebitAnalysisFilterDto = { ...this.form }
      if (period != undefined) {
        data.startOfPeriod = toServeDate(period[0])
        data.endOfPeriod = toServeDate(period[1])
      }
      this.$emit('filter', data)
    },
    onReset() {
      this.form = {
        q: '',
        licensePlate: undefined,
        type: undefined,
        period: undefined,
        trip: undefined,
      }
      this.onSubmit()
    },
  },
})
</script>

<template>
  <el-form :inline="true" :model="form" ref="form">
    <el-form-item label="Viagem">
      <el-input v-model="form.trip" type="number" />
    </el-form-item>
    <el-form-item label="Divergência">
      <el-select v-model="form.type">
        <el-option label="Nenhuma" value="Without"></el-option>
        <el-option label="Crédito" value="Credit"></el-option>
        <el-option label="Débito" value="Debit"></el-option>
        <el-option label="Cré/Deb" value="Credit/Debit"></el-option>
        <el-option label="Tudo" :value="undefined"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Placa">
      <el-autocomplete
        v-model="form.licensePlate"
        v-mask="['XXX#X##', 'XXX####']"
        :fetch-suggestions="querySearch"
      />
    </el-form-item>
    <el-form-item label="Período">
      <el-date-picker
        v-model="form.period"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="Até"
        start-placeholder="Inicio periodo"
        end-placeholder="Fim periodo"
        :shortcuts="shortcuts"
        format="DD/MM/YYYY"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="Pesquisar">
      <el-input v-model="form.q" type="text" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit" />
      <el-button icon="el-icon-close" @click="onReset" />
    </el-form-item>
  </el-form>
</template>
