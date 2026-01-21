<template>
  <div class="products-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>商品管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加商品
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="分类">
          <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable>
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="products" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商品名称" min-width="150" />
        <el-table-column prop="categoryId" label="分类ID" width="100" />
        <el-table-column prop="basePrice" label="价格" width="100">
          <template #default="{ row }">¥{{ row.basePrice }}</template>
        </el-table-column>
        <el-table-column prop="inventory" label="库存" width="100" />
        <el-table-column prop="salesCount" label="销量" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '上架' : '下架' }}
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

    <!-- 商品编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      @close="handleDialogClose"
    >
      <el-form
        ref="productFormRef"
        :model="productForm"
        :rules="productRules"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productForm.name" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="productForm.categoryId" placeholder="请选择分类">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id!"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="基础价格" prop="basePrice">
          <el-input-number v-model="productForm.basePrice" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="原价">
          <el-input-number v-model="productForm.originPrice" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="库存" prop="inventory">
          <el-input-number v-model="productForm.inventory" :min="0" />
        </el-form-item>
        <el-form-item label="主图" prop="mainImage">
          <ImageUpload v-model="productForm.mainImage" :limit="1" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="productForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="productForm.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否热销">
          <el-switch v-model="productForm.isHot" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否新品">
          <el-switch v-model="productForm.isNew" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否推荐">
          <el-switch v-model="productForm.isRecommend" :active-value="1" :inactive-value="0" />
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
import { productApi, categoryApi } from '@/api';
import type { Product, Category } from '@/types';
import ImageUpload from '@/components/ImageUpload.vue';

const loading = ref(false);
const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref('添加商品');
const productFormRef = ref<FormInstance>();

const searchForm = reactive({
  categoryId: undefined as number | undefined,
  keyword: '',
});

const productForm = reactive<Product>({
  categoryId: 0,
  name: '',
  basePrice: 0,
  originPrice: 0,
  inventory: 0,
  mainImage: '',
  description: '',
  status: 1,
  isHot: 0,
  isNew: 0,
  isRecommend: 0,
});

const productRules: FormRules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  basePrice: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  inventory: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  mainImage: [{ required: true, message: '请输入主图URL', trigger: 'blur' }],
};

const loadCategories = async () => {
  try {
    categories.value = await categoryApi.getAll();
  } catch (error) {
    console.error('加载分类失败:', error);
  }
};

const loadProducts = async () => {
  loading.value = true;
  try {
    // 使用后端管理接口获取所有商品
    products.value = await productApi.getAllProducts();

    // 前端筛选
    if (searchForm.categoryId) {
      products.value = products.value.filter(p => p.categoryId === searchForm.categoryId);
    }
    if (searchForm.keyword) {
      products.value = products.value.filter(p =>
        p.name.includes(searchForm.keyword)
      );
    }
  } catch (error) {
    ElMessage.error('加载商品列表失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  loadProducts();
};

const handleReset = () => {
  searchForm.categoryId = undefined;
  searchForm.keyword = '';
  loadProducts();
};

const handleAdd = () => {
  dialogTitle.value = '添加商品';
  Object.assign(productForm, {
    categoryId: 0,
    name: '',
    basePrice: 0,
    originPrice: 0,
    inventory: 0,
    mainImage: '',
    description: '',
    status: 1,
    isHot: 0,
    isNew: 0,
    isRecommend: 0,
    cupTypeList:[
      {
        "specName": "大杯",
        "priceAdd": 2.00
      },
      {
        "specName": "中杯",
        "priceAdd": 0.00
      },
      {
        "specName": "小杯",
        "priceAdd": -1.00
      }
    ],
    toppingList:[
      {
        "specName": "珍珠",
        "priceAdd": 1.00
      },
      {
        "specName": "椰果",
        "priceAdd": 1.00
      },
      {
        "specName": "奶盖",
        "priceAdd": 3.00
      }
    ]
  });
  dialogVisible.value = true;
};

const handleEdit = async (row: Product) => {
  dialogTitle.value = '编辑商品';
  try {
    // 获取完整的商品详情（包含规格信息）
    const productDetail = await productApi.getProductDetail(row.id!);
    Object.assign(productForm, productDetail);
    dialogVisible.value = true;
  } catch (error: any) {
    ElMessage.error(error.message || '获取商品详情失败');
  }
};

const handleDelete = async (row: Product) => {
  try {
    await ElMessageBox.confirm('确定要删除这个商品吗？', '提示', {
      type: 'warning',
    });
    await productApi.deleteProduct(row.id!);
    ElMessage.success('删除成功');
    loadProducts();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败');
    }
  }
};

const handleSubmit = async () => {
  if (!productFormRef.value) return;
  await productFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogTitle.value === '添加商品') {
          await productApi.addProduct(productForm);
        } else {
          await productApi.updateProduct(productForm);
        }
        ElMessage.success(dialogTitle.value === '添加商品' ? '添加成功' : '更新成功');
        dialogVisible.value = false;
        loadProducts();
      } catch (error: any) {
        ElMessage.error(error.message || '操作失败');
      }
    }
  });
};

const handleDialogClose = () => {
  productFormRef.value?.resetFields();
};

onMounted(() => {
  loadCategories();
  loadProducts();
});
</script>

<style scoped>
.products-page {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}
</style>
