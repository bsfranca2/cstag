<script lang="ts">
import { defineComponent } from 'vue'
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar/index.vue'

export default defineComponent({
  name: 'DefaultLayout',
  components: {
    Sidebar,
    Navbar,
  },
})
</script>

<template>
  <el-container>
    <el-aside width="250px" style="background-color: #304156">
      <sidebar />
    </el-aside>
    <el-container>
      <el-header>
        <navbar />
      </el-header>
      <el-main>
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss">
.el-aside {
  height: 100vh;
  position: sticky;
  top: 0;
}

.el-header {
  padding: 0 !important;

  .navbar {
    padding: 0 20px;
  }
}
</style>
