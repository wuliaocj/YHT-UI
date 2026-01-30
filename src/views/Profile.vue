<template>

  <div class="profile-page fade-in">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>个人资料</h1>
      <p class="page-description">管理您的个人信息和账户设置</p>
    </div>
    
    <!-- 个人资料卡片 -->
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-button type="primary" @click="handleSubmit" class="save-button">
            <el-icon><Check /></el-icon>
            保存修改
          </el-button>
        </div>
      </template>
      
      <el-form ref="profileFormRef" :model="profileForm" :rules="profileRules" label-width="120px" class="profile-form">
        <!-- 头像上传 -->
        <el-form-item label="头像" prop="avatarUrl">
          <div class="avatar-upload">
            <ImageUpload v-model="profileForm.avatarUrl" :limit="1" />
          </div>
        </el-form-item>
        
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="profileForm.username" class="form-input" />
        </el-form-item>
        
        <!-- 昵称 -->
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="profileForm.nickname" class="form-input" />
        </el-form-item>
        
        <!-- 手机号 -->
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="profileForm.phone" class="form-input" />
        </el-form-item>
        
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="profileForm.email" class="form-input" />
        </el-form-item>
        
        <!-- 所属角色 -->
        <el-form-item label="角色" prop="role">
          <el-select v-model="profileForm.role" class="form-select" disabled>
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 账户设置卡片 -->
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>账户设置</span>
        </div>
      </template>
      
      <el-form ref="settingsFormRef" :model="settingsForm" :rules="settingsRules" label-width="120px" class="settings-form">
        <!-- 旧密码 -->
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="settingsForm.oldPassword" type="password" class="form-input">
            <template #prefix>
              <el-icon class="el-input__icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <!-- 新密码 -->
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="settingsForm.newPassword" type="password" class="form-input">
            <template #prefix>
              <el-icon class="el-input__icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <!-- 确认新密码 -->
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="settingsForm.confirmPassword" type="password" class="form-input">
            <template #prefix>
              <el-icon class="el-input__icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <!-- 保存密码修改 -->
        <el-form-item>
          <el-button type="primary" @click="handlePasswordSubmit" class="password-save-button">
            <el-icon><Check /></el-icon>
            修改密码
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Check, Lock } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import { adminApi } from '@/api';
import ImageUpload from '@/components/ImageUpload.vue';

const userStore = useUserStore();
const profileFormRef = ref<FormInstance>();
const settingsFormRef = ref<FormInstance>();

// 个人资料表单
const profileForm = reactive({
  username: userStore.userInfo.username || '',
  nickname: userStore.userInfo.nickname || '',
  avatarUrl: userStore.userInfo.avatar || '',
  phone: '',
  email: '',
  role: userStore.userInfo.role || 'user'
});

// 账户设置表单
const settingsForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 表单验证规则
const profileRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3-20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2-20 个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
});

const settingsRules = reactive<FormRules>({
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码长度至少 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== settingsForm.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});

// 保存个人资料修改
const handleSubmit = async () => {
  if (!profileFormRef.value) return;
  await profileFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 调用 API 更新个人资料
        const updateData = {
          username: profileForm.username,
          nickname: profileForm.nickname,
          avatar: profileForm.avatarUrl,
          phone: profileForm.phone,
          email: profileForm.email
        };
        await adminApi.updateProfile(updateData);
        
        // 更新本地存储的用户信息
        userStore.setUserInfo({
          ...userStore.userInfo,
          ...updateData
        });
        ElMessage.success('个人资料更新成功');
      } catch (error: any) {
        ElMessage.error('更新失败: ' + (error.message || '未知错误'));
      }
    }
  });
};

// 保存密码修改
const handlePasswordSubmit = async () => {
  if (!settingsFormRef.value) return;
  await settingsFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 调用 API 修改密码
        await adminApi.changePassword({
          oldPassword: settingsForm.oldPassword,
          newPassword: settingsForm.newPassword
        });
        ElMessage.success('密码修改成功');
        // 重置表单
        settingsForm.oldPassword = '';
        settingsForm.newPassword = '';
        settingsForm.confirmPassword = '';
      } catch (error: any) {
        ElMessage.error('密码修改失败: ' + (error.message || '未知错误'));
      }
    }
  });
};

// 页面加载时初始化数据
onMounted(() => {
  // 从用户存储中加载数据
  if (userStore.userInfo) {
    profileForm.username = userStore.userInfo.username || '';
    profileForm.nickname = userStore.userInfo.nickname || '';
    profileForm.avatarUrl = userStore.userInfo.avatar || '';
    profileForm.phone = userStore.userInfo.phone || '';
    profileForm.email = userStore.userInfo.email || '';
    profileForm.role = userStore.userInfo.role || 'user';
  }
});
</script>

<style scoped>
/* 页面容器 */
.profile-page {
  padding: var(--space-xl);
  min-height: 100vh;
  background-color: var(--color-background-light);
}

/* 淡入动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal), transform var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 页面标题 */
.page-header {
  margin-bottom: var(--space-xl);
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: var(--space-xs);
}

.page-description {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin: 0;
}

/* 卡片样式 */
.profile-card,
.settings-card {
  margin-bottom: var(--space-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.profile-card:hover,
.settings-card:hover {
  box-shadow: var(--shadow-md);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 保存按钮 */
.save-button,
.password-save-button {
  font-size: 14px;
  padding: var(--space-sm) var(--space-lg);
}

/* 个人资料表单 */
.profile-form {
  padding: var(--space-lg);
}

/* 设置表单 */
.settings-form {
  padding: var(--space-lg);
}

/* 表单输入框 */
.form-input {
  width: 100%;
  max-width: 400px;
}

/* 表单选择器 */
.form-select {
  width: 100%;
  max-width: 400px;
}

/* 头像上传 */
.avatar-upload {
  max-width: 400px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .profile-page {
    padding: var(--space-lg);
  }
  
  .form-input,
  .form-select {
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: var(--space-md);
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .form-input,
  .form-select {
    max-width: 100%;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }
  
  .save-button,
  .password-save-button {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .profile-page {
    padding: var(--space-sm);
  }
  
  .page-header h1 {
    font-size: 1.25rem;
  }
  
  .profile-form,
  .settings-form {
    padding: var(--space-md);
  }
}
</style>