<template>
  <div class="coupons-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>优惠券管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加优惠券
          </el-button>
        </div>
      </template>

      <el-table :data="coupons" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="优惠券名称" min-width="150" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            {{ row.type === 1 ? '满减券' : row.type === 2 ? '折扣券' : '其他' }}
          </template>
        </el-table-column>
        <el-table-column prop="value" label="面额" width="120">
          <template #default="{ row }">
            {{ row.type === 1 ? `¥${row.value}` : `${row.value}折` }}
          </template>
        </el-table-column>
        <el-table-column prop="minAmount" label="最低消费" width="120">
          <template #default="{ row }">¥{{ row.minAmount || 0 }}</template>
        </el-table-column>
        <el-table-column prop="remainingCount" label="剩余数量" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="endTime" label="结束时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 优惠券编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form
        ref="couponFormRef"
        :model="couponForm"
        :rules="couponRules"
        label-width="120px"
      >
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="couponForm.name" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="couponForm.type">
            <el-radio :label="1">满减券</el-radio>
            <el-radio :label="2">折扣券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="面额/折扣" prop="value">
          <el-input-number v-model="couponForm.value" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="最低消费">
          <el-input-number v-model="couponForm.minAmount" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="总数量">
          <el-input-number v-model="couponForm.totalCount" :min="1" />
        </el-form-item>
        <el-form-item label="每人限领">
          <el-input-number v-model="couponForm.limitPerUser" :min="1" />
        </el-form-item>
        <el-form-item label="有效期类型">
          <el-radio-group v-model="couponForm.validityType">
            <el-radio :label="1">固定时间</el-radio>
            <el-radio :label="2">领取后N天</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="couponForm.validityType === 1" label="开始时间">
          <el-date-picker
            v-model="couponForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item v-if="couponForm.validityType === 1" label="结束时间">
          <el-date-picker
            v-model="couponForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item v-if="couponForm.validityType === 2" label="有效天数">
          <el-input-number v-model="couponForm.validDays" :min="1" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="couponForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { couponApi } from '@/api';
import type { Coupon } from '@/types';

const loading = ref(false);
const coupons = ref<Coupon[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref('添加优惠券');
const couponFormRef = ref<FormInstance>();

const couponForm = reactive<Coupon>({
  name: '',
  type: 1,
  value: 0,
  minAmount: 0,
  totalCount: 100,
  remainingCount: 100,
  limitPerUser: 1,
  validityType: 1,
  startTime: '',
  endTime: '',
  validDays: 7,
  status: 1,
});

const couponRules: FormRules = {
  name: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  value: [{ required: true, message: '请输入面额', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const loadCoupons = async () => {
  loading.value = true;
  try {
    coupons.value = await couponApi.getList();
  } catch (error) {
    ElMessage.error('加载优惠券列表失败');
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  dialogTitle.value = '添加优惠券';
  Object.assign(couponForm, {
    name: '',
    type: 1,
    value: 0,
    minAmount: 0,
    totalCount: 100,
    remainingCount: 100,
    limitPerUser: 1,
    validityType: 1,
    startTime: '',
    endTime: '',
    validDays: 7,
    status: 1,
  });
  dialogVisible.value = true;
};

const handleEdit = (row: Coupon) => {
  dialogTitle.value = '编辑优惠券';
  Object.assign(couponForm, row);
  dialogVisible.value = true;
};

const handleDelete = async (row: Coupon) => {
  try {
    await ElMessageBox.confirm('确定要删除这个优惠券吗？', '提示', {
      type: 'warning',
    });
    await couponApi.delete(row.id!);
    ElMessage.success('删除成功');
    loadCoupons();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败');
    }
  }
};

const handleSubmit = async () => {
  if (!couponFormRef.value) return;
  await couponFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await couponApi.save(couponForm);
        ElMessage.success(dialogTitle.value === '添加优惠券' ? '添加成功' : '更新成功');
        dialogVisible.value = false;
        loadCoupons();
      } catch (error: any) {
        ElMessage.error(error.message || '操作失败');
      }
    }
  });
};

const handleDialogClose = () => {
  couponFormRef.value?.resetFields();
};

onMounted(() => {
  loadCoupons();
});
</script>

<style scoped>
.coupons-page {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
