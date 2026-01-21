<template>
  <div class="banners-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>轮播图管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加轮播图
          </el-button>
        </div>
      </template>

      <el-table :data="banners" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="150" />
        <el-table-column prop="imageUrl" label="图片" width="150">
          <template #default="{ row }">
            <img v-if="row.imageUrl" :src="row.imageUrl" style="width: 100px; height: 60px; object-fit: cover;" />
          </template>
        </el-table-column>
        <el-table-column prop="linkType" label="链接类型" width="120">
          <template #default="{ row }">
            {{ row.linkType === 1 ? '商品' : row.linkType === 2 ? '分类' : '无链接' }}
          </template>
        </el-table-column>
        <el-table-column prop="linkValue" label="链接值" width="150" />
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

    <!-- 轮播图编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form
        ref="bannerFormRef"
        :model="bannerForm"
        :rules="bannerRules"
        label-width="120px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="bannerForm.title" />
        </el-form-item>
        <el-form-item label="图片" prop="imageUrl">
          <ImageUpload v-model="bannerForm.imageUrl" :limit="1" />
        </el-form-item>
        <el-form-item label="链接类型">
          <el-radio-group v-model="bannerForm.linkType">
            <el-radio :label="0">无链接</el-radio>
            <el-radio :label="1">商品</el-radio>
            <el-radio :label="2">分类</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="bannerForm.linkType !== 0" label="链接值">
          <el-input v-model="bannerForm.linkValue" placeholder="请输入商品ID或分类ID" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="bannerForm.sortOrder" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="bannerForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="bannerForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="bannerForm.endTime"
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
import { bannerApi } from '@/api';
import type { Banner } from '@/types';
import ImageUpload from '@/components/ImageUpload.vue';

const loading = ref(false);
const banners = ref<Banner[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref('添加轮播图');
const bannerFormRef = ref<FormInstance>();

const bannerForm = reactive<Banner>({
  title: '',
  imageUrl: '',
  linkType: 0,
  linkValue: '',
  sortOrder: 0,
  status: 1,
  startTime: '',
  endTime: '',
});

const bannerRules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '请输入图片URL', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const loadBanners = async () => {
  loading.value = true;
  try {
    banners.value = await bannerApi.getList();
  } catch (error) {
    ElMessage.error('加载轮播图列表失败');
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  dialogTitle.value = '添加轮播图';
  Object.assign(bannerForm, {
    title: '',
    imageUrl: '',
    linkType: 0,
    linkValue: '',
    sortOrder: 0,
    status: 1,
    startTime: '',
    endTime: '',
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
    await ElMessageBox.confirm('确定要删除这个轮播图吗？', '提示', {
      type: 'warning',
    });
    await bannerApi.delete(row.id!);
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
.banners-page {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
