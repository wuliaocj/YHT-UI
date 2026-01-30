<template>
  <div class="dashboard fade-in">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>仪表盘</h1>
      <p class="page-description">欢迎回来，这里是您的管理中心</p>
    </div>
    
    <!-- 统计卡片区域 -->
    <el-row :gutter="20" class="stats-row">
      <!-- 商品总数 -->
      <el-col :span="6">
        <el-card class="stat-card product-card">
          <div class="stat-content">
            <div class="stat-icon product-icon">
              <el-icon><Goods /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.products }}</div>
              <div class="stat-label">商品总数</div>
              <div class="stat-change positive">
                <el-icon><ArrowUp /></el-icon>
                <span>+{{ stats.productGrowth }}%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 订单总数 -->
      <el-col :span="6">
        <el-card class="stat-card order-card">
          <div class="stat-content">
            <div class="stat-icon order-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.orders }}</div>
              <div class="stat-label">订单总数</div>
              <div class="stat-change positive">
                <el-icon><ArrowUp /></el-icon>
                <span>+{{ stats.orderGrowth }}%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 用户总数 -->
      <el-col :span="6">
        <el-card class="stat-card user-card">
          <div class="stat-content">
            <div class="stat-icon user-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.users }}</div>
              <div class="stat-label">用户总数</div>
              <div class="stat-change positive">
                <el-icon><ArrowUp /></el-icon>
                <span>+{{ stats.userGrowth }}%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 今日营收 -->
      <el-col :span="6">
        <el-card class="stat-card revenue-card">
          <div class="stat-content">
            <div class="stat-icon revenue-icon">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ stats.revenue }}</div>
              <div class="stat-label">今日营收</div>
              <div class="stat-change positive">
                <el-icon><ArrowUp /></el-icon>
                <span>+{{ stats.revenueGrowth }}%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表和列表区域 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 最近订单 -->
      <el-col :span="12">
        <el-card class="data-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">最近订单</span>
              <el-button type="primary" size="small" class="view-all-btn">
                查看全部
              </el-button>
            </div>
          </template>
          <el-table :data="recentOrders" style="width: 100%" class="order-table">
            <el-table-column prop="orderNo" label="订单号" width="180">
              <template #default="{ row }">
                <span class="order-no">{{ row.orderNo }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="actualAmount" label="金额" width="100">
              <template #default="{ row }">
                <span class="order-amount">¥{{ row.actualAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="orderStatus" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getOrderStatusType(row.orderStatus)" class="status-tag">
                  {{ getOrderStatusText(row.orderStatus) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
              <template #default="{ row }">
                <span class="order-time">{{ formatTime(row.createTime) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      
      <!-- 热销商品 -->
      <el-col :span="12">
        <el-card class="data-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">热销商品</span>
              <el-button type="primary" size="small" class="view-all-btn">
                查看全部
              </el-button>
            </div>
          </template>
          <el-table :data="hotProducts" style="width: 100%" class="product-table">
            <el-table-column label="排名" width="60">
              <template #default="{ $index }">
                <div class="rank-number" :class="{ 'top-rank': $index < 3 }">
                  {{ $index + 1 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称">
              <template #default="{ row }">
                <div class="product-info">
                  <el-avatar :size="40" :src="row.mainImage || ''" class="product-avatar">
                    {{ getProductInitial(row.name) }}
                  </el-avatar>
                  <span class="product-name">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="salesCount" label="销量" width="100">
              <template #default="{ row }">
                <div class="sales-info">
                  <span class="sales-count">{{ row.salesCount || 0 }}</span>
                  <div class="sales-bar">
                    <div class="sales-progress" :style="{ width: getSalesProgress(row.salesCount || 0) + '%' }"></div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="basePrice" label="价格" width="100">
              <template #default="{ row }">
                <span class="product-price">¥{{ row.basePrice }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 业务概览区域 -->
    <el-row :gutter="20" class="overview-row">
      <!-- 销售趋势 -->
      <el-col :span="12">
        <el-card class="data-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">销售趋势</span>
              <el-select v-model="timeRange" placeholder="选择时间范围" size="small" class="time-select">
                <el-option label="最近7天" value="7" />
                <el-option label="最近30天" value="30" />
                <el-option label="最近90天" value="90" />
              </el-select>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里可以集成ECharts等图表库 -->
            <div class="chart-placeholder">
              <el-icon class="chart-icon"><DataAnalysis /></el-icon>
              <p>销售趋势图表</p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 业务概览 -->
      <el-col :span="12">
        <el-card class="data-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">业务概览</span>
            </div>
          </template>
          <div class="overview-grid">
            <div class="overview-item">
              <div class="overview-value">¥{{ stats.totalRevenue }}</div>
              <div class="overview-label">总营收</div>
            </div>
            <div class="overview-item">
              <div class="overview-value">{{ stats.completedOrders }}</div>
              <div class="overview-label">已完成订单</div>
            </div>
            <div class="overview-item">
              <div class="overview-value">{{ stats.pendingOrders }}</div>
              <div class="overview-label">待处理订单</div>
            </div>
            <div class="overview-item">
              <div class="overview-value">{{ stats.activeUsers }}</div>
              <div class="overview-label">活跃用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Goods, Document, User, Money, ArrowUp, DataAnalysis } from '@element-plus/icons-vue';
import { orderApi, productApi } from '@/api';
import type { Order, Product } from '@/types';

// 统计数据
const stats = ref({
  products: 0,
  orders: 0,
  users: 0,
  revenue: '0.00',
  productGrowth: 15.2,
  orderGrowth: 8.7,
  userGrowth: 5.3,
  revenueGrowth: 12.5,
  totalRevenue: '125,680.00',
  completedOrders: 0,
  pendingOrders: 0,
  activeUsers: 0
});

// 最近订单
const recentOrders = ref<Order[]>([]);

// 热销商品
const hotProducts = ref<Product[]>([]);

// 时间范围
const timeRange = ref('7');

// 获取订单状态文本
const getOrderStatusText = (status: number) => {
  // 根据后端OrderStatusEnum: 1-待付款, 2-已付款, 3-制作中, 4-待取餐, 5-已完成, 6-已取消
  const statusMap: Record<number, string> = {
    1: '待付款',
    2: '已付款',
    3: '制作中',
    4: '待取餐',
    5: '已完成',
    6: '已取消',
  };
  return statusMap[status] || '未知';
};

// 获取订单状态类型
const getOrderStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    1: 'warning',
    2: 'success',
    3: 'info',
    4: 'info',
    5: 'success',
    6: 'danger',
  };
  return typeMap[status] || '';
};

// 格式化时间
const formatTime = (time: string) => {
  if (!time) return '';
  const date = new Date(time);
  return date.toLocaleString();
};

// 获取商品名称首字母
const getProductInitial = (name: string) => {
  if (!name) return '商';
  return name.charAt(0);
};

// 获取销量进度
const getSalesProgress = (sales: number) => {
  if (sales === 0) return 0;
  const maxSales = Math.max(...hotProducts.value.map(p => p.salesCount || 0));
  return (sales / maxSales) * 100;
};

// 挂载时加载数据
onMounted(async () => {
  try {
    // 获取最近订单（管理员接口）
    const orders = await orderApi.getList();
    // 确保orders是数组
    const orderList = Array.isArray(orders) ? orders : [];
    recentOrders.value = orderList.slice(0, 5);
    stats.value.orders = orderList.length;
    
    // 计算今日营收（已支付订单）
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orderList.filter(o => {
      if (o.paymentStatus !== 1) return false;
      const orderDate = o.createTime?.split('T')[0];
      return orderDate === today;
    });
    stats.value.revenue = todayOrders.reduce((sum, o) => sum + (o.actualAmount || 0), 0).toFixed(2);
    
    // 计算待处理和已完成订单
    stats.value.pendingOrders = orderList.filter(o => o.orderStatus < 5).length;
    stats.value.completedOrders = orderList.filter(o => o.orderStatus === 5).length;
    
    // 获取所有商品
    const products = await productApi.getAllProducts();
    // 确保products是数组
    const productList = Array.isArray(products) ? products : [];
    stats.value.products = productList.length;
    
    // 按销量排序获取热销商品
    hotProducts.value = [...productList]
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 5);
    
    // 获取用户数量（需要后端统计接口，这里先使用订单中的用户数）
    const userIds = new Set(orderList.map(o => o.userId));
    stats.value.users = userIds.size;
    stats.value.activeUsers = Math.floor(userIds.size * 0.85); // 假设85%的用户是活跃的
    
  } catch (error) {
    console.error('加载数据失败:', error);
  }
});
</script>

<style scoped>
/* 页面容器 */
.dashboard {
  padding: 0;
}

/* 页面标题 */
.page-header {
  margin-bottom: var(--space-xl);
}

.page-header h1 {
  margin-bottom: var(--space-xs);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
}

.page-description {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin: 0;
}

/* 统计卡片行 */
.stats-row {
  margin-bottom: var(--space-xl);
}

/* 统计卡片 */
.stat-card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  overflow: hidden;
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* 商品卡片 */
.product-card {
  border-top: 4px solid var(--color-primary);
}

.product-icon {
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
}

/* 订单卡片 */
.order-card {
  border-top: 4px solid var(--color-secondary);
}

.order-icon {
  background: linear-gradient(135deg, var(--color-secondary-light), var(--color-secondary));
}

/* 用户卡片 */
.user-card {
  border-top: 4px solid var(--color-accent);
}

.user-icon {
  background: linear-gradient(135deg, var(--color-accent-light), var(--color-accent));
}

/* 营收卡片 */
.revenue-card {
  border-top: 4px solid var(--color-danger);
}

.revenue-icon {
  background: linear-gradient(135deg, var(--color-danger-light), var(--color-danger));
}

/* 统计内容 */
.stat-content {
  display: flex;
  align-items: center;
  padding: var(--space-lg);
}

/* 统计图标 */
.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  margin-right: var(--space-lg);
  box-shadow: var(--shadow-md);
}

/* 统计信息 */
.stat-info {
  flex: 1;
}

/* 统计值 */
.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: var(--space-xs);
}

/* 统计标签 */
.stat-label {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xs);
}

/* 统计变化 */
.stat-change {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 12px;
  font-weight: 500;
}

.stat-change.positive {
  color: var(--color-success);
}

.stat-change.negative {
  color: var(--color-danger);
}

/* 图表和列表区域 */
.charts-row,
.overview-row {
  margin-bottom: var(--space-xl);
}

/* 数据卡片 */
.data-card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.data-card:hover {
  box-shadow: var(--shadow-md);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0;
}

/* 查看全部按钮 */
.view-all-btn {
  font-size: 12px;
}

/* 时间选择器 */
.time-select {
  width: 120px;
}

/* 订单表格 */
.order-table {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* 订单号 */
.order-no {
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* 订单金额 */
.order-amount {
  font-weight: 600;
  color: var(--color-primary);
}

/* 订单时间 */
.order-time {
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* 商品表格 */
.product-table {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* 排名数字 */
.rank-number {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

.rank-number.top-rank {
  background-color: var(--color-accent);
  color: #fff;
}

/* 商品信息 */
.product-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

/* 商品头像 */
.product-avatar {
  border: 2px solid var(--color-border);
}

/* 商品名称 */
.product-name {
  font-weight: 500;
  color: var(--color-text);
}

/* 销量信息 */
.sales-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

/* 销量数量 */
.sales-count {
  font-weight: 600;
  color: var(--color-text);
}

/* 销量条形图 */
.sales-bar {
  width: 100%;
  height: 4px;
  background-color: var(--color-background-mute);
  border-radius: var(--radius-full);
  overflow: hidden;
}

/* 销量进度 */
.sales-progress {
  height: 100%;
  background-color: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
}

/* 商品价格 */
.product-price {
  font-weight: 600;
  color: var(--color-primary);
}

/* 图表容器 */
.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 图表占位符 */
.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
}

.chart-placeholder .chart-icon {
  font-size: 48px;
  margin-bottom: var(--space-md);
}

/* 概览网格 */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
  padding: var(--space-lg);
}

/* 概览项 */
.overview-item {
  background-color: var(--color-background-soft);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  text-align: center;
  transition: all var(--transition-fast);
}

.overview-item:hover {
  background-color: var(--color-background-mute);
  transform: translateY(-2px);
}

/* 概览值 */
.overview-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: var(--space-xs);
}

/* 概览标签 */
.overview-label {
  font-size: 14px;
  color: var(--color-text-secondary);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  /* 统计卡片改为两列 */
  .stats-row .el-col {
    flex: 0 0 50%;
    max-width: 50%;
  }
  
  /* 图表和列表改为单列 */
  .charts-row .el-col,
  .overview-row .el-col {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: var(--space-lg);
  }
  
  /* 页面标题 */
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  /* 统计值 */
  .stat-value {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  /* 统计卡片改为单列 */
  .stats-row .el-col {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: var(--space-md);
  }
  
  /* 统计内容 */
  .stat-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }
  
  /* 统计图标 */
  .stat-icon {
    margin-right: 0;
  }
}
</style>
