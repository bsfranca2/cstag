<script lang="ts">
import { computed, defineComponent } from 'vue'
import { compile } from 'path-to-regexp'
import { RouteRecord } from 'vue-router'
import { useAuth } from '@/modules/auth'

interface Breadcrumb {
  breadcrumbs: RouteRecord[]
}

export default defineComponent({
  setup() {
    const { account } = useAuth()

    const isAdmin = computed(() => {
      if (account?.value?.role === 'Admin') return true
      return false
    })

    return { isAdmin }
  },
  data: (): Breadcrumb => ({
    breadcrumbs: [],
  }),
  created() {
    this.getBreadcrumb()
  },
  watch: {
    $route() {
      if (this.$route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    },
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      )
      const first = matched[0]
      if (!this.isDashboard(first) && !this.isAdmin) {
        matched = [
          ({
            path: '/dashboard',
            meta: { title: 'Dashboard' },
          } as unknown) as RouteRecord,
        ].concat(matched)
      }
      this.breadcrumbs = matched.filter((item) => {
        return item.meta && item.meta.title && item.meta.breadcrumb !== false
      })
    },
    isDashboard(route: RouteRecord) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return (
        name
          .toString()
          .trim()
          .toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
      )
    },
    pathCompile(path: string) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      const toPath = compile(path)
      return toPath(params)
    },
    handleLink(item: any) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect).catch((err) => {
          console.warn(err)
        })
        return
      }
      this.$router.push(this.pathCompile(path)).catch((err) => {
        console.warn(err)
      })
    },
  },
})
</script>

<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span
          v-if="
            item.redirect === 'noredirect' || index === breadcrumbs.length - 1
          "
          class="no-redirect"
        >
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">
          {{ item.meta.title }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
