<template>
  <el-container class="admin-container" style="height: 100vh;">
    <!-- 侧边栏 -->
    <el-aside width="240px" class="admin-sidebar">
      <!-- 侧边栏头部 -->
      <div class="sidebar-header">
        <div class="logo">
          <el-icon class="logo-icon"><House /></el-icon>
          <span class="logo-text">管理后台</span>
        </div>
      </div>
      
      <!-- 侧边栏菜单 -->
      <el-menu
        :default-active="activeMenu"
        class="admin-menu"
        :background-color="'var(--color-background-soft)'"
        :text-color="'var(--color-text)'"
        :active-text-color="'var(--color-primary)'"
        @select="handleMenuSelect"
        @open="handleMenuOpen"
        @close="handleMenuClose"
      >
        <!-- 仪表盘 -->
        <el-menu-item index="1">
          <el-icon class="menu-icon"><House /></el-icon>
          <span class="menu-text">仪表盘</span>
        </el-menu-item>
        
        <!-- 商品管理 -->
        <el-submenu index="2">
          <template #title>
            <el-icon class="menu-icon"><Goods /></el-icon>
            <span class="menu-text">商品管理</span>
          </template>
          <el-menu-item index="2-1">
            <span class="menu-text">商品列表</span>
          </el-menu-item>
          <el-menu-item index="2-2">
            <span class="menu-text">分类管理</span>
          </el-menu-item>
        </el-submenu>
        
        <!-- 订单管理 -->
        <el-menu-item index="3">
          <el-icon class="menu-icon"><ShoppingCart /></el-icon>
          <span class="menu-text">订单管理</span>
        </el-menu-item>
        
        <!-- 用户管理 -->
        <el-menu-item index="4">
          <el-icon class="menu-icon"><User /></el-icon>
          <span class="menu-text">用户管理</span>
        </el-menu-item>
        
        <!-- 优惠券管理 -->
        <el-menu-item index="5">
          <el-icon class="menu-icon"><Ticket /></el-icon>
          <span class="menu-text">优惠券管理</span>
        </el-menu-item>
        
        <!-- 促销活动管理 -->
        <el-menu-item index="6">
          <el-icon class="menu-icon"><MagicStick /></el-icon>
          <span class="menu-text">促销活动管理</span>
        </el-menu-item>
        
        <!-- 轮播图管理 -->
        <el-menu-item index="7">
          <el-icon class="menu-icon"><Picture /></el-icon>
          <span class="menu-text">轮播图管理</span>
        </el-menu-item>
        
        <!-- 图片管理 -->
        <el-menu-item index="8">
          <el-icon class="menu-icon"><Camera /></el-icon>
          <span class="menu-text">图片管理</span>
        </el-menu-item>
        
        <!-- 退出登录 -->
        <el-menu-item index="9" @click="handleLogout">
          <el-icon class="menu-icon"><SwitchButton /></el-icon>
          <span class="menu-text">退出登录</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container class="main-container">
      <!-- 顶部导航 -->
      <el-header class="admin-header">
        <!-- 左侧面包屑 -->
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPage }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <!-- 右侧用户信息 -->
        <div class="user-info">
          <el-dropdown trigger="click" @command="handleUserCommand">
            <span class="user-dropdown">
              <el-avatar :size="32" :src="userStore.userInfo.avatarUrl || ''" class="user-avatar">
                {{ getUserInitial(userStore.userInfo.nickname || '管理员') }}
              </el-avatar>
              <span class="user-name">{{ userStore.userInfo.nickname || '管理员' }}</span>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="settings">设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容区域（路由出口） -->
      <el-main class="admin-main">
        <!-- 核心：路由视图，匹配嵌套的子路由（如Home、ProductList） -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  House, Goods, ShoppingCart, User, SwitchButton, Ticket, MagicStick, Picture, Camera, ArrowDown 
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

// 获取用户状态
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 当前激活的菜单
const activeMenu = ref('1')

// 当前页面
const currentPage = ref('仪表盘')

// 更新激活的菜单
const updateActiveMenu = (path: string) => {
  switch (path) {
    case '/':
      activeMenu.value = '1'
      break
    case '/products':
      activeMenu.value = '2-1'
      break
    case '/categories':
      activeMenu.value = '2-2'
      break
    case '/orders':
      activeMenu.value = '3'
      break
    case '/users':
      activeMenu.value = '4'
      break
    case '/coupons':
      activeMenu.value = '5'
      break
    case '/promotions':
      activeMenu.value = '6'
      break
    case '/banners':
      activeMenu.value = '7'
      break
    case '/image':
      activeMenu.value = '8'
      break
    default:
      activeMenu.value = '1'
      break
  }
}

// 更新当前页面
const updateCurrentPage = (path: string) => {
  switch (path) {
    case '/':
      currentPage.value = '仪表盘'
      break
    case '/products':
      currentPage.value = '商品列表'
      break
    case '/categories':
      currentPage.value = '分类管理'
      break
    case '/orders':
      currentPage.value = '订单管理'
      break
    case '/users':
      currentPage.value = '用户管理'
      break
    case '/coupons':
      currentPage.value = '优惠券管理'
      break
    case '/promotions':
      currentPage.value = '促销活动管理'
      break
    case '/banners':
      currentPage.value = '轮播图管理'
      break
    case '/image':
      currentPage.value = '图片管理'
      break
    default:
      currentPage.value = '仪表盘'
      break
  }
}

