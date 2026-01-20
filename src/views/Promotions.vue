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

      <el-table :data="promotions" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="活动名称" min-width="150" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            {{ getPromotionTypeText(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="sortOrder" label="排序" width="100" />
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

    <!-- 促销活动编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form
        ref="promotionFormRef"
        :model="promotionForm"
        :rules="promotionRules"
        label-width="120px"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="promotionForm.name" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="promotionForm.type" placeholder="请选择类型">
            <el-option label="满减活动" :value="1" />
            <el-option label="折扣活动" :value="2" />
            <el-option label="买赠活动" :value="3" />
            <el-option label="限时秒杀" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="promotionForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="规则配置">
          <el-input
            v-model="promotionForm.ruleConfig"
            type="textarea"
            :rows="4"
            placeholder="请输入JSON格式的规则配置"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="promotionForm.sortOrder" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="promotionForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="promotionForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="promotionForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%"
          />
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

const promotionForm = reactive<Promotion>({
  name: '',
  type: 1,
  description: '',
  ruleConfig: '',
  sortOrder: 0,
  status: 1,
  startTime: '',
  endTime: '',
});

const promotionRules: FormRules = {
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const getPromotionTypeText = (type: number) => {
  const typeMap: Record<number, string> = {
    1: '满减活动',
    2: '折扣活动',
    3: '买赠活动',
    4: '限时秒杀',
  };
  return typeMap[type] || '未知';
};

const loadPromotions = async () => {
  loading.value = true;
  try {
    promotions.value = await promotionApi.getList();
  } catch (error) {
    ElMessage.error('加载促销活动列表失败');
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  dialogTitle.value = '添加促销活动';
  Object.assign(promotionForm, {
    name: '',
    type: 1,
    description: '',
    ruleConfig: '',
    sortOrder: 0,
    status: 1,
    startTime: '',
    endTime: '',
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
    await ElMessageBox.confirm('确定要删除这个促销活动吗？', '提示', {
      type: 'warning',
    });
    await promotionApi.delete(row.id!);
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
</style>
