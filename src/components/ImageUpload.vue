<template>
  <div class="image-upload">
    <el-upload
      class="upload-demo"
      action="#"
      :http-request="httpRequest"
      :before-upload="beforeUpload"
      list-type="picture-card"
      :file-list="fileList"
      :on-remove="handleRemove"
      :limit="props.limit"
      :show-file-list="true"
    >
      <el-icon><Plus /></el-icon>
      <template #tip>
        <div v-if="props.showTip" class="el-upload__tip">
          支持 jpg/png/webp 格式，单文件不超过 2MB
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import api from '@/api'
import type { UploadFile, UploadProps } from 'element-plus'

// 定义属性（带类型）
const props = defineProps<{
  modelValue: string | string[] | undefined
  limit?: number
  showTip?: boolean
}>()

// 定义默认值
const limit = props.limit || 1
const showTip = props.showTip !== false

// 定义事件（带类型）
const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | undefined]
}>()

// 状态（带类型）
const fileList = ref<UploadFile[]>([])
const imageUrls = ref<string[]>([])

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    if (typeof newValue === 'string') {
      imageUrls.value = [newValue]
    } else {
      imageUrls.value = newValue
    }
    // 更新文件列表
    fileList.value = imageUrls.value.map(url => ({
      url,
      name: url.split('/').pop() || '',
      status: 'success' as const
    }))
  } else {
    imageUrls.value = []
    fileList.value = []
  }
}, { immediate: true })

// 上传前校验（带类型）
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  if (!file) return false
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isImage) {
    ElMessage.error('仅支持图片格式！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return false
  }
  return true
}

// 自定义上传逻辑（带类型）
const httpRequest: UploadProps['httpRequest'] = async (options) => {
  const { file } = options
  if (!file) return
  
  try {
    // 使用正确的API路径
    const formData = new FormData()
    formData.append('files', file)
    const res = await api.post<string[]>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    // 根据响应结构处理
    if (Array.isArray(res) && res.length > 0) {
      const uploadedUrl = res[0]
      
      if (limit === 1) {
        // 单图上传，直接替换
        imageUrls.value = [uploadedUrl]
        emit('update:modelValue', uploadedUrl)
      } else {
        // 多图上传，添加到数组
        imageUrls.value.push(uploadedUrl)
        emit('update:modelValue', imageUrls.value)
      }
      ElMessage.success('上传成功')
    } else {
      ElMessage.error('上传失败：未返回图片URL')
    }
  } catch (err: any) {
    // 处理文件上传路径不存在的错误
    if (err.message && err.message.includes('系统找不到指定的路径')) {
      ElMessage.error('上传失败：服务器上传目录不存在，请联系管理员')
    } else {
      ElMessage.error(err.message || '上传失败')
    }
    console.error('Upload failed:', err)
  }
}

// 移除图片（带类型）
const handleRemove: UploadProps['onRemove'] = (file) => {
  const fileUrl = (file as any).url || (file.response as { url: string })?.url
  if (fileUrl) {
    imageUrls.value = imageUrls.value.filter(url => url !== fileUrl)
    if (limit === 1) {
      emit('update:modelValue', '')
    } else {
      emit('update:modelValue', imageUrls.value)
    }
  }
}
</script>

<style scoped>
.image-upload {
  padding: 10px 0;
}

.el-upload__tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style>