// 优惠券信息
export interface Coupon {
  id: number
  name: string
  type: number
  value: number
  minAmount: number
  totalCount: number
  remainingCount: number
  limitPerUser: number
  validityType: number
  startTime: string
  endTime: string
  validDays: number
  applicableProducts: string
  applicableCategories: string
  status: number
  createTime: string
}