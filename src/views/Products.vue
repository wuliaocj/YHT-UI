<template>
  <div class="products-page fade-in">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>商品管理</h1>
      <p class="page-description">管理您的商品信息，包括添加、编辑、删除商品</p>
    </div>
    
    <!-- 搜索卡片 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="分类">
          <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable class="search-select">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入商品名称" clearable class="search-input">
            <template #prefix>
              <el-icon class="el-input__icon"><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" class="search-button">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset" class="reset-button">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd" class="add-button">
        <el-icon><Plus /></el-icon>
        添加商品
      </el-button>
    </div>

    <!-- 商品表格卡片 -->
    <el-card class="table-card">
      <el-table 
        :data="products" 
        style="width: 100%" 
        v-loading="loading"
        class="product-table"
        stripe
        highlight-current-row
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商品名称" min-width="150">
          <template #default="{ row }">
            <div class="product-info">
              <el-avatar :size="40" :src="row.mainImage || ''" class="product-avatar">
                {{ getProductInitial(row.name) }}
              </el-avatar>
              <span class="product-name">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryId" label="分类ID" width="100" />
        <el-table-column prop="basePrice" label="价格" width="100">
          <template #default="{ row }">
            <div class="price-info">
              <span class="price">¥{{ row.basePrice }}</span>
              <span v-if="row.originalPrice && row.originalPrice > row.basePrice" class="original-price">¥{{ row.originalPrice }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="inventory" label="库存" width="100" />
        <el-table-column prop="salesCount" label="销量" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" class="status-tag">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="handleEdit(row)" class="edit-button">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)" class="delete-button">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
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
      class="product-dialog"
    >
      <el-form
        ref="productFormRef"
        :model="productForm"
        :rules="productRules"
        label-width="100px"
        class="product-form"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productForm.name" class="form-input" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="productForm.categoryId" placeholder="请选择分类" class="form-select">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id!"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="基础价格" prop="basePrice">
          <el-input-number v-model="productForm.basePrice" :min="0" :precision="2" class="form-input-number" />
        </el-form-item>
        <el-form-item label="原价">
          <el-input-number v-model="productForm.originalPrice" :min="0" :precision="2" class="form-input-number" />
        </el-form-item>
        <el-form-item label="商品详情">
          <el-input v-model="productForm.detail" type="textarea" :rows="4" class="form-textarea" />
        </el-form-item>
        <el-form-item label="库存" prop="inventory">
          <el-input-number v-model="productForm.inventory" :min="0" class="form-input-number" />
        </el-form-item>
        <el-form-item label="主图" prop="mainImage">
          <ImageUpload v-model="productForm.mainImage" :limit="1" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="productForm.description" type="textarea" :rows="3" class="form-textarea" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="productForm.status" class="form-radio-group">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否热销">
          <el-switch v-model="productForm.isHot" :active-value="1" :inactive-value="0" class="form-switch" />
        </el-form-item>
        <el-form-item label="是否新品">
          <el-switch v-model="productForm.isNew" :active-value="1" :inactive-value="0" class="form-switch" />
        </el-form-item>
        <el-form-item label="是否推荐">
          <el-switch v-model="productForm.isRecommend" :active-value="1" :inactive-value="0" class="form-switch" />
        </el-form-item>
        
        <!-- 商品规格信息 -->
        <el-form-item label="规格信息">
          <el-collapse v-model="activeCollapse" class="spec-collapse">
            <el-collapse-item title="杯型规格" name="cupType" class="spec-collapse-item">
              <el-table v-if="productForm.cupTypeList" :data="productForm.cupTypeList" style="width: 100%" class="spec-table">
                <el-table-column prop="specName" label="规格名称" width="120">
                  <template #default="{ row, $index }">
                    <el-input v-model="productForm.cupTypeList[$index].specName" class="spec-input" />
                  </template>
                </el-table-column>
                <el-table-column prop="extra_price" label="价格调整" width="120">
                  <template #default="{ row, $index }">
                    <el-input-number v-model="productForm.cupTypeList[$index].extra_price" :min="-10" :max="10" :precision="2" class="spec-input-number" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template #default="{ $index }">
                    <el-button type="danger" size="small" @click="productForm.cupTypeList.splice($index, 1)" class="spec-delete-button">
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" size="small" @click="productForm.cupTypeList.push({ specName: '', extra_price: 0 })" class="spec-add-button">
                <el-icon><Plus /></el-icon>
                添加杯型规格
              </el-button>
            </el-collapse-item>
            <el-collapse-item title="口味规格" name="taste" class="spec-collapse-item">
              <el-table v-if="productForm.tasteList" :data="productForm.tasteList" style="width: 100%" class="spec-table">
                <el-table-column prop="specName" label="规格名称" width="120">
                  <template #default="{ row, $index }">
                    <el-input v-model="productForm.tasteList[$index].specName" class="spec-input" />
                  </template>
                </el-table-column>
                <el-table-column prop="extra_price" label="价格调整" width="120">
                  <template #default="{ row, $index }">
                    <el-input-number v-model="productForm.tasteList[$index].extra_price" :min="-10" :max="10" :precision="2" class="spec-input-number" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template #default="{ $index }">
                    <el-button type="danger" size="small" @click="productForm.tasteList.splice($index, 1)" class="spec-delete-button">
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" size="small" @click="productForm.tasteList.push({ specName: '', extra_price: 0 })" class="spec-add-button">
                <el-icon><Plus /></el-icon>
                添加口味规格
              </el-button>
            </el-collapse-item>
            <el-collapse-item title="温度规格" name="temperature" class="spec-collapse-item">
              <el-table v-if="productForm.temperatureList" :data="productForm.temperatureList" style="width: 100%" class="spec-table">
                <el-table-column prop="specName" label="规格名称" width="120">
                  <template #default="{ row, $index }">
                    <el-input v-model="productForm.temperatureList[$index].specName" class="spec-input" />
                  </template>
                </el-table-column>
                <el-table-column prop="extra_price" label="价格调整" width="120">
                  <template #default="{ row, $index }">
                    <el-input-number v-model="productForm.temperatureList[$index].extra_price" :min="-10" :max="10" :precision="2" class="spec-input-number" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template #default="{ $index }">
                    <el-button type="danger" size="small" @click="productForm.temperatureList.splice($index, 1)" class="spec-delete-button">
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" size="small" @click="productForm.temperatureList.push({ specName: '', extra_price: 0 })" class="spec-add-button">
                <el-icon><Plus /></el-icon>
                添加温度规格
              </el-button>
            </el-collapse-item>
            <el-collapse-item title="配料规格" name="topping" class="spec-collapse-item">
              <el-table v-if="productForm.toppingList" :data="productForm.toppingList" style="width: 100%" class="spec-table">
                <el-table-column prop="specName" label="规格名称" width="120">
                  <template #default="{ row, $index }">
                    <el-input v-model="productForm.toppingList[$index].specName" class="spec-input" />
                  </template>
                </el-table-column>
                <el-table-column prop="extra_price" label="价格调整" width="120">
                  <template #default="{ row, $index }">
                    <el-input-number v-model="productForm.toppingList[$index].extra_price" :min="0" :max="10" :precision="2" class="spec-input-number" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template #default="{ $index }">
                    <el-button type="danger" size="small" @click="productForm.toppingList.splice($index, 1)" class="spec-delete-button">
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" size="small" @click="productForm.toppingList.push({ specName: '', extra_price: 0 })" class="spec-add-button">
                <el-icon><Plus /></el-icon>
                添加配料规格
              </el-button>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" class="dialog-cancel-button">取消</el-button>
        <el-button type="primary" @click="handleSubmit" class="dialog-submit-button">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { Plus, Search, Edit, Delete, Refresh } from '@element-plus/icons-vue';
import { productApi, categoryApi } from '@/api';
import type { Product, Category } from '@/types';
import ImageUpload from '@/components/ImageUpload.vue';

// 获取商品名称首字母
const getProductInitial = (name: string) => {
  if (!name) return '商';
  return name.charAt(0);
};

const loading = ref(false);
const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref('添加商品');
const productFormRef = ref<FormInstance>();
const activeCollapse = ref(['cupType']);

const searchForm = reactive({
  categoryId: undefined as number | undefined,
  keyword: '',
});

const productForm = reactive<Product>({
  id: 0,
  categoryId: 0,
  name: '',
  description: '',
  detail: '',
  mainImage: '',
  basePrice: 0,
  originalPrice: 0,
  inventory: 0,
  salesCount: 0,
  isHot: 0,
  isNew: 0,
  isRecommend: 0,
  status: 1,
  sort_order: 0,
  createTime: '',
  cupTypeList: [],
  tasteList: [],
  temperatureList: [],
  toppingList: []
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
    const response = await categoryApi.getAll();
    categories.value = response || [];
  } catch (error) {
    console.error('加载分类失败:', error);
  }
};

const loadProducts = async () => {
  loading.value = true;
  try {
    // 使用后端管理接口获取所有商品
    console.log('开始加载商品列表...');
    const result = await productApi.getAllProducts();
    console.log('商品列表API返回结果:', result);
    
    // 确保result是数组
    if (Array.isArray(result)) {
      // 转换后端返回的数据结构，使其与前端期望的结构匹配
      const convertedProducts = result.map((product: any, index: number) => {
        console.log(`原始商品${index + 1}数据:`, product);
        
        // 转换商品基本信息
        const convertedProduct = {
          id: product.productId || product.id || 0,
          categoryId: product.categoryId || 0,
          name: product.name || '',
          description: product.description || '',
          detail: product.detail || '',
          mainImage: product.mainImage || '',
          basePrice: product.basePrice || 0,
          originalPrice: product.originalPrice || 0,
          inventory: product.inventory || 0,
          salesCount: product.salesVolume || product.salesCount || 0,
          isHot: product.isHot || 0,
          isNew: product.isNew || 0,
          isRecommend: product.isRecommend || 0,
          status: product.status || 0,
          sort_order: product.sortOrder || product.sort_order || 0,
          createTime: product.createTime || '',
          updateTime: product.updateTime || '',
          cupTypeList: [] as any[],
          toppingList: [] as any[],
          temperatureList: [] as any[],
          tasteList: [] as any[]
        };
        
        // 转换规格列表
        if (product.cupTypeList && Array.isArray(product.cupTypeList)) {
          convertedProduct.cupTypeList = product.cupTypeList.map((spec: any) => ({
            specName: spec.specName || '',
            extra_price: spec.priceAdd || spec.extra_price || 0
          }));
        }
        
        if (product.toppingList && Array.isArray(product.toppingList)) {
          convertedProduct.toppingList = product.toppingList.map((spec: any) => ({
            specName: spec.specName || '',
            extra_price: spec.priceAdd || spec.extra_price || 0
          }));
        }
        
        if (product.temperatureList && Array.isArray(product.temperatureList)) {
          convertedProduct.temperatureList = product.temperatureList.map((spec: any) => ({
            specName: spec.specName || '',
            extra_price: spec.priceAdd || spec.extra_price || 0
          }));
        }
        
        if (product.humidityList && Array.isArray(product.humidityList)) {
          convertedProduct.tasteList = product.humidityList.map((spec: any) => ({
            specName: spec.specName || '',
            extra_price: spec.priceAdd || spec.extra_price || 0
          }));
        } else if (product.tasteList && Array.isArray(product.tasteList)) {
          convertedProduct.tasteList = product.tasteList.map((spec: any) => ({
            specName: spec.specName || '',
            extra_price: spec.priceAdd || spec.extra_price || 0
          }));
        }
        
        console.log(`转换后商品${index + 1}数据:`, convertedProduct);
        return convertedProduct;
      });
      
      // 过滤掉无效的商品数据
      const validProducts = convertedProducts.filter((product, index) => {
        if (!product.id || product.id <= 0) {
          console.warn(`商品${index + 1}缺少有效ID，将被过滤掉`);
          return false;
        }
        return true;
      });
      
      products.value = validProducts;
      console.log('商品列表加载成功，共', validProducts.length, '条有效数据');
      
      if (validProducts.length === 0 && result.length > 0) {
        ElMessage.warning('所有商品数据缺少有效ID，无法进行编辑和删除操作');
      }
    } else {
      console.error('商品列表API返回数据格式错误:', result);
      products.value = [];
      ElMessage.error('商品列表数据格式错误');
    }

    // 前端筛选
    if (searchForm.categoryId) {
      products.value = products.value.filter(p => p.categoryId === searchForm.categoryId);
    }
    if (searchForm.keyword) {
      products.value = products.value.filter(p =>
        p.name.includes(searchForm.keyword)
      );
    }
  } catch (error: any) {
    console.error('加载商品列表失败:', error);
    ElMessage.error('加载商品列表失败: ' + (error.message || '未知错误'));
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
    id: 0,
    categoryId: 0,
    name: '',
    description: '',
    detail: '',
    mainImage: '',
    basePrice: 0,
    originalPrice: 0,
    inventory: 0,
    isHot: 0,
    isNew: 0,
    isRecommend: 0,
    status: 1,
    sort_order: 0,
    cupTypeList: [
      { specName: "中杯", extra_price: 0.00 },
      { specName: "大杯", extra_price: 3.00 }
    ],
    tasteList: [
      { specName: "标准糖", extra_price: 0.00 },
      { specName: "少糖", extra_price: 0.00 },
      { specName: "无糖", extra_price: 0.00 }
    ],
    temperatureList: [
      { specName: "正常冰", extra_price: 0.00 },
      { specName: "少冰", extra_price: 0.00 },
      { specName: "去冰", extra_price: 0.00 },
      { specName: "热饮", extra_price: 0.00 }
    ],
    toppingList: [
      { specName: "珍珠", extra_price: 2.00 },
      { specName: "布丁", extra_price: 3.00 },
      { specName: "椰果", extra_price: 2.00 }
    ]
  });
  dialogVisible.value = true;
};

