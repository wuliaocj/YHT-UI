<template>
  <div class="users-page">
    <el-card>
      <template #header>
        <span>用户管理</span>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入昵称或手机号"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="users" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="nickname" label="昵称" width="150" />
        <el-table-column prop="avatarUrl" label="头像" width="100">
          <template #default="{ row }">
            <el-avatar v-if="row.avatarUrl" :src="row.avatarUrl" :size="40" />
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            {{ row.gender === 1 ? '男' : row.gender === 2 ? '女' : '未知' }}
          </template>
        </el-table-column>
        <el-table-column prop="integral" label="积分" width="100" />
        <el-table-column prop="vipLevel" label="会员等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getVipLevelType(row.vipLevel)">
              {{ getVipLevelText(row.vipLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalConsumption" label="累计消费" width="120">
          <template #default="{ row }">¥{{ row.totalConsumption || 0 }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button
              :type="row.status === 1 ? 'danger' : 'success'"
              size="small"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { userApi } from '@/api';
import type { User } from '@/types';

const loading = ref(false);
const users = ref<User[]>([]);

const searchForm = reactive({
  keyword: '',
  status: undefined as number | undefined,
});

const getVipLevelText = (level: number) => {
  const levelMap: Record<number, string> = {
    0: '普通',
    1: '白银',
    2: '黄金',
    3: '钻石',
  };
  return levelMap[level || 0] || '普通';
};

const getVipLevelType = (level: number) => {
  const typeMap: Record<number, string> = {
    0: '',
    1: 'info',
    2: 'warning',
    3: 'success',
  };
  return typeMap[level || 0] || '';
};

const loadUsers = async () => {
  loading.value = true;
  try {
    users.value = await userApi.getList();
    if (searchForm.keyword) {
      users.value = users.value.filter(
        (u) =>
          u.nickname?.includes(searchForm.keyword) ||
          u.phone?.includes(searchForm.keyword)
      );
    }
    if (searchForm.status !== undefined) {
      users.value = users.value.filter((u) => u.status === searchForm.status);
    }
  } catch (error) {
    ElMessage.error('加载用户列表失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  loadUsers();
};

const handleReset = () => {
  searchForm.keyword = '';
  searchForm.status = undefined;
  loadUsers();
};

const handleToggleStatus = async (row: User) => {
  try {
    const newStatus = row.status === 1 ? 0 : 1;
    const statusText = newStatus === 1 ? '启用' : '禁用';
    await ElMessageBox.confirm(`确定要${statusText}该用户吗？`, '提示', {
      type: 'warning',
    });
    await userApi.updateStatus(row.id!, newStatus);
    ElMessage.success('操作成功');
    loadUsers();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败');
    }
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.users-page {
  padding: 0;
}

.search-form {
  margin-bottom: 20px;
}
</style>
