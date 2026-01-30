// 商品规格项
export interface ProductSpec {
  specName: string
  extra_price: number
}

// 商品信息
export interface Product {
  id: number
  categoryId: number
  name: string
  enName?: string
  description: string
  detail?: string
  mainImage: string
  images?: string
  basePrice: number
  originalPrice: number
  inventory?: number
  salesCount?: number
  isHot: number
  isNew: number
  isRecommend: number
  customOptions?: string
  status: number
  sort_order?: number
  createTime: string
  updateTime?: string
  cupTypeList?: ProductSpec[]
  tasteList?: ProductSpec[]
  temperatureList?: ProductSpec[]
  toppingList?: ProductSpec[]
}

// 分类信息
export interface Category {
  id: number
  name: string
  parentId?: number
  level?: number
  sort?: number
  icon?: string
  status?: number
  createTime?: string
  updateTime?: string
}