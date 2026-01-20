# 益禾堂管理后台 - API对接说明

## 后端API地址
- 开发环境：`http://localhost:8080`
- 生产环境：根据实际部署地址修改 `vite.config.ts` 中的代理配置

## 已对接的功能模块

### ✅ 完全对接
1. **管理员登录** - `/api/admin/login`
2. **订单管理** - `/api/order/admin/order/list`, `/api/order/{orderId}`, `/api/order/admin/order/update`
3. **用户管理** - `/api/admin/user/list`, `/api/admin/user/updateStatus/{userId}`
4. **优惠券管理** - `/api/admin/coupon/list`, `/api/admin/coupon/save`, `/api/admin/coupon/delete/{id}`
5. **轮播图管理** - `/api/admin/banner/list`, `/api/admin/banner/save`, `/api/admin/banner/delete/{id}`
6. **促销活动管理** - `/api/admin/promotion/list`, `/api/admin/promotion/save`, `/api/admin/promotion/delete/{id}`
7. **商品管理** - `/api/product/admin/list`, `/api/product/admin/add`, `/api/product/{id}`

### ⚠️ 部分对接（需要后端补充）
1. **分类管理**
   - ✅ 保存分类：`/api/admin/category/save`
   - ✅ 删除分类：`/api/admin/category/delete/{id}`
   - ❌ **缺失**：获取分类列表接口（前端已预留，后端需要实现 `GET /api/admin/category/list`）

2. **商品管理**
   - ✅ 获取商品列表：`/api/product/admin/list`
   - ✅ 添加商品：`/api/product/admin/add`
   - ✅ 获取商品详情：`/api/product/{id}`
   - ❌ **缺失**：编辑商品接口（前端已预留）
   - ❌ **缺失**：删除商品接口（前端已预留）

## 订单状态枚举（与后端一致）
- 1: 待付款
- 2: 已付款
- 3: 制作中
- 4: 待取餐
- 5: 已完成
- 6: 已取消

## 支付状态枚举（与后端一致）
- 0: 待支付
- 1: 支付成功
- 2: 支付失败
- 3: 已退款

## 使用说明

### 1. 启动开发服务器
```bash
cd 前端/YHT-UI
npm install
npm run dev
```

### 2. 登录管理后台
- 访问：`http://localhost:5173/login`
- 默认账号：根据后端数据库中的admin表

### 3. 功能说明
- **仪表盘**：显示商品总数、订单总数、用户总数、今日营收等统计信息
- **商品管理**：添加、查看商品（编辑和删除功能需后端支持）
- **分类管理**：添加、编辑、删除分类（列表查询需后端支持）
- **订单管理**：查看订单列表、订单详情、更新订单状态
- **用户管理**：查看用户列表、启用/禁用用户
- **优惠券管理**：添加、编辑、删除优惠券
- **轮播图管理**：添加、编辑、删除轮播图
- **促销活动管理**：添加、编辑、删除促销活动

## 注意事项

1. **Token存储**：管理员token存储在 `localStorage.getItem('admin_token')`
2. **请求拦截**：所有请求自动携带 `Authorization: Bearer {token}` 头
3. **响应处理**：统一处理 `HttpResult` 格式的响应
4. **错误处理**：API调用失败会显示错误提示

## 待完善功能

1. 后端需要补充分类列表查询接口
2. 后端需要补充商品编辑和删除接口
3. 仪表盘统计功能可以优化（建议后端提供统计接口）
4. 订单详情可以显示订单项列表（需要后端支持）
