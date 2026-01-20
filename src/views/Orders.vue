<template>
  <div class="orders-page">
    <el-card>
      <template #header>
        <span>订单管理</span>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待付款" :value="1" />
            <el-option label="已付款" :value="2" />
            <el-option label="制作中" :value="3" />
            <el-option label="待取餐" :value="4" />
            <el-option label="已完成" :value="5" />
            <el-option label="已取消" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="orders" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="actualAmount" label="实付金额" width="120">
          <template #default="{ row }">¥{{ row.actualAmount }}</template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getOrderStatusType(row.orderStatus)">
              {{ getOrderStatusText(row.orderStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentStatus" label="支付状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.paymentStatus === 1 ? 'success' : 'warning'">
              {{ row.paymentStatus === 1 ? '已支付' : '未支付' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button
              v-if="row.orderStatus === 2"
              type="success"
              size="small"
              @click="handleUpdateStatus(row, 3)"
            >
              开始制作
            </el-button>
            <el-button
              v-if="row.orderStatus === 3"
              type="success"
              size="small"
              @click="handleUpdateStatus(row, 4)"
            >
              待取餐
            </el-button>
            <el-button
              v-if="row.orderStatus === 4"
              type="success"
              size="small"
              @click="handleUpdateStatus(row, 5)"
            >
              完成订单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog v-model="detailVisible" title="订单详情" width="800px">
      <el-descriptions :column="2" border v-if="currentOrder">
        <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ currentOrder.userId }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ currentOrder.totalAmount }}</el-descriptions-item>
        <el-descriptions-item label="优惠金额">¥{{ currentOrder.discountAmount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="配送费">¥{{ currentOrder.deliveryFee || 0 }}</el-descriptions-item>
        <el-descriptions-item label="实付金额">¥{{ currentOrder.actualAmount }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getOrderStatusType(currentOrder.orderStatus)">
            {{ getOrderStatusText(currentOrder.orderStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付状态">
          <el-tag :type="currentOrder.paymentStatus === 1 ? 'success' : 'warning'">
            {{ currentOrder.paymentStatus === 1 ? '已支付' : '未支付' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="用户备注">{{ currentOrder.userRemark || '无' }}</el-descriptions-item>
        <el-descriptions-item label="管理员备注">
          <el-input
            v-model="adminRemark"
            type="textarea"
            :rows="2"
            placeholder="请输入管理员备注"
          />
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentOrder.createTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleSaveRemark">保存备注</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { orderApi } from '@/api';
import type { Order } from '@/types';

const loading = ref(false);
const orders = ref<Order[]>([]);
const detailVisible = ref(false);
const currentOrder = ref<Order | null>(null);
const adminRemark = ref('');

const searchForm = reactive({
  orderNo: '',
  status: undefined as number | undefined,
});

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

const loadOrders = async () => {
  loading.value = true;
  try {
    orders.value = await orderApi.getList();
    if (searchForm.status !== undefined) {
      orders.value = orders.value.filter((o) => o.orderStatus === searchForm.status);
    }
    if (searchForm.orderNo) {
      orders.value = orders.value.filter((o) => o.orderNo.includes(searchForm.orderNo));
    }
  } catch (error) {
    ElMessage.error('加载订单列表失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  loadOrders();
};

const handleReset = () => {
  searchForm.orderNo = '';
  searchForm.status = undefined;
  loadOrders();
};

const handleView = async (row: Order) => {
  try {
    const order = await orderApi.getDetail(row.id!);
    currentOrder.value = order;
    adminRemark.value = order.adminRemark || '';
    detailVisible.value = true;
  } catch (error) {
    ElMessage.error('加载订单详情失败');
  }
};

const handleUpdateStatus = async (row: Order, status: number) => {
  try {
    const statusText = getOrderStatusText(status);
    await ElMessageBox.confirm(`确定要将订单状态更新为"${statusText}"吗？`, '提示', {
      type: 'warning',
    });
    await orderApi.updateStatus(row.id!, status);
    ElMessage.success('更新成功');
    loadOrders();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '更新失败');
    }
  }
};

const handleSaveRemark = async () => {
  if (!currentOrder.value) return;
  try {
    await orderApi.updateStatus(currentOrder.value.id!, currentOrder.value.orderStatus, adminRemark.value);
    ElMessage.success('保存成功');
    detailVisible.value = false;
    loadOrders();
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败');
  }
};

onMounted(() => {
  loadOrders();
});
</script>

<style scoped>
.orders-page {
  padding: 0;
}

.search-form {
  margin-bottom: 20px;
}
</style>
