<script lang="ts">
import { defineComponent } from 'vue'
import Breadcrumb from '@/components/Breadcrump/index.vue'
import { useAuth } from '@/modules/auth'
export default defineComponent({
  components: {
    Breadcrumb,
  },
  setup() {
    const { account, logout } = useAuth()
    return { account, logout }
  }
})
</script>

<template>
  <div class="navbar">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <div class="right-menu-item">
        {{ account.companyName }}
      </div>
      <div class="right-menu-item">
        <el-button @click="logout">Sair</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
    }
  }
}
</style>
