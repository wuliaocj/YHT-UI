import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import type { ApiResponse } from '@/types'

// 创建Axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token && config.headers) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse
    if (res.code !== 200) {
      ElMessage.error(res.msg || 'Request failed')
      
      // 401 Token过期
      if (res.code === 401) {
        ElMessageBox.confirm(
          'Login expired, please re-login',
          'Prompt',
          {
            confirmButtonText: 'Re-login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          const userStore = useUserStore()
          userStore.clearToken()
          router.push('/login')
        })
      }
      return Promise.reject(res)
    }
    return res.data
  },
  (error) => {
    console.error('Response Error:', error)
    ElMessage.error(error.message || 'Server Error')
    return Promise.reject(error)
  }
)

// 封装请求方法（带类型）
const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service(config)
}

export default request