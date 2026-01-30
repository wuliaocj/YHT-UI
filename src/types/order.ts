// 订单信息
export interface Order {
  id: number
  orderNo: string
  userId: number
  totalAmount: number
  discountAmount?: number
  deliveryFee?: number
  actualAmount: number
  paymentMethod?: number
  paymentStatus: number
  paymentTime?: string
  transactionId?: string
  orderStatus: number
  orderType?: number
  takeCode?: string
  estimatedTime?: string
  completeTime?: string
  cancelReason?: string
  cancelTime?: string
  userRemark?: string
  adminRemark?: string
  createTime: string
  updateTime?: string
}
