// 促销活动信息
export interface Promotion {
  id: number
  name: string
  type: number
  description: string
  startTime: string
  endTime: string
  status: number
  createTime: string
  updateTime: string
  // 活动规则配置，根据活动类型不同而不同
  rules?: any
}