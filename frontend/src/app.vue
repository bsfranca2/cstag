<script lang="ts">
import { defineComponent } from 'vue'
import BlankLayout from '@/layouts/blank/index.vue'
import DefaultLayout from '@/layouts/default/index.vue'

export default defineComponent({
  name: '',
  components: {
    BlankLayout,
    DefaultLayout,
  },
  data: () => ({
    layout: '',
  }),
  watch: {
    $route() {
      const defaultLayout = 'DefaultLayout'
      const { layout } = this.$route.meta
      this.layout = layout ? layout : defaultLayout
    },
  },
  mounted() {
    console.log('Versão: 0.2')
  },
})
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
