import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 懒加载组件
const Layout = () => import('@/layouts/Layout.vue')
const Login = () => import('@/views/Login.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const Products = () => import('@/views/Products.vue')
const Categories = () => import('@/views/Categories.vue')
const Orders = () => import('@/views/Orders.vue')
const Users = () => import('@/views/Users.vue')
const Image = () => import('@/views/Image.vue')
const Coupons = () => import('@/views/Coupons.vue')
const Promotions = () => import('@/views/Promotions.vue')
const Banners = () => import('@/views/Banners.vue')

// 路由规则（带类型）
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '管理员登录', requiresAuth: false }
  },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: Dashboard, meta: { title: '仪表盘' } },
      { path: 'products', name: 'Products', component: Products, meta: { title: '商品管理' } },
      { path: 'categories', name: 'Categories', component: Categories, meta: { title: '分类管理' } },
      { path: 'orders', name: 'Orders', component: Orders, meta: { title: '订单管理' } },
      { path: 'users', name: 'Users', component: Users, meta: { title: '用户管理' } },
      { path: 'coupons', name: 'Coupons', component: Coupons, meta: { title: '优惠券管理' } },
      { path: 'promotions', name: 'Promotions', component: Promotions, meta: { title: '促销活动管理' } },
      { path: 'banners', name: 'Banners', component: Banners, meta: { title: '轮播图管理' } },
      { path: 'image', name: 'Image', component: Image, meta: { title: '图片管理' } }
    ]
  }
]

// 创建路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || import.meta.env.VITE_APP_TITLE || '益禾堂管理系统'
  
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  // 直接从localStorage获取token，避免在路由守卫中使用Pinia
  const token = localStorage.getItem('token')
  if (token) {
    next()
  } else {
    next('/login')
  }
})

export default router