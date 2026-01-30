import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // 状态（带类型）
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfoStr = localStorage.getItem('userInfo')
  const userInfo = ref<UserInfo>(JSON.parse(userInfoStr && userInfoStr !== 'undefined' ? userInfoStr : '{}'))

  // 动作：设置Token
  const setToken = (newToken: string): void => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 动作：设置用户信息
  const setUserInfo = (info: UserInfo): void => {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  // 动作：清除Token
  const clearToken = (): void => {
    token.value = ''
    userInfo.value = {} as UserInfo
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return { 
    token, 
    userInfo, 
    setToken, 
    setUserInfo, 
    clearToken 
  }
})