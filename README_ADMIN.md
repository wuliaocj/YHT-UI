# 益禾堂管理后台

基于 Vue 3 + Element Plus 的管理后台系统。

## 功能模块

### 1. 仪表盘
- 数据统计展示（商品总数、订单总数、用户总数、今日营收）
- 最近订单列表
- 热销商品列表

### 2. 商品管理
- 商品列表展示
- 商品添加/编辑/删除
- 商品搜索和筛选
- 商品状态管理（上架/下架）
- 商品属性设置（热销、新品、推荐）

### 3. 分类管理
- 分类列表展示
- 分类添加/编辑/删除
- 分类排序设置
- 分类状态管理

### 4. 订单管理
- 订单列表展示
- 订单详情查看
- 订单状态更新（开始制作、完成订单）
- 管理员备注功能
- 订单搜索和筛选

### 5. 用户管理
- 用户列表展示
- 用户信息查看
- 用户状态管理（启用/禁用）
- 用户搜索功能

### 6. 优惠券管理
- 优惠券列表展示
- 优惠券添加/编辑/删除
- 优惠券类型设置（满减券、折扣券）
- 有效期设置

### 7. 轮播图管理
- 轮播图列表展示
- 轮播图添加/编辑/删除
- 链接设置（商品、分类）
- 时间范围设置

### 8. 促销活动管理
- 促销活动列表展示
- 促销活动添加/编辑/删除
- 活动类型设置
- 规则配置

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript
- **Element Plus** - Vue 3 组件库
- **Vue Router** - 官方路由管理器
- **Axios** - HTTP 客户端
- **Vite** - 下一代前端构建工具

## 项目结构

```
src/
├── api/              # API 接口定义
│   └── index.ts
├── assets/          # 静态资源
├── components/      # 公共组件
├── layouts/         # 布局组件
│   └── MainLayout.vue
├── router/          # 路由配置
│   └── index.ts
├── types/           # TypeScript 类型定义
│   └── index.ts
├── views/           # 页面组件
│   ├── Login.vue
│   ├── Dashboard.vue
│   ├── Products.vue
│   ├── Categories.vue
│   ├── Orders.vue
│   ├── Users.vue
│   ├── Coupons.vue
│   ├── Banners.vue
│   └── Promotions.vue
├── App.vue          # 根组件
└── main.ts          # 入口文件
```

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## API 接口说明

### 基础配置

API 基础地址：`http://localhost:8080/api`

### 认证

所有管理接口需要在请求头中携带 token：
```
Authorization: Bearer {token}
```

### 接口列表

#### 管理员登录
- **POST** `/admin/login`
- 请求体：`{ username: string, password: string }`
- 返回：`{ token: string, admin: object }`

#### 商品管理
- **GET** `/admin/product/list` - 获取商品列表
- **POST** `/admin/product/save` - 保存商品
- **POST** `/admin/product/delete/{id}` - 删除商品

#### 分类管理
- **GET** `/product/categories` - 获取分类列表
- **POST** `/admin/category/save` - 保存分类
- **POST** `/admin/category/delete/{id}` - 删除分类

#### 订单管理
- **GET** `/admin/order/list` - 获取订单列表
- **GET** `/order/{orderId}` - 获取订单详情
- **POST** `/admin/order/update` - 更新订单状态

#### 用户管理
- **GET** `/admin/user/list` - 获取用户列表
- **POST** `/admin/user/updateStatus/{userId}` - 更新用户状态

#### 优惠券管理
- **GET** `/admin/coupon/list` - 获取优惠券列表
- **POST** `/admin/coupon/save` - 保存优惠券
- **POST** `/admin/coupon/delete/{id}` - 删除优惠券

#### 轮播图管理
- **GET** `/admin/banner/list` - 获取轮播图列表
- **POST** `/admin/banner/save` - 保存轮播图
- **POST** `/admin/banner/delete/{id}` - 删除轮播图

#### 促销活动管理
- **GET** `/admin/promotion/list` - 获取促销活动列表
- **POST** `/admin/promotion/save` - 保存促销活动
- **POST** `/admin/promotion/delete/{id}` - 删除促销活动

## 注意事项

1. **后端接口**：部分管理接口需要后端实现，当前前端代码已准备好对接接口
2. **跨域配置**：如果遇到跨域问题，需要在后端配置 CORS
3. **Token 存储**：当前使用 localStorage 存储 token，生产环境建议使用更安全的存储方式
4. **路由守卫**：已实现基础的路由守卫，未登录用户会自动跳转到登录页

## 后续开发建议

1. 实现后端管理接口
2. 添加权限管理（角色、权限控制）
3. 添加数据导出功能
4. 添加操作日志记录
5. 优化移动端适配
6. 添加数据可视化图表
7. 实现文件上传功能（图片上传）
