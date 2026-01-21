<template>
  <div class="categories-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>分类管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加分类
          </el-button>
        </div>
      </template>

      <el-table :data="categories" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" min-width="150" />
        <el-table-column prop="icon" label="图标" width="150">
          <template #default="{ row }">
            <img v-if="row.icon" :src="row.icon" style="width: 40px; height: 40px;" />
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
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="categoryRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" />
        </el-form-item>
        <el-form-item label="图标">
          <ImageUpload v-model="categoryForm.icon" :limit="1" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="categoryForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="categoryForm.sortOrder" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="categoryForm.status">
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
import { categoryApi } from '@/api';
import type { Category } from '@/types';
import ImageUpload from '@/components/ImageUpload.vue';

const loading = ref(false);
const categories = ref<Category[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref('添加分类');
const categoryFormRef = ref<FormInstance>();

const categoryForm = reactive<Category>({
  name: '',
  icon: '',
  description: '',
  sortOrder: 0,
  status: 1,
});

const categoryRules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const loadCategories = async () => {
  loading.value = true;
  try {
    categories.value = await categoryApi.getAll();
  } catch (error) {
    ElMessage.error('加载分类列表失败');
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  dialogTitle.value = '添加分类';
  Object.assign(categoryForm, {
    name: '',
    icon: '',
    description: '',
    sortOrder: 0,
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
    await ElMessageBox.confirm('确定要删除这个分类吗？', '提示', {
      type: 'warning',
    });
    await categoryApi.delete(row.id!);
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
.categories-page {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
