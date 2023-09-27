<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useAuth } from '@/modules/auth'

export default defineComponent({
  setup() {
    const { account, isAuthenticated } = useAuth()

    const role = computed(() => {
      if (isAuthenticated()) return account?.value?.role
      return undefined
    })
    return { role }
  },
  data: () => ({
    adminItems: [
      {
        label: 'Acessos',
        icon: 'el-icon-user-solid',
        path: '/accounts',
      },
      {
        label: 'Praças',
        icon: 'el-icon-place',
        path: '/toll-plazas',
      },
    ],
    clientItems: [
      // {
      //   label: 'Dashboard',
      //   icon: 'el-icon-pie-chart',
      //   path: '/dashboard',
      // },
      {
        label: 'Passagens Pedágio',
        icon: 'el-icon-data-analysis',
        path: '/toll-ticket-analyzes',
      },
      {
        label: 'Vale-Pedágio',
        icon: 'el-icon-data-analysis',
        path: '/toll-valley-analyzes',
      },
      {
        label: 'Faturas',
        icon: 'el-icon-tickets',
        path: '/invoices',
      },
      {
        label: 'Veículos',
        icon: 'el-icon-truck',
        path: '/vehicles',
      },
      {
        label: 'Mensalidades',
        icon: '',
        path: '/mensalidades',
      },
      // {
      //   label: 'Consultas Gerencias',
      //   icon: '',
      //   path: '/consultas',
      // },
    ],
  }),
  computed: {
    activeMenu(): string {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    items(): Record<string, string>[] {
      return this.role === 'Admin' ? this.adminItems : this.clientItems
    },
  },
})
</script>

<template>
  <div>
    <div :class="$style.logo">
      <img src="/img/logo.webp" alt="Logo CSTAG" />
    </div>
    <el-menu
      :default-active="activeMenu"
      :background-color="'#304156'"
      :text-color="'#bfcbd9'"
      :active-text-color="'#409EFF'"
      :unique-opened="false"
      mode="vertical"
    >
      <router-link v-for="item in items" :key="item.path" :to="item.path">
        <el-menu-item :index="item.path">
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </router-link>
    </el-menu>
  </div>
</template>

<style lang="scss" module>
.logo {
  display: flex;
  justify-content: center;
  margin: 8px 0;

  img {
    height: 80px;
  }
}
</style>
