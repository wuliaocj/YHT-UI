// 登录表单
export interface LoginForm {
  username: string
  password: string
}

// 用户信息
export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
  phone?: string
  email?: string
  role: string
}

// 系统用户信息
export interface User {
  id: number
  openid: string
  unionid?: string
  nickname: string
  avatarUrl: string
  phone: string
  gender: number
  province?: string
  city?: string
  integral: number
  vipLevel: number
  totalConsumption: number
  lastLoginTime?: string
  status: number
  createTime: string
  updateTime?: string
}