const handleEdit = async (row: Product) => {
  dialogTitle.value = '编辑商品';
  try {
    console.log('编辑商品行数据:', row);
    console.log('商品ID值:', row.id);
    console.log('商品ID类型:', typeof row.id);
    console.log('商品ID是否存在:', !!row.id);
    
    if (!row.id || row.id === 0) {
      ElMessage.error('商品ID不存在，无法编辑');
      return;
    }
    // 获取完整的商品详情（包含规格信息）
    const productDetail = await productApi.getProductDetail(row.id);
    console.log('原始商品详情API返回:', productDetail);
    
    // 转换商品详情数据结构，使其与前端期望的结构匹配
    const productData = productDetail || {};
    const convertedDetail: any = {
      id: productData.id || 0,
      categoryId: productData.categoryId || 0,
      name: productData.name || '',
      description: productData.description || '',
      detail: productData.detail || '',
      mainImage: productData.mainImage || '',
      basePrice: productData.basePrice || 0,
      originalPrice: productData.originalPrice || 0,
      inventory: productData.inventory || 0,
      salesCount: productData.salesCount || 0,
      isHot: productData.isHot || 0,
      isNew: productData.isNew || 0,
      isRecommend: productData.isRecommend || 0,
      status: productData.status || 0,
      sort_order: productData.sort_order || 0,
      createTime: productData.createTime || '',
      updateTime: productData.updateTime || '',
      cupTypeList: [],
      toppingList: [],
      temperatureList: [],
      tasteList: []
    };
    
    // 转换规格列表
    if (productData.cupTypeList && Array.isArray(productData.cupTypeList)) {
      convertedDetail.cupTypeList = productData.cupTypeList.map((spec: any) => ({
        specName: spec.specName || '',
        extra_price: spec.extra_price || 0
      }));
    }
    
    if (productData.toppingList && Array.isArray(productData.toppingList)) {
      convertedDetail.toppingList = productData.toppingList.map((spec: any) => ({
        specName: spec.specName || '',
        extra_price: spec.extra_price || 0
      }));
    }
    
    if (productData.temperatureList && Array.isArray(productData.temperatureList)) {
      convertedDetail.temperatureList = productData.temperatureList.map((spec: any) => ({
        specName: spec.specName || '',
        extra_price: spec.extra_price || 0
      }));
    }
    
    if (productData.tasteList && Array.isArray(productData.tasteList)) {
      convertedDetail.tasteList = productData.tasteList.map((spec: any) => ({
        specName: spec.specName || '',
        extra_price: spec.extra_price || 0
      }));
    }
    
    console.log('转换后商品详情数据:', convertedDetail);
    Object.assign(productForm, convertedDetail);
    dialogVisible.value = true;
  } catch (error: any) {
    console.error('编辑商品失败:', error);
    ElMessage.error(error.message || '获取商品详情失败');
  }
};

