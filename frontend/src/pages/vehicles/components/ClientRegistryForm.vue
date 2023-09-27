<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'

export default defineComponent({
  name: 'ClientRegistryForm',
  setup(_, { emit }) {
    const state = reactive({
      isModalVisible: false,
      index: -1,
      form: {},
      formLabelWidth: '130px',
      rules: {
        startOfPeriod: [
          {
            required: true,
            message: 'Por favor insira uma data',
            trigger: 'blur',
          },
        ],
      },
    })
    const defaultForm = Object.freeze({
      id: -1,
      segment: '',
      client: '',
      group: '',
      subgroup: '',
      startOfPeriod: undefined,
      endOfPeriod: '',
    })

    const open = (item?: VehicleClientRegistryDto, index?: number) => {
      console.log('Abrir ===', index)
      const startOfPeriod = item?.startOfPeriod
        ? new Date(item?.startOfPeriod)
        : undefined
      const endOfPeriod = item?.endOfPeriod
        ? new Date(item?.endOfPeriod)
        : undefined
      state.form = { ...state.form, ...item, startOfPeriod, endOfPeriod }
      state.index = index === undefined ? -1 : index
      state.isModalVisible = true
    }

    const reset = () => {
      state.form = { ...defaultForm }
    }

    const close = () => {
      reset()
      state.isModalVisible = false
    }

    const elForm = ref<any | null>(null)
    const getData = () => {
      if (!elForm.value) return
      elForm.value?.validate((valid: boolean) => {
        if (!valid) return
        const stateForm = state.form as any
        const { startOfPeriod, endOfPeriod } = stateForm
        emit('data', {
          index: state.index,
          dto: {
            ...state.form,
            startOfPeriod: startOfPeriod
              ? startOfPeriod.toISOString()
              : undefined,
            endOfPeriod: endOfPeriod ? endOfPeriod.toISOString() : undefined,
          },
        })
        close()
      })
    }

    onMounted(() => {
      reset()
    })

    return { ...toRefs(state), open, reset, close, getData, elForm }
  },
})
</script>

<template>
  <el-dialog v-model="isModalVisible" title="Registro de cliente" width="500px">
    <el-form ref="elForm" :model="form" :rules="rules">
      <el-form-item label="Segmento" :label-width="formLabelWidth">
        <el-input v-model="form.segment" />
      </el-form-item>
      <el-form-item label="Cliente" :label-width="formLabelWidth">
        <el-input v-model="form.client" />
      </el-form-item>
      <el-form-item label="Grupo" :label-width="formLabelWidth">
        <el-input v-model="form.group" />
      </el-form-item>
      <el-form-item label="Subgrupo" :label-width="formLabelWidth">
        <el-input v-model="form.subgroup" />
      </el-form-item>
      <el-form-item
        prop="startOfPeriod"
        label="Inicio de periodo"
        :label-width="formLabelWidth"
      >
        <el-date-picker
          v-model="form.startOfPeriod"
          type="date"
          format="DD-MM-YYYY"
          placeholder="Escolher data"
        />
      </el-form-item>
      <el-form-item label="Fim de periodo" :label-width="formLabelWidth">
        <el-date-picker
          v-model="form.endOfPeriod"
          type="date"
          format="DD-MM-YYYY"
          placeholder="Escolher data"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">Cancelar</el-button>
        <el-button type="primary" @click="getData">
          Salvar
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
