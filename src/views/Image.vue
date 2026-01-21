<template>
  <div class="upload-container">
    <!-- 1. 上传按钮 + 文件选择器 -->
    <label class="upload-btn">
      选择图片
      <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          @change="handleFileChange"
          hidden
      />
    </label>

    <!-- 2. 图片预览区域 -->
    <div class="preview-list" v-if="previewUrls.length">
      <div class="preview-item" v-for="(url, index) in previewUrls" :key="index">
        <img :src="url" alt="预览图" class="preview-img" />
        <button class="delete-btn" @click="handleDeletePreview(index)">×</button>
      </div>
    </div>

    <!-- 3. 上传状态提示 -->
    <div class="status-text" v-if="uploadStatus">
      {{ uploadStatus }}
    </div>

    <!-- 4. 确认上传按钮 -->
    <button
        class="submit-btn"
        @click="handleUpload"
        :disabled="!selectedFiles.length || isUploading"
    >
      {{ isUploading ? '上传中...' : '确认上传' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

// 选中的文件列表
const selectedFiles = ref<File[]>([]);
// 预览图URL列表
const previewUrls = ref<string[]>([]);
// 上传状态（加载/成功/失败）
const uploadStatus = ref<string>('');
// 是否正在上传
const isUploading = ref<boolean>(false);

/**
 * 1. 处理文件选择事件
 */
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (!files || files.length === 0) return;

  // 清空之前的选择（如需保留可注释）
  selectedFiles.value = [];
  previewUrls.value = [];
  uploadStatus.value = '';

  // 遍历选中的文件
  Array.from(files).forEach((file) => {
    // 格式校验
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      uploadStatus.value = `文件${file.name}格式错误，仅支持jpg/png/webp！`;
      return;
    }

    // 大小校验（2MB）
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      uploadStatus.value = `文件${file.name}超过2MB，无法上传！`;
      return;
    }

    // 合法文件：存入列表 + 生成预览URL
    selectedFiles.value.push(file);
    const reader = new FileReader();
    reader.onload = (r) => {
      previewUrls.value.push(r.target?.result as string);
    };
    reader.readAsDataURL(file);
  });

  // 清空input值（避免重复选择同一文件不触发change）
  target.value = '';
};

/**
 * 2. 删除预览图
 */
const handleDeletePreview = (index: number) => {
  selectedFiles.value.splice(index, 1);
  previewUrls.value.splice(index, 1);
};

/**
 * 3. 上传文件到后端
 */
const handleUpload = async () => {
  if (selectedFiles.value.length === 0) return;

  isUploading.value = true;
  uploadStatus.value = '';

  try {
    // 构建FormData（后端需接收multipart/form-data格式）
    const formData = new FormData();
    selectedFiles.value.forEach((file, index) => {
      formData.append('files', file, file.name); // 'files'为后端接收的参数名
    });

    // 发送上传请求（替换为你的后端接口）
    const response = await // 修正后（直接指向后端8080端口）：
        axios.post('http://localhost:8080/api/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },

      // 监听上传进度（可选）
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded / (progressEvent.total || 1)) * 100);
        uploadStatus.value = `上传进度：${progress}%`;
      },
    });

    // 上传成功
    uploadStatus.value = '上传成功！';
    console.log('上传结果：', response.data);

    // 清空状态（可选）
    setTimeout(() => {
      selectedFiles.value = [];
      previewUrls.value = [];
      uploadStatus.value = '';
    }, 2000);
  } catch (error) {
    // 上传失败
    uploadStatus.value = '上传失败，请重试！';
    console.error('上传错误：', error);
  } finally {
    isUploading.value = false;
  }
};
</script>

<style scoped>
.upload-container {
  width: 400px;
  margin: 20px;
}

.upload-btn {
  display: inline-block;
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.preview-list {
  display: flex;
  gap: 10px;
  margin: 10px 0;
  flex-wrap: wrap;
}

.preview-item {
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid #eee;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border: none;
  background: #ff4949;
  color: white;
  border-radius: 50%;
  cursor: pointer;
}

.status-text {
  margin: 10px 0;
  color: #666;
}

.submit-btn {
  padding: 8px 16px;
  background: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
