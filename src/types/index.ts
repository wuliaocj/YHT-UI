// 类型定义
export interface HttpResult<T = any> {
  code: number;
  msg?: string;
  data?: T;
}

// 商品
export interface Product {
  id?: number;
  categoryId: number;
  name: string;
  enName?: string;
  description?: string;
  detail?: string;
  mainImage: string;
  images?: string;
  basePrice: number;
  originPrice?: number;
  inventory: number;
  salesCount?: number;
  isHot?: number;
  isNew?: number;
  isRecommend?: number;
  customOptions?: string;
  status: number;
  sortOrder?: number;
  createTime?: string;
  updateTime?: string;
}

// 分类
export interface Category {
  id?: number;
  name: string;
  icon?: string;
  description?: string;
  sortOrder?: number;
  status: number;
  createTime?: string;
}

// 订单
export interface Order {
  id?: number;
  orderNo: string;
  userId: number;
  totalAmount: number;
  discountAmount?: number;
  deliveryFee?: number;
  actualAmount: number;
  paymentMethod?: number;
  paymentStatus?: number;
  paymentTime?: string;
  transactionId?: string;
  orderStatus: number;
  orderType?: number;
  takeCode?: string;
  estimatedTime?: string;
  completeTime?: string;
  cancelReason?: string;
  cancelTime?: string;
  userRemark?: string;
  adminRemark?: string;
  createTime?: string;
  updateTime?: string;
}

// 用户
export interface User {
  id?: number;
  openid?: string;
  unionid?: string;
  nickname?: string;
  avatarUrl?: string;
  phone?: string;
  gender?: number;
  province?: string;
  city?: string;
  integral?: number;
  vipLevel?: number;
  totalConsumption?: number;
  lastLoginTime?: string;
  status: number;
  createTime?: string;
  updateTime?: string;
}

// 优惠券
export interface Coupon {
  id?: number;
  name: string;
  type: number;
  value: number;
  minAmount?: number;
  totalCount?: number;
  remainingCount?: number;
  limitPerUser?: number;
  validityType?: number;
  startTime?: string;
  endTime?: string;
  validDays?: number;
  applicableProducts?: string;
  applicableCategories?: string;
  status: number;
  createTime?: string;
}

// 轮播图
export interface Banner {
  id?: number;
  title: string;
  imageUrl: string;
  linkType?: number;
  linkValue?: string;
  sortOrder?: number;
  status: number;
  startTime?: string;
  endTime?: string;
  createTime?: string;
}

// 促销活动
export interface Promotion {
  id?: number;
  name: string;
  type: number;
  description?: string;
  ruleConfig?: string;
  startTime?: string;
  endTime?: string;
  status: number;
  sortOrder?: number;
  createTime?: string;
}

// 管理员
export interface Admin {
  id?: number;
  username: string;
  password?: string;
  realName?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  role?: number;
  status?: number;
  lastLoginTime?: string;
  lastLoginIp?: string;
  createTime?: string;
  updateTime?: string;
}

// 支付记录
export interface PaymentRecord {
  id?: number;
  orderNo: string;
  paymentNo: string;
  userId: number;
  amount: number;
  paymentMethod: number;
  paymentStatus: number;
  transactionId?: string;
  createTime?: string;
  payTime?: string;
  callbackTime?: string;
  callbackContent?: string;
  refundAmount?: number;
  refundTime?: string;
  refundReason?: string;
}

// 地址
export interface Address {
  id?: number;
  userId: number;
  consignee: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  postalCode?: string;
  isDefault?: number;
  status: number;
  createTime?: string;
  updateTime?: string;
}
