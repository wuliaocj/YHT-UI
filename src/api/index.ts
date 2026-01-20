import axios from 'axios';
import type { HttpResult, Product, Category, Order, User, Coupon, Banner, Promotion, PaymentRecord, Address } from '@/types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const result: HttpResult = response.data;
    if (result.code === 200) {
      return result.data;
    } else {
      return Promise.reject(new Error(result.msg || '请求失败'));
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 商品API
export const productApi = {
  // 获取商品详情
  getProductDetail: (id: number) => api.get<Product>(`/product/${id}`),
  // 管理后台：获取所有商品
  getAllProducts: () => api.get<Product[]>('/product/admin/list'),
  // 管理后台：添加商品
  addProduct: (product: any) => api.post('/product/admin/add', product),
  // 注意：后端暂无编辑和删除接口，需要后端补充
};

// 分类API
export const categoryApi = {
  // 管理后台：保存分类（新增或更新）
  save: (category: Category) => api.post('/admin/category/save', category),
  // 管理后台：删除分类
  delete: (id: number) => api.post(`/admin/category/delete/${id}`),
  // 注意：后端暂无获取分类列表接口，需要后端补充
};

// 订单API
export const orderApi = {
  // 获取订单列表
  getList: (userId?: number) => {
    if (userId) {
      return api.get<Order[]>(`/order/list/${userId}`);
    }
    return api.get<Order[]>('/order/admin/order/list');
  },
  // 获取订单详情
  getDetail: (orderId: number) => api.get<Order>(`/order/${orderId}`),
  // 管理后台：更新订单状态
  updateStatus: (orderId: number, status: number, remark?: string) =>
    api.post('/order/admin/order/update', { orderId, status, adminRemark: remark }),
};

// 用户API
export const userApi = {
  // 管理后台：获取用户列表
  getList: (params?: { page?: number; size?: number; keyword?: string }) =>
    api.get<User[]>('/admin/user/list', { params }),
  // 管理后台：更新用户状态
  updateStatus: (userId: number, status: number) =>
    api.post(`/admin/user/updateStatus/${userId}`, { status }),
};

// 优惠券API
export const couponApi = {
  // 管理后台：获取优惠券列表
  getList: () => api.get<Coupon[]>('/admin/coupon/list'),
  // 管理后台：保存优惠券
  save: (coupon: Coupon) => api.post('/admin/coupon/save', coupon),
  // 管理后台：删除优惠券
  delete: (id: number) => api.post(`/admin/coupon/delete/${id}`),
};

// 轮播图API
export const bannerApi = {
  // 管理后台：获取轮播图列表
  getList: () => api.get<Banner[]>('/admin/banner/list'),
  // 管理后台：保存轮播图
  save: (banner: Banner) => api.post('/admin/banner/save', banner),
  // 管理后台：删除轮播图
  delete: (id: number) => api.post(`/admin/banner/delete/${id}`),
};

// 促销活动API
export const promotionApi = {
  // 管理后台：获取促销活动列表
  getList: () => api.get<Promotion[]>('/admin/promotion/list'),
  // 管理后台：保存促销活动
  save: (promotion: Promotion) => api.post('/admin/promotion/save', promotion),
  // 管理后台：删除促销活动
  delete: (id: number) => api.post(`/admin/promotion/delete/${id}`),
};

// 管理员API
export const adminApi = {
  // 登录
  login: (username: string, password: string) =>
    api.post<{ token: string; admin: any }>('/admin/login', { username, password }),
  // 获取当前管理员信息
  getCurrent: () => api.get('/admin/current'),
};

// 支付API
export const paymentApi = {
  // 创建支付单（生成支付参数）
  createPayment: (orderNo: string) => api.post<any>('/payment/create', null, { params: { orderNo } }),
  // 查询支付状态
  getPaymentStatus: (orderNo: string) => api.get<PaymentRecord>(`/payment/status/${orderNo}`),
  // 模拟支付成功（测试用）
  mockPaymentSuccess: (orderNo: string) => api.post('/payment/mock/success', null, { params: { orderNo } }),
};

// 地址API
export const addressApi = {
  // 获取用户地址列表
  getList: (userId: number) => api.get<Address[]>(`/address/list/${userId}`),
  // 保存地址（新增或更新）
  save: (address: Address) => api.post<Address>('/address/save', address),
  // 删除地址
  delete: (id: number) => api.post(`/address/delete/${id}`),
};

export default api;