const handleDelete = async (row: Product) => {
  try {
    if (!row.id) {
      ElMessage.error('商品ID不存在，无法删除');
      return;
    }
    await ElMessageBox.confirm('确定要删除这个商品吗？', '提示', {
      type: 'warning',
    });
    await productApi.deleteProduct(row.id);
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
        console.log('原始提交商品数据:', productForm);
        
        // 转换商品数据结构，使其与后端API期望的结构匹配
        const submitData = {
          ...productForm,
          productId: productForm.id, // 添加productId字段，使用id的值
          // 删除id字段，避免冲突
          id: undefined
        };
        
        // 转换规格列表
        if (productForm.cupTypeList && Array.isArray(productForm.cupTypeList)) {
          submitData.cupTypeList = productForm.cupTypeList.map((spec: any) => ({
            specName: spec.specName,
            extra_price: spec.extra_price
          }));
        }
        
        if (productForm.toppingList && Array.isArray(productForm.toppingList)) {
          submitData.toppingList = productForm.toppingList.map((spec: any) => ({
            specName: spec.specName,
            extra_price: spec.extra_price
          }));
        }
        
        if (productForm.temperatureList && Array.isArray(productForm.temperatureList)) {
          submitData.temperatureList = productForm.temperatureList.map((spec: any) => ({
            specName: spec.specName,
            extra_price: spec.extra_price
          }));
        }
        
        if (productForm.tasteList && Array.isArray(productForm.tasteList)) {
          submitData.tasteList = productForm.tasteList.map((spec: any) => ({
            specName: spec.specName,
            extra_price: spec.extra_price
          }));
        }
        
        console.log('转换后提交商品数据:', submitData);
        
        if (dialogTitle.value === '添加商品') {
          await productApi.addProduct(submitData);
          console.log('商品添加成功');
        } else {
          await productApi.updateProduct(submitData);
          console.log('商品更新成功');
        }
        ElMessage.success(dialogTitle.value === '添加商品' ? '添加成功' : '更新成功');
        dialogVisible.value = false;
        loadProducts();
      } catch (error: any) {
        console.error('商品操作失败:', error);
        ElMessage.error('操作失败: ' + (error.message || '未知错误'));
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
/* 页面容器 */
.products-page {
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

/* 搜索卡片 */
.search-card {
  margin-bottom: var(--space-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.search-card:hover {
  box-shadow: var(--shadow-md);
}

/* 搜索表单 */
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  align-items: center;
  padding: var(--space-lg);
}

/* 搜索选择器 */
.search-select {
  width: 200px;
}

/* 搜索输入框 */
.search-input {
  width: 300px;
}

/* 搜索按钮 */
.search-button {
  margin-left: var(--space-sm);
}

/* 操作栏 */
.action-bar {
  margin-bottom: var(--space-lg);
  display: flex;
  justify-content: flex-end;
}

/* 添加按钮 */
.add-button {
  font-size: 14px;
  padding: var(--space-sm) var(--space-lg);
}

/* 表格卡片 */
.table-card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.table-card:hover {
  box-shadow: var(--shadow-md);
}

/* 商品表格 */
.product-table {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* 商品信息 */
.product-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

/* 商品头像 */
.product-avatar {
  border: 2px solid var(--color-border);
  transition: all var(--transition-fast);
}

.product-avatar:hover {
  transform: scale(1.1);
  border-color: var(--color-primary);
}

/* 商品名称 */
.product-name {
  font-weight: 500;
  color: var(--color-text);
}

/* 价格信息 */
.price-info {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

/* 价格 */
.price {
  font-weight: 600;
  color: var(--color-primary);
}

/* 原价 */
.original-price {
  font-size: 12px;
  color: var(--color-text-secondary);
  text-decoration: line-through;
}

/* 状态标签 */
.status-tag {
  font-size: 12px;
  padding: var(--space-xs) var(--space-sm);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: var(--space-xs);
}

/* 编辑按钮 */
.edit-button {
  font-size: 12px;
  padding: var(--space-xs) var(--space-sm);
}

/* 删除按钮 */
.delete-button {
  font-size: 12px;
  padding: var(--space-xs) var(--space-sm);
}

/* 商品对话框 */
.product-dialog {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* 商品表单 */
.product-form {
  padding: var(--space-lg);
}

/* 表单输入框 */
.form-input {
  width: 100%;
}

/* 表单选择器 */
.form-select {
  width: 100%;
}

/* 表单输入数字 */
.form-input-number {
  width: 100%;
}

/* 表单文本域 */
.form-textarea {
  width: 100%;
}

/* 表单单选组 */
.form-radio-group {
  display: flex;
  gap: var(--space-lg);
}

/* 表单开关 */
.form-switch {
  --el-switch-on-color: var(--color-primary);
  --el-switch-off-color: var(--color-border);
}

/* 规格折叠面板 */
.spec-collapse {
  margin-top: var(--space-sm);
}

/* 规格折叠项 */
.spec-collapse-item {
  border-radius: var(--radius-md);
  margin-bottom: var(--space-sm);
}

/* 规格表格 */
.spec-table {
  margin-bottom: var(--space-md);
  border-radius: var(--radius-md);
  overflow: hidden;
}

/* 规格输入框 */
.spec-input {
  width: 100%;
}

/* 规格输入数字 */
.spec-input-number {
  width: 100%;
}

/* 规格删除按钮 */
.spec-delete-button {
  font-size: 12px;
  padding: var(--space-xs) var(--space-sm);
}

/* 规格添加按钮 */
.spec-add-button {
  font-size: 12px;
  padding: var(--space-xs) var(--space-sm);
  margin-top: var(--space-sm);
}

/* 对话框按钮 */
.dialog-cancel-button,
.dialog-submit-button {
  font-size: 14px;
  padding: var(--space-sm) var(--space-lg);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .products-page {
    padding: var(--space-lg);
  }
  
  .search-input {
    width: 250px;
  }
  
  .search-select {
    width: 180px;
  }
}

@media (max-width: 768px) {
  .products-page {
    padding: var(--space-md);
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input,
  .search-select {
    width: 100%;
  }
  
  .action-bar {
    justify-content: center;
  }
  
  .product-table {
    font-size: 12px;
  }
  
  .product-dialog {
    width: 90%;
  }
}

@media (max-width: 480px) {
  .products-page {
    padding: var(--space-sm);
  }
  
  .page-header h1 {
    font-size: 1.25rem;
  }
  
  .product-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
  }
  
  .action-buttons {
    flex-direction: column;
    gap: var(--space-xs);
  }
  
  .edit-button,
  .delete-button {
    width: 100%;
  }
}
</style>