// 监听路由变化，更新激活的菜单和当前页面
watch(() => route.path, (newPath) => {
  updateActiveMenu(newPath)
  updateCurrentPage(newPath)
}, { immediate: true })

// 侧边栏菜单点击事件
const handleMenuSelect = (index: string) => {
  // 根据菜单索引跳转对应路由
  switch (index) {
    case '1':
      router.push('/') // 仪表盘
      break
    case '2-1':
      router.push('/products') // 商品列表
      break
    case '2-2':
      router.push('/categories') // 分类管理
      break
    case '3':
      router.push('/orders') // 订单管理
      break
    case '4':
      router.push('/users') // 用户管理
      break
    case '5':
      router.push('/coupons') // 优惠券管理
      break
    case '6':
      router.push('/promotions') // 促销活动管理
      break
    case '7':
      router.push('/banners') // 轮播图管理
      break
    case '8':
      router.push('/image') // 图片管理
      break
    case '9':
      handleLogout() // 退出登录
      break
  }
}

// 菜单展开事件
const handleMenuOpen = (key: string, keyPath: string[]) => {
  console.log('菜单展开:', key, keyPath)
}

// 菜单收起事件
const handleMenuClose = (key: string, keyPath: string[]) => {
  console.log('菜单收起:', key, keyPath)
}

// 用户下拉菜单命令处理
const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      // 跳转到个人资料页面
      console.log('个人资料')
      break
    case 'settings':
      // 跳转到设置页面
      console.log('设置')
      break
    case 'logout':
      // 退出登录
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = () => {
  userStore.clearToken() // 清除Token
  ElMessage.success('退出登录成功')
  router.push('/login') // 跳登录页
}

// 获取用户姓名首字母
const getUserInitial = (name: string) => {
  if (!name) return '管'
  return name.charAt(0)
}
</script>

<style scoped>
/* 管理容器 */
.admin-container {
  background-color: var(--color-background-light);
}

/* 侧边栏 */
.admin-sidebar {
  background-color: var(--color-background-soft);
  border-right: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

/* 侧边栏头部 */
.sidebar-header {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

/* 侧边栏Logo */
.logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.logo-icon {
  font-size: 24px;
  color: var(--color-primary);
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-heading);
}

/* 侧边栏菜单 */
.admin-menu {
  margin: 0;
  border-radius: 0;
  height: calc(100vh - 80px);
  overflow-y: auto;
}

/* 菜单图标 */
.menu-icon {
  font-size: 18px;
  transition: all var(--transition-fast);
}

/* 菜单文本 */
.menu-text {
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

/* 菜单项 */
:deep(.el-menu-item) {
  margin: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

:deep(.el-menu-item:hover) {
  background-color: var(--color-background-mute) !important;
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(59, 130, 246, 0.1) !important;
}

/* 子菜单项 */
:deep(.el-submenu__title) {
  margin: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

:deep(.el-submenu__title:hover) {
  background-color: var(--color-background-mute) !important;
}

/* 子菜单容器 */
:deep(.el-submenu .el-menu) {
  background-color: transparent !important;
}

/* 子菜单项 */
:deep(.el-submenu .el-menu-item) {
  padding-left: var(--space-2xl) !important;
}

/* 顶部导航栏 */
.admin-header {
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--space-xl);
}

/* 面包屑 */
.breadcrumb {
  display: flex;
  align-items: center;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: var(--color-primary);
  font-weight: 500;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
}

/* 用户下拉菜单 */
.user-dropdown {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.user-dropdown:hover {
  background-color: var(--color-background-soft);
}

/* 用户头像 */
.user-avatar {
  border: 2px solid var(--color-primary-light);
  transition: all var(--transition-fast);
}

.user-avatar:hover {
  transform: scale(1.05);
}

/* 用户名 */
.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}

/* 下拉图标 */
.dropdown-icon {
  font-size: 14px;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

/* 主内容区域 */
.admin-main {
  background-color: var(--color-background-light);
  padding: var(--space-xl);
  overflow-y: auto;
}

/* 淡入动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal), transform var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 侧边栏 */
  .admin-sidebar {
    width: 200px !important;
  }
  
  /* 侧边栏Logo */
  .logo-text {
    font-size: 16px;
  }
  
  /* 顶部导航栏 */
  .admin-header {
    padding: 0 var(--space-md);
  }
  
  /* 面包屑 */
  .breadcrumb {
    display: none;
  }
  
  /* 主内容区域 */
  .admin-main {
    padding: var(--space-md);
  }
}

@media (max-width: 480px) {
  /* 侧边栏 */
  .admin-sidebar {
    width: 60px !important;
  }
  
  /* 侧边栏Logo */
  .logo-text {
    display: none;
  }
  
  /* 菜单文本 */
  .menu-text {
    display: none;
  }
  
  /* 菜单项 */
  :deep(.el-menu-item) {
    padding: 0 var(--space-sm) !important;
    justify-content: center;
  }
  
  /* 子菜单项 */
  :deep(.el-submenu__title) {
    padding: 0 var(--space-sm) !important;
    justify-content: center;
  }
  
  /* 主内容区域 */
  .admin-main {
    padding: var(--space-sm);
  }
}
</style>