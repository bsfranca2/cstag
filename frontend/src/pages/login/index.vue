<template>
  <div id="login-page" @keyup.enter="login">
    <div class="login-form">
      <div class="input-group">
        <div class="title">Painel</div>
        <el-input
          :autofocus="true"
          placeholder="CNPJ"
          prefix-icon="el-icon-truck"
          v-model="cnpj"
        >
        </el-input>
      </div>
      <div class="input-group">
        <el-input
          placeholder="Senha"
          type="password"
          prefix-icon="el-icon-lock"
          v-model="password"
        >
        </el-input>
      </div>
      <div class="input-group">
        <label>Manter-se logado?</label>
        <el-switch v-model="rememberMe" on-text="" off-text=""> </el-switch>
      </div>
      <div class="input-group">
        <el-button @click="login" type="primary" :loading="isBtnLoading">
          {{ btnText }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useAuth } from '@/modules/auth'
import { ElMessage } from 'element-plus'

export default defineComponent({
  setup() {
    const auth = useAuth()

    const cnpj = ref('')
    const password = ref('')
    const rememberMe = ref(false)
    const isBtnLoading = ref(false)

    const btnText = computed(() => {
      if (isBtnLoading.value == true) return 'Autenticando...'
      return 'Autenticar'
    })

    async function login() {
      if (!cnpj.value) {
        ElMessage.error('CNPJ não preenchido')
        return
      }
      if (!password.value) {
        ElMessage.error('Senha não preenchido')
        return
      }
      const loginParams = {
        cnpj: cnpj.value,
        password: password.value,
      }
      const result = await auth.login(loginParams)
      if (result === true) {
        isBtnLoading.value = false
        ElMessage.success('Autenticado com sucesso')
        window.location.reload()
      } else {
        ElMessage.error('Falha na autenticação')
      }
    }

    return {
      cnpj,
      password,
      rememberMe,
      isBtnLoading,
      btnText,
      login,
    }
  },
})
</script>

<style lang="scss" scoped>
#login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #efeeee;
  .login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 500px;
    height: 460px;
    border-radius: 10px;
    background: white;
    border: 1px #eaeaea solid;
    box-shadow: 0px 0px 25px #cac6c6;
    .title {
      color: #20a0ff;
      font-weight: bold;
      font-size: 40px;
      text-align: center;
      line-height: 2.2;
      font-family: sans-serif;
    }
    .input-group {
      margin-top: 30px;
      width: 80%;
      button {
        width: 100%;
      }
    }
  }
}
</style>
