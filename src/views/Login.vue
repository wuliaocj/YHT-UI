<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">益禾堂管理系统</h2>
      <el-form 
        :model="loginForm" 
        :rules="loginRules" 
        ref="loginFormRef" 
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-btn">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { adminApi } from '@/api'
import type { FormInstance, FormRules } from 'element-plus'

// 表单引用（带类型）
const loginFormRef: Ref<FormInstance | null> = ref(null)
const router = useRouter()
const userStore = useUserStore()

// 登录表单
const loginForm = ref({
  username: '',
  password: ''
})

// 校验规则（带类型）
const loginRules: Ref<FormRules> = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

// 登录处理（异步函数带类型）
const handleLogin = async (): Promise<void> => {
  try {
    if (!loginFormRef.value) return
    await loginFormRef.value.validate()
    const res = await adminApi.login(loginForm.value.username, loginForm.value.password)
    userStore.setToken(res.token)
    userStore.setUserInfo(res.admin)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (err: any) {
    console.error('登录失败:', err)
    ElMessage.error(err.message || '用户名或密码错误')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}
.login-card {
  width: 400px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}
.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #1989fa;
  font-size: 24px;
  font-weight: bold;
}
.login-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}
</style>