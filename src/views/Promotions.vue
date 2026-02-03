<template>
  <div class="promotions-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>促销活动管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加促销活动
          </el-button>
        </div>
      </template>

      <el-form :inline="true" : ="searchForm" class="search-form">
        <el-form-item label="活动名称">
          <el-input v-model="searchForm.name" placeholder="请输入活动名称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="promotions" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="活动名称" min-width="150" />
        <el-table-column prop="type" label="活动类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getPromotionTypeColor(row.type)">
              {{ getPromotionTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="活动描述" min-width="200" />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="endTime" label="结束时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 促销活动编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="promotionFormRef"
        :model="promotionForm"
        :rules="promotionRules"
        label-width="100px"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="promotionForm.name" />
        </el-form-item>
        <el-form-item label="活动类型" prop="type">
          <el-radio-group v-model="promotionForm.type">
            <el-radio :label="1">满减</el-radio>
            <el-radio :label="2">折扣</el-radio>
            <el-radio :label="3">特价</el-radio>
            <el-radio :label="4">套餐</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动描述" prop="description">
          <el-input v-model="promotionForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="promotionForm.startTime" type="datetime" placeholder="选择开始时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="promotionForm.endTime" type="datetime" placeholder="选择结束时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="promotionForm.status">
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
import { promotionApi } from '@/api';
import type { Promotion } from '@/types';

const loading = ref(false);
const promotions = ref<Promotion[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref('添加促销活动');
const promotionFormRef = ref<FormInstance>();

const searchForm = reactive({
  name: '',
  status: undefined as number | undefined,
});

const promotionForm = reactive<Promotion>({
  id: 0,
  name: '',
  type: 1,
  description: '',
  startTime: '',
  endTime: '',
  status: 1,
  createTime: '',
  updateTime: '',
  rules: {}
});

const promotionRules: FormRules = {
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  description: [{ required: true, message: '请输入活动描述', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const getPromotionTypeText = (type: number) => {
  const typeMap: Record<number, string> = {
    1: '满减',
    2: '折扣',
    3: '特价',
    4: '套餐',
  };
  return typeMap[type] || '未知';
};

const getPromotionTypeColor = (type: number) => {
  const colorMap: Record<number, string> = {
    1: 'success',
    2: 'warning',
    3: 'danger',
    4: 'info',
  };
  return colorMap[type] || '';
};

const loadPromotions = async () => {
  loading.value = true;
  try {
    promotions.value = await promotionApi.getList();
    if (searchForm.name) {
      promotions.value = promotions.value.filter(p => p.name.includes(searchForm.name));
    }
    if (searchForm.status !== undefined) {
      promotions.value = promotions.value.filter(p => p.status === searchForm.status);
    }
  } catch (error) {
    ElMessage.error('加载促销活动列表失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  loadPromotions();
};

const handleReset = () => {
  searchForm.name = '';
  searchForm.status = undefined;
  loadPromotions();
};

const handleAdd = () => {
  dialogTitle.value = '添加促销活动';
  Object.assign(promotionForm, {
    id: 0,
    name: '',
    type: 1,
    description: '',
    startTime: '',
    endTime: '',
    status: 1,
    createTime: '',
    updateTime: '',
    rules: {}
  });
  dialogVisible.value = true;
};

const handleEdit = (row: Promotion) => {
  dialogTitle.value = '编辑促销活动';
  Object.assign(promotionForm, row);
  dialogVisible.value = true;
};

const handleDelete = async (row: Promotion) => {
  try {
    if (!row.id) {
      ElMessage.error('促销活动ID不存在，无法删除');
      return;
    }
    await ElMessageBox.confirm('确定要删除这个促销活动吗？', '提示', {
      type: 'warning',
    });
    await promotionApi.delete(row.id);
    ElMessage.success('删除成功');
    loadPromotions();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败');
    }
  }
};

const handleSubmit = async () => {
  if (!promotionFormRef.value) return;
  await promotionFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await promotionApi.save(promotionForm);
        ElMessage.success(dialogTitle.value === '添加促销活动' ? '添加成功' : '更新成功');
        dialogVisible.value = false;
        loadPromotions();
      } catch (error: any) {
        ElMessage.error(error.message || '操作失败');
      }
    }
  });
};

const handleDialogClose = () => {
  promotionFormRef.value?.resetFields();
};

onMounted(() => {
  loadPromotions();
});
</script>

<style scoped>
.promotions-page {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}
</style>