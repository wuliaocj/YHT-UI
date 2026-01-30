// 通用响应类型
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

// 分页参数
export interface PageParams {
  pageNum: number
  pageSize: number
  keyword?: string
}

// 分页结果
export interface PageResult<T = any> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

// HTTP响应结果
export interface HttpResult<T = any> {
  code: number
  msg: string
  data: T
}

// 导出商品相关类型
export * from './product'

// 导出用户相关类型
export * from './user'

// 导出订单相关类型
export * from './order'

// 导出优惠券相关类型
export * from './coupon'

// 导出促销活动相关类型
export * from './promotion'

// 导出轮播图相关类型
export * from './banner'