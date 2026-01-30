<template>
  <div class="banners-page fade-in">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>轮播图管理</h1>
      <p class="page-description">管理网站首页轮播图，提升品牌展示效果</p>
    </div>
    
    <!-- 轮播图管理卡片 -->
    <el-card class="management-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">轮播图列表</span>
          <el-button type="primary" @click="handleAdd" class="add-button">
            <el-icon><Plus /></el-icon>
            添加轮播图
          </el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="轮播图标题">
          <el-input v-model="searchForm.title" placeholder="请输入轮播图标题" clearable class="search-input" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable class="search-select">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" class="search-button">查询</el-button>
          <el-button @click="handleReset" class="reset-button">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 轮播图表格 -->
      <el-table :data="banners" style="width: 100%" v-loading="loading" class="banners-table">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="轮播图标题" min-width="180">
          <template #default="{ row }">
            <div class="banner-title">{{ row.title }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="imageUrl" label="图片" width="180">
          <template #default="{ row }">
            <div class="banner-image-container">
              <img v-if="row.imageUrl" :src="row.imageUrl" class="banner-image" />
              <div v-else class="banner-image-placeholder">
                <el-icon><Picture /></el-icon>
                <span>无图片</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="linkType" label="链接类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.linkType === 1 ? 'success' : 'warning'" class="link-type-tag">
              {{ row.linkType === 1 ? '商品链接' : '外部链接' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="linkValue" label="链接地址" min-width="250">
          <template #default="{ row }">
            <div class="link-value">{{ row.linkValue }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="100">
          <template #default="{ row }">
            <div class="sort-order">{{ row.sortOrder }}</div>
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

    <!-- 轮播图编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
      class="banner-dialog"
    >
      <el-form
        ref="bannerFormRef"
        :model="bannerForm"
        :rules="bannerRules"
        label-width="100px"
        class="banner-form"
      >
        <el-form-item label="轮播图标题" prop="title">
          <el-input v-model="bannerForm.title" class="form-input" />
        </el-form-item>
        <el-form-item label="轮播图图片" prop="imageUrl">
          <ImageUpload v-model="bannerForm.imageUrl" :limit="1" />
        </el-form-item>
        <el-form-item label="链接类型" prop="linkType">
          <el-radio-group v-model="bannerForm.linkType" class="radio-group">
            <el-radio :label="1" class="radio-item">商品链接</el-radio>
            <el-radio :label="2" class="radio-item">外部链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="链接地址" prop="linkValue">
          <el-input v-model="bannerForm.linkValue" placeholder="请输入链接地址" class="form-input" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="bannerForm.sortOrder" :min="0" class="form-input-number" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="bannerForm.status" class="radio-group">
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
import { bannerApi } from '@/api';
import type { Banner } from '@/types';
import ImageUpload from '@/components/ImageUpload.vue';

const loading = ref(false);
const banners = ref<Banner[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref('添加轮播图');
const bannerFormRef = ref<FormInstance>();

const searchForm = reactive({
  title: '',
  status: undefined as number | undefined,
});

const bannerForm = reactive<Banner>({
  id: 0,
  title: '',
  imageUrl: '',
  linkType: 1,
  linkValue: '',
  sortOrder: 0,
  status: 1,
  startTime: '',
  endTime: '',
  createTime: ''
});

const bannerRules: FormRules = {
  title: [{ required: true, message: '请输入轮播图标题', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '请上传轮播图图片', trigger: 'blur' }],
  linkType: [{ required: true, message: '请选择链接类型', trigger: 'change' }],
  linkValue: [{ required: true, message: '请输入链接地址', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '请输入排序', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const loadBanners = async () => {
  loading.value = true;
  try {
    banners.value = await bannerApi.getList();
    if (searchForm.title) {
      banners.value = banners.value.filter(b => b.title.includes(searchForm.title));
    }
    if (searchForm.status !== undefined) {
      banners.value = banners.value.filter(b => b.status === searchForm.status);
    }
  } catch (error) {
    ElMessage.error('加载轮播图列表失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  loadBanners();
};

const handleReset = () => {
  searchForm.title = '';
  searchForm.status = undefined;
  loadBanners();
};

const handleAdd = () => {
  dialogTitle.value = '添加轮播图';
  Object.assign(bannerForm, {
    id: 0,
    title: '',
    imageUrl: '',
    linkType: 1,
    linkValue: '',
    sortOrder: 0,
    status: 1,
    startTime: '',
    endTime: '',
    createTime: ''
  });
  dialogVisible.value = true;
};

const handleEdit = (row: Banner) => {
  dialogTitle.value = '编辑轮播图';
  Object.assign(bannerForm, row);
  dialogVisible.value = true;
};

const handleDelete = async (row: Banner) => {
  try {
    if (!row.id) {
      ElMessage.error('轮播图ID不存在，无法删除');
      return;
    }
    await ElMessageBox.confirm('确定要删除这个轮播图吗？', '提示', {
      type: 'warning',
    });
    await bannerApi.delete(row.id);
    ElMessage.success('删除成功');
    loadBanners();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败');
    }
  }
};

const handleSubmit = async () => {
  if (!bannerFormRef.value) return;
  await bannerFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await bannerApi.save(bannerForm);
        ElMessage.success(dialogTitle.value === '添加轮播图' ? '添加成功' : '更新成功');
        dialogVisible.value = false;
        loadBanners();
      } catch (error: any) {
        ElMessage.error(error.message || '操作失败');
      }
    }
  });
};

const handleDialogClose = () => {
  bannerFormRef.value?.resetFields();
};

onMounted(() => {
  loadBanners();
});
</script>

<style scoped>
/* 页面容器 */
.banners-page {
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

/* 搜索表单 */
.search-form {
  margin-bottom: var(--space-lg);
  padding: var(--space-lg);
  background-color: var(--color-background-soft);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.search-form:hover {
  background-color: var(--color-background-mute);
}

/* 搜索输入框 */
.search-input {
  width: 240px;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.search-input:focus {
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}

/* 搜索选择框 */
.search-select {
  width: 120px;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.search-select:focus {
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}

/* 搜索按钮 */
.search-button {
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.search-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 重置按钮 */
.reset-button {
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.reset-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

/* 轮播图表格 */
.banners-table {
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-fast);
}

.banners-table:hover {
  box-shadow: var(--shadow-sm);
}

/* 轮播图标题 */
.banner-title {
  font-weight: 500;
  color: var(--color-text);
  transition: all var(--transition-fast);
}

.banner-title:hover {
  color: var(--color-primary);
}

/* 轮播图图片容器 */
.banner-image-container {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--color-background-soft);
  transition: all var(--transition-fast);
}

.banner-image-container:hover {
  background-color: var(--color-background-mute);
  transform: scale(1.02);
}

/* 轮播图图片 */
.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all var(--transition-fast);
}

/* 轮播图图片占位符 */
.banner-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  width: 100%;
  height: 100%;
}

.banner-image-placeholder el-icon {
  font-size: 24px;
  margin-bottom: var(--space-xs);
}

/* 链接类型标签 */
.link-type-tag {
  border-radius: var(--radius-full);
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  transition: all var(--transition-fast);
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

/* 轮播图对话框 */
.banner-dialog {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* 轮播图表单 */
.banner-form {
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

/* 链接地址 */
.link-value {
  font-size: 12px;
  color: var(--color-text-secondary);
  word-break: break-all;
  transition: all var(--transition-fast);
}

.link-value:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

/* 排序 */
.sort-order {
  font-weight: 500;
  color: var(--color-text);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  /* 调整表格列宽 */
  .banners-table .el-table-column {
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
  
  /* 搜索表单 */
  .search-form {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }
  
  /* 搜索输入框 */
  .search-input {
    width: 100%;
  }
  
  /* 搜索选择框 */
  .search-select {
    width: 100%;
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