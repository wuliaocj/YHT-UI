<template>
  <div class="image-upload">
    <div class="upload-area">
      <el-upload
        :action="uploadUrl"
        :headers="uploadHeaders"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload"
        :file-list="fileList"
        list-type="picture-card"
        :limit="limit"
        :on-exceed="handleExceed"
        :on-remove="handleRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
    </div>
    <div class="upload-tip" v-if="showTip">
      <el-text type="info" size="small">
        支持 jpg/png/webp 格式，单个文件不超过 2MB
      </el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import type { UploadProps, UploadUserFile } from 'element-plus';

interface Props {
  modelValue?: string | string[];
  limit?: number;
  showTip?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string | string[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  limit: 1,
  showTip: true,
});

const emit = defineEmits<Emits>();

const uploadUrl = 'http://localhost:8080/api/upload/image';
const uploadHeaders = computed(() => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
});

const fileList = ref<UploadUserFile[]>([]);

// 初始化文件列表
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      fileList.value = [];
      return;
    }

    const urls = Array.isArray(newVal) ? newVal : [newVal];
    fileList.value = urls
      .filter(url => url)
      .map((url, index) => ({
        name: `image-${index}`,
        url: url,
      }));
  },
  { immediate: true }
);

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const isValidType = validTypes.includes(file.type);
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isValidType) {
    ElMessage.error('只能上传 jpg/png/webp 格式的图片！');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！');
    return false;
  }
  return true;
};

const handleSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.code === 200 && response.data) {
    const urls = response.data;
    if (props.limit === 1) {
      emit('update:modelValue', urls[0]);
    } else {
      const currentUrls = Array.isArray(props.modelValue) ? props.modelValue : [];
      emit('update:modelValue', [...currentUrls, ...urls]);
    }
    ElMessage.success('上传成功');
  } else {
    ElMessage.error(response.msg || '上传失败');
  }
};

const handleError: UploadProps['onError'] = () => {
  ElMessage.error('上传失败，请重试');
};

const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning(`最多只能上传 ${props.limit} 张图片`);
};

const handleRemove: UploadProps['onRemove'] = (file) => {
  if (props.limit === 1) {
    emit('update:modelValue', '');
  } else {
    const urls = Array.isArray(props.modelValue) ? props.modelValue : [];
    const newUrls = urls.filter(url => url !== file.url);
    emit('update:modelValue', newUrls);
  }
};
</script>

<style scoped>
.image-upload {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-area {
  display: inline-block;
}

.upload-tip {
  color: #909399;
  font-size: 12px;
}
</style>
