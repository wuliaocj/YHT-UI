<template>
  <div class="categories-page fade-in">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>分类管理</h1>
      <p class="page-description">管理商品分类，优化商品展示结构</p>
    </div>
    
    <!-- 分类管理卡片 -->
    <el-card class="management-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">分类列表</span>
          <el-button type="primary" @click="handleAdd" class="add-button">
            <el-icon><Plus /></el-icon>
            添加分类
          </el-button>
        </div>
      </template>

      <!-- 分类表格 -->
      <el-table :data="categories" style="width: 100%" v-loading="loading" class="categories-table">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" min-width="150">
          <template #default="{ row }">
            <div class="category-name">{{ row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" width="100">
          <template #default="{ row }">
            <div class="category-icon-container">
              <img v-if="row.icon" :src="row.icon" class="category-icon" />
              <div v-else class="category-icon-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100">
          <template #default="{ row }">
            <div class="sort-order">{{ row.sort }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" class="status-tag">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            <div class="create-time">{{ row.createTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="handleEdit(row)" class="edit-button">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)" class="delete-button">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分类编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
      class="category-dialog"
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="categoryRules"
        label-width="100px"
        class="category-form"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" class="form-input" />
        </el-form-item>
        <el-form-item label="图标">
          <ImageUpload v-model="categoryForm.icon" :limit="1" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="categoryForm.sort" :min="0" class="form-input-number" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="categoryForm.status" class="radio-group">
            <el-radio :label="1" class="radio-item">启用</el-radio>
            <el-radio :label="0" class="radio-item">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" class="dialog-button cancel-button">取消</el-button>
        <el-button type="primary" @click="handleSubmit" class="dialog-button confirm-button">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { Plus, Picture } from '@element-plus/icons-vue';
import { categoryApi } from '@/api';
import type { Category } from '@/types/product';
import ImageUpload from '@/components/ImageUpload.vue';

const loading = ref(false);
const categories = ref<Category[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref('添加分类');
const categoryFormRef = ref<FormInstance>();

const categoryForm = reactive<Category>({
  id: 0,
  name: '',
  icon: '',
  sort: 0,
  status: 1,
});

const categoryRules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const loadCategories = async () => {
  loading.value = true;
  try {
    const response = await categoryApi.getAll();
    categories.value = response || [];
  } catch (error) {
    ElMessage.error('加载分类列表失败');
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  dialogTitle.value = '添加分类';
  Object.assign(categoryForm, {
    id: 0,
    name: '',
    icon: '',
    sort: 0,
    status: 1,
  });
  dialogVisible.value = true;
};

const handleEdit = (row: Category) => {
  dialogTitle.value = '编辑分类';
  Object.assign(categoryForm, row);
  dialogVisible.value = true;
};

const handleDelete = async (row: Category) => {
  try {
    if (!row.id) {
      ElMessage.error('分类ID不存在，无法删除');
      return;
    }
    await ElMessageBox.confirm('确定要删除这个分类吗？', '提示', {
      type: 'warning',
    });
    await categoryApi.delete(row.id);
    ElMessage.success('删除成功');
    loadCategories();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败');
    }
  }
};

const handleSubmit = async () => {
  if (!categoryFormRef.value) return;
  await categoryFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await categoryApi.save(categoryForm);
        ElMessage.success(dialogTitle.value === '添加分类' ? '添加成功' : '更新成功');
        dialogVisible.value = false;
        loadCategories();
      } catch (error: any) {
        ElMessage.error(error.message || '操作失败');
      }
    }
  });
};

const handleDialogClose = () => {
  categoryFormRef.value?.resetFields();
};

onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
/* 页面容器 */
.categories-page {
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

/* 管理卡片 */
.management-card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  overflow: hidden;
  border-top: 4px solid var(--color-primary);
}

.management-card:hover {
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

/* 添加按钮 */
.add-button {
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.add-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 分类表格 */
.categories-table {
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-fast);
}

.categories-table:hover {
  box-shadow: var(--shadow-sm);
}

/* 分类名称 */
.category-name {
  font-weight: 500;
  color: var(--color-text);
  transition: all var(--transition-fast);
}

.category-name:hover {
  color: var(--color-primary);
}

/* 分类图标容器 */
.category-icon-container {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--color-background-soft);
  transition: all var(--transition-fast);
}

.category-icon-container:hover {
  background-color: var(--color-background-mute);
  transform: scale(1.05);
}

/* 分类图标 */
.category-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
  transition: all var(--transition-fast);
}

/* 分类图标占位符 */
.category-icon-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  width: 100%;
  height: 100%;
  font-size: 20px;
}

/* 分类描述 */
.category-description {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.4;
  transition: all var(--transition-fast);
}

.category-description:hover {
  color: var(--color-text);
}

/* 排序 */
.sort-order {
  font-weight: 500;
  color: var(--color-text);
}

/* 状态标签 */
.status-tag {
  border-radius: var(--radius-full);
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

/* 创建时间 */
.create-time {
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* 操作按钮容器 */
.action-buttons {
  display: flex;
  gap: var(--space-sm);
  transition: all var(--transition-fast);
}

/* 编辑按钮 */
.edit-button {
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.edit-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

/* 删除按钮 */
.delete-button {
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.delete-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

/* 分类对话框 */
.category-dialog {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* 分类表单 */
.category-form {
  padding: var(--space-lg) 0;
}

/* 表单输入框 */
.form-input {
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.form-input:focus {
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}

/* 表单文本域 */
.form-textarea {
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.form-textarea:focus {
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}

/* 表单输入数字 */
.form-input-number {
  width: 100%;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.form-input-number:focus {
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: var(--space-lg);
  transition: all var(--transition-fast);
}

/* 单选按钮项 */
.radio-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.radio-item:hover {
  color: var(--color-primary);
}

/* 对话框按钮 */
.dialog-button {
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.dialog-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

/* 取消按钮 */
.cancel-button {
  margin-right: var(--space-sm);
}

/* 确认按钮 */
.confirm-button {
  margin-left: var(--space-sm);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  /* 调整表格列宽 */
  .categories-table .el-table-column {
    min-width: 120px;
  }
}

@media (max-width: 768px) {
  /* 页面标题 */
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  /* 卡片头部 */
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }
  
  /* 单选按钮组 */
  .radio-group {
    flex-direction: column;
    gap: var(--space-md);
  }
  
  /* 操作按钮容器 */
  .action-buttons {
    flex-direction: column;
    gap: var(--space-xs);
  }
  
  /* 分类图标容器 */
  .category-icon-container {
    width: 40px;
    height: 40px;
  }
  
  /* 分类图标 */
  .category-icon {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 480px) {
  /* 管理卡片 */
  .management-card {
    border-radius: var(--radius-md);
  }
  
  /* 表单输入框 */
  .form-input {
    border-radius: var(--radius-sm);
  }
  
  /* 表单文本域 */
  .form-textarea {
    border-radius: var(--radius-sm);
  }
  
  /* 对话框按钮 */
  .dialog-button {
    border-radius: var(--radius-sm);
  }
}

/* 动画效果 */
.fade-in {
  animation: fadeIn var(--transition-slow) ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
