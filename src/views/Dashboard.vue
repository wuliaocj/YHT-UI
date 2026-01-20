<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #409eff;">
              <el-icon><Goods /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.products }}</div>
              <div class="stat-label">商品总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #67c23a;">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.orders }}</div>
              <div class="stat-label">订单总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #e6a23c;">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.users }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #f56c6c;">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ stats.revenue }}</div>
              <div class="stat-label">今日营收</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>最近订单</span>
          </template>
          <el-table :data="recentOrders" style="width: 100%">
            <el-table-column prop="orderNo" label="订单号" width="180" />
            <el-table-column prop="actualAmount" label="金额" width="100">
              <template #default="{ row }">
                ¥{{ row.actualAmount }}
              </template>
            </el-table-column>
            <el-table-column prop="orderStatus" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getOrderStatusType(row.orderStatus)">
                  {{ getOrderStatusText(row.orderStatus) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>热销商品</span>
          </template>
          <el-table :data="hotProducts" style="width: 100%">
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="salesCount" label="销量" width="100" />
            <el-table-column prop="basePrice" label="价格" width="100">
              <template #default="{ row }">
                ¥{{ row.basePrice }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Goods, Document, User, Money } from '@element-plus/icons-vue';
import { orderApi, productApi } from '@/api';
import type { Order, Product } from '@/types';

const stats = ref({
  products: 0,
  orders: 0,
  users: 0,
  revenue: '0.00',
});

const recentOrders = ref<Order[]>([]);
const hotProducts = ref<Product[]>([]);

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

onMounted(async () => {
  try {
    // 获取最近订单（管理员接口）
    const orders = await orderApi.getList();
    recentOrders.value = orders.slice(0, 5);
    stats.value.orders = orders.length;

    // 计算今日营收（已支付订单）
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => {
      if (o.paymentStatus !== 1) return false;
      const orderDate = o.createTime?.split('T')[0];
      return orderDate === today;
    });
    stats.value.revenue = todayOrders.reduce((sum, o) => sum + (o.actualAmount || 0), 0).toFixed(2);

    // 获取所有商品
    const products = await productApi.getAllProducts();
    stats.value.products = products.length;
    // 按销量排序获取热销商品
    hotProducts.value = [...products]
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 5);

    // 获取用户数量（需要后端统计接口，这里先使用订单中的用户数）
    const userIds = new Set(orders.map(o => o.userId));
    stats.value.users = userIds.size;
  } catch (error) {
    console.error('加载数据失败:', error);
  }
});
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  margin-right: 15px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}
</style>
