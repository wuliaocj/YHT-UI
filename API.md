# API 接口文档

本文档整理了前端项目中使用的所有 API 接口，用于指导后端开发。每个接口包含了请求路径、方法、参数和响应格式等信息。

## 基本信息

- API 基础路径：`/api`
- 认证方式：Bearer Token（登录后获取，放在请求头的 Authorization 字段中）
- 响应格式：统一 JSON 格式，包含 code、msg 和 data 字段

## 响应格式

```json
{
  "code": 200, // 状态码，200 表示成功，其他表示失败
  "msg": "操作成功", // 消息提示
  "data": {} // 响应数据
}
```

## 1. 认证相关接口

### 1.1 管理员登录

**请求路径**：`/admin/login`
**请求方法**：POST
**请求参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**响应数据**：
```json
{
  "token": "string", // JWT token
  "admin": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "avatar": "string",
    "phone": "string",
    "email": "string",
    "role": "admin"
  }
}
```

### 1.2 获取当前管理员信息

**请求路径**：`/admin/current`
**请求方法**：GET
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**响应数据**：
```json
{
  "id": 1,
  "username": "admin",
  "nickname": "管理员",
  "avatar": "string",
  "phone": "string",
  "email": "string",
  "role": "admin"
}
```

### 1.3 更新管理员信息

**请求路径**：`/admin/profile/update`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**请求参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| username | string | 是 | 用户名 |
| nickname | string | 是 | 昵称 |
| avatar | string | 否 | 头像 URL |
| phone | string | 否 | 手机号 |
| email | string | 否 | 邮箱 |

**响应数据**：
```json
{
  "id": 1,
  "username": "admin",
  "nickname": "管理员",
  "avatar": "string",
  "phone": "string",
  "email": "string",
  "role": "admin"
}
```

### 1.4 修改管理员密码

**请求路径**：`/admin/password/change`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**请求参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| oldPassword | string | 是 | 旧密码 |
| newPassword | string | 是 | 新密码 |

**响应数据**：
```json
{
  "success": true
}
```

## 2. 商品相关接口

### 2.1 获取商品详情

**请求路径**：`/product/{id}`
**请求方法**：GET
**路径参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | number | 是 | 商品 ID |

**响应数据**：
```json
{
  "id": 1,
  "categoryId": 1,
  "name": "商品名称",
  "description": "商品描述",
  "detail": "商品详情",
  "mainImage": "图片 URL",
  "basePrice": 100,
  "originalPrice": 120,
  "inventory": 100,
  "salesCount": 0,
  "isHot": 0,
  "isNew": 0,
  "isRecommend": 0,
  "status": 1,
  "sort_order": 0,
  "createTime": "2023-01-01 00:00:00",
  "cupTypeList": [
    {
      "specName": "中杯",
      "extra_price": 0
    }
  ],
  "tasteList": [
    {
      "specName": "标准糖",
      "extra_price": 0
    }
  ],
  "temperatureList": [
    {
      "specName": "正常冰",
      "extra_price": 0
    }
  ],
  "toppingList": [
    {
      "specName": "珍珠",
      "extra_price": 2
    }
  ]
}
```

### 2.2 管理后台：获取所有商品

**请求路径**：`/product/admin/list`
**请求方法**：GET
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**响应数据**：
```json
[
  {
    "id": 1,
    "categoryId": 1,
    "name": "商品名称",
    "description": "商品描述",
    "mainImage": "图片 URL",
    "basePrice": 100,
    "originalPrice": 120,
    "inventory": 100,
    "salesCount": 0,
    "isHot": 0,
    "isNew": 0,
    "isRecommend": 0,
    "status": 1,
    "createTime": "2023-01-01 00:00:00"
  }
]
```

### 2.3 管理后台：添加商品

**请求路径**：`/product/admin/add`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**请求参数**：
```json
{
  "categoryId": 1,
  "name": "商品名称",
  "description": "商品描述",
  "detail": "商品详情",
  "mainImage": "图片 URL",
  "basePrice": 100,
  "originalPrice": 120,
  "inventory": 100,
  "isHot": 0,
  "isNew": 0,
  "isRecommend": 0,
  "status": 1,
  "sort_order": 0,
  "cupTypeList": [
    {
      "specName": "中杯",
      "extra_price": 0
    }
  ],
  "tasteList": [
    {
      "specName": "标准糖",
      "extra_price": 0
    }
  ],
  "temperatureList": [
    {
      "specName": "正常冰",
      "extra_price": 0
    }
  ],
  "toppingList": [
    {
      "specName": "珍珠",
      "extra_price": 2
    }
  ]
}
```

**响应数据**：
```json
{
  "id": 1,
  "categoryId": 1,
  "name": "商品名称",
  "description": "商品描述",
  "detail": "商品详情",
  "mainImage": "图片 URL",
  "basePrice": 100,
  "originalPrice": 120,
  "inventory": 100,
  "salesCount": 0,
  "isHot": 0,
  "isNew": 0,
  "isRecommend": 0,
  "status": 1,
  "sort_order": 0,
  "createTime": "2023-01-01 00:00:00"
}
```

### 2.4 管理后台：更新商品

**请求路径**：`/product/admin/update`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**请求参数**：
```json
{
  "id": 1,
  "categoryId": 1,
  "name": "商品名称",
  "description": "商品描述",
  "detail": "商品详情",
  "mainImage": "图片 URL",
  "basePrice": 100,
  "originalPrice": 120,
  "inventory": 100,
  "isHot": 0,
  "isNew": 0,
  "isRecommend": 0,
  "status": 1,
  "sort_order": 0,
  "cupTypeList": [
    {
      "specName": "中杯",
      "extra_price": 0
    }
  ],
  "tasteList": [
    {
      "specName": "标准糖",
      "extra_price": 0
    }
  ],
  "temperatureList": [
    {
      "specName": "正常冰",
      "extra_price": 0
    }
  ],
  "toppingList": [
    {
      "specName": "珍珠",
      "extra_price": 2
    }
  ]
}
```

**响应数据**：
```json
{
  "id": 1,
  "categoryId": 1,
  "name": "商品名称",
  "description": "商品描述",
  "detail": "商品详情",
  "mainImage": "图片 URL",
  "basePrice": 100,
  "originalPrice": 120,
  "inventory": 100,
  "salesCount": 0,
  "isHot": 0,
  "isNew": 0,
  "isRecommend": 0,
  "status": 1,
  "sort_order": 0,
  "createTime": "2023-01-01 00:00:00",
  "updateTime": "2023-01-01 00:00:00"
}
```

### 2.5 管理后台：删除商品

**请求路径**：`/product/admin/delete/{id}`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**路径参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | number | 是 | 商品 ID |

**响应数据**：
```json
{
  "success": true
}
```

## 3. 分类相关接口

### 3.1 管理后台：获取分类列表

**请求路径**：`/admin/category/list`
**请求方法**：GET
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**响应数据**：
```json
[
  {
    "id": 1,
    "name": "分类名称",
    "parentId": 0,
    "level": 1,
    "sort": 1,
    "icon": "图片 URL",
    "status": 1,
    "createTime": "2023-01-01 00:00:00"
  }
]
```

### 3.2 管理后台：保存分类（新增或更新）

**请求路径**：`/admin/category/save`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**请求参数**：
```json
{
  "id": 1, // 新增时为 0 或不传
  "name": "分类名称",
  "parentId": 0,
  "level": 1,
  "sort": 1,
  "icon": "图片 URL",
  "status": 1
}
```

**响应数据**：
```json
{
  "id": 1,
  "name": "分类名称",
  "parentId": 0,
  "level": 1,
  "sort": 1,
  "icon": "图片 URL",
  "status": 1,
  "createTime": "2023-01-01 00:00:00"
}
```

### 3.3 管理后台：删除分类

**请求路径**：`/admin/category/delete/{id}`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**路径参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | number | 是 | 分类 ID |

**响应数据**：
```json
{
  "success": true
}
```

## 4. 订单相关接口

### 4.1 获取订单列表

**请求路径**：`/order/list/{userId}` 或 `/order/admin/order/list`
**请求方法**：GET
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**路径参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| userId | number | 否 | 用户 ID（前端传参时使用 `/order/list/{userId}` 路径） |

**响应数据**：
```json
[
  {
    "id": 1,
    "orderNo": "2023010100001",
    "userId": 1,
    "totalAmount": 100,
    "discountAmount": 10,
    "deliveryFee": 5,
    "actualAmount": 95,
    "paymentMethod": 1,
    "status": 1,
    "createTime": "2023-01-01 00:00:00"
  }
]
```

### 4.2 获取订单详情

**请求路径**：`/order/{orderId}`
**请求方法**：GET
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**路径参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| orderId | number | 是 | 订单 ID |

**响应数据**：
```json
{
  "id": 1,
  "orderNo": "2023010100001",
  "userId": 1,
  "totalAmount": 100,
  "discountAmount": 10,
  "deliveryFee": 5,
  "actualAmount": 95,
  "paymentMethod": 1,
  "status": 1,
  "createTime": "2023-01-01 00:00:00",
  "updateTime": "2023-01-01 00:00:00",
  "adminRemark": "管理员备注"
}
```

### 4.3 管理后台：更新订单状态

**请求路径**：`/order/admin/order/update`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**请求参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| orderId | number | 是 | 订单 ID |
| status | number | 是 | 订单状态 |
| adminRemark | string | 否 | 管理员备注 |

**响应数据**：
```json
{
  "success": true
}
```

## 5. 用户相关接口

### 5.1 管理后台：获取用户列表

**请求路径**：`/admin/user/list`
**请求方法**：GET
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**查询参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| page | number | 否 | 页码 |
| size | number | 否 | 每页数量 |
| keyword | string | 否 | 搜索关键词 |

**响应数据**：
```json
[
  {
    "id": 1,
    "openid": "string",
    "nickname": "用户昵称",
    "avatarUrl": "图片 URL",
    "phone": "13800138000",
    "gender": 1,
    "integral": 100,
    "vipLevel": 1,
    "totalConsumption": 1000,
    "status": 1,
    "createTime": "2023-01-01 00:00:00"
  }
]
```

### 5.2 管理后台：更新用户状态

**请求路径**：`/admin/user/updateStatus/{userId}`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**路径参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| userId | number | 是 | 用户 ID |

**请求参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| status | number | 是 | 用户状态 |

**响应数据**：
```json
{
  "success": true
}
```

## 6. 优惠券相关接口

### 6.1 管理后台：获取优惠券列表

**请求路径**：`/admin/coupon/list`
**请求方法**：GET
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**响应数据**：
```json
[
  {
    "id": 1,
    "name": "优惠券名称",
    "type": 1,
    "value": 10,
    "minAmount": 100,
    "totalCount": 100,
    "remainingCount": 90,
    "limitPerUser": 1,
    "validityType": 1,
    "startTime": "2023-01-01 00:00:00",
    "endTime": "2023-01-31 23:59:59",
    "status": 1,
    "createTime": "2023-01-01 00:00:00"
  }
]
```

### 6.2 管理后台：保存优惠券

**请求路径**：`/admin/coupon/save`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**请求参数**：
```json
{
  "id": 1, // 新增时为 0 或不传
  "name": "优惠券名称",
  "type": 1,
  "value": 10,
  "minAmount": 100,
  "totalCount": 100,
  "limitPerUser": 1,
  "validityType": 1,
  "startTime": "2023-01-01 00:00:00",
  "endTime": "2023-01-31 23:59:59",
  "status": 1
}
```

**响应数据**：
```json
{
  "id": 1,
  "name": "优惠券名称",
  "type": 1,
  "value": 10,
  "minAmount": 100,
  "totalCount": 100,
  "remainingCount": 100,
  "limitPerUser": 1,
  "validityType": 1,
  "startTime": "2023-01-01 00:00:00",
  "endTime": "2023-01-31 23:59:59",
  "status": 1,
  "createTime": "2023-01-01 00:00:00"
}
```

### 6.3 管理后台：删除优惠券

**请求路径**：`/admin/coupon/delete/{id}`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**路径参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | number | 是 | 优惠券 ID |

**响应数据**：
```json
{
  "success": true
}
```

## 7. 轮播图相关接口

### 7.1 管理后台：获取轮播图列表

**请求路径**：`/admin/banner/list`
**请求方法**：GET
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**响应数据**：
```json
[
  {
    "id": 1,
    "title": "轮播图标题",
    "imageUrl": "图片 URL",
    "linkType": 1,
    "linkValue": "链接值",
    "sortOrder": 1,
    "status": 1,
    "startTime": "2023-01-01 00:00:00",
    "endTime": "2023-01-31 23:59:59",
    "createTime": "2023-01-01 00:00:00"
  }
]
```

### 7.2 管理后台：保存轮播图

**请求路径**：`/admin/banner/save`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**请求参数**：
```json
{
  "id": 1, // 新增时为 0 或不传
  "title": "轮播图标题",
  "imageUrl": "图片 URL",
  "linkType": 1,
  "linkValue": "链接值",
  "sortOrder": 1,
  "status": 1,
  "startTime": "2023-01-01 00:00:00",
  "endTime": "2023-01-31 23:59:59"
}
```

**响应数据**：
```json
{
  "id": 1,
  "title": "轮播图标题",
  "imageUrl": "图片 URL",
  "linkType": 1,
  "linkValue": "链接值",
  "sortOrder": 1,
  "status": 1,
  "startTime": "2023-01-01 00:00:00",
  "endTime": "2023-01-31 23:59:59",
  "createTime": "2023-01-01 00:00:00"
}
```

### 7.3 管理后台：删除轮播图

**请求路径**：`/admin/banner/delete/{id}`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**路径参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | number | 是 | 轮播图 ID |

**响应数据**：
```json
{
  "success": true
}
```

## 8. 促销活动相关接口

### 8.1 管理后台：获取促销活动列表

**请求路径**：`/admin/promotion/list`
**请求方法**：GET
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**响应数据**：
```json
[
  {
    "id": 1,
    "name": "活动名称",
    "type": 1,
    "description": "活动描述",
    "startTime": "2023-01-01 00:00:00",
    "endTime": "2023-01-31 23:59:59",
    "status": 1,
    "createTime": "2023-01-01 00:00:00",
    "rules": {}
  }
]
```

### 8.2 管理后台：保存促销活动

**请求路径**：`/admin/promotion/save`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**请求参数**：
```json
{
  "id": 1, // 新增时为 0 或不传
  "name": "活动名称",
  "type": 1,
  "description": "活动描述",
  "startTime": "2023-01-01 00:00:00",
  "endTime": "2023-01-31 23:59:59",
  "status": 1,
  "rules": {}
}
```

**响应数据**：
```json
{
  "id": 1,
  "name": "活动名称",
  "type": 1,
  "description": "活动描述",
  "startTime": "2023-01-01 00:00:00",
  "endTime": "2023-01-31 23:59:59",
  "status": 1,
  "createTime": "2023-01-01 00:00:00",
  "rules": {}
}
```

### 8.3 管理后台：删除促销活动

**请求路径**：`/admin/promotion/delete/{id}`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**路径参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | number | 是 | 促销活动 ID |

**响应数据**：
```json
{
  "success": true
}
```

## 9. 支付相关接口

### 9.1 创建支付单（生成支付参数）

**请求路径**：`/payment/create`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**查询参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| orderNo | string | 是 | 订单号 |

**响应数据**：
```json
{
  "payUrl": "支付链接",
  "params": {}
}
```

### 9.2 查询支付状态

**请求路径**：`/payment/status/{orderNo}`
**请求方法**：GET
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**路径参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| orderNo | string | 是 | 订单号 |

**响应数据**：
```json
{
  "status": "SUCCESS", // SUCCESS、PENDING、FAIL
  "orderNo": "2023010100001"
}
```

### 9.3 模拟支付成功（测试用）

**请求路径**：`/payment/mock/success`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**查询参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| orderNo | string | 是 | 订单号 |

**响应数据**：
```json
{
  "success": true
}
```

## 10. 地址相关接口

### 10.1 获取用户地址列表

**请求路径**：`/address/list/{userId}`
**请求方法**：GET
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**路径参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| userId | number | 是 | 用户 ID |

**响应数据**：
```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "收货人姓名",
    "phone": "13800138000",
    "province": "广东省",
    "city": "深圳市",
    "district": "南山区",
    "detailAddress": "详细地址",
    "isDefault": 1
  }
]
```

### 10.2 保存地址（新增或更新）

**请求路径**：`/address/save`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**请求参数**：
```json
{
  "id": 1, // 新增时为 0 或不传
  "userId": 1,
  "name": "收货人姓名",
  "phone": "13800138000",
  "province": "广东省",
  "city": "深圳市",
  "district": "南山区",
  "detailAddress": "详细地址",
  "isDefault": 1
}
```

**响应数据**：
```json
{
  "id": 1,
  "userId": 1,
  "name": "收货人姓名",
  "phone": "13800138000",
  "province": "广东省",
  "city": "深圳市",
  "district": "南山区",
  "detailAddress": "详细地址",
  "isDefault": 1
}
```

### 10.3 删除地址

**请求路径**：`/address/delete/{id}`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |

**路径参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | number | 是 | 地址 ID |

**响应数据**：
```json
{
  "success": true
}
```

## 11. 文件上传相关接口

### 11.1 上传图片

**请求路径**：`/upload/image`
**请求方法**：POST
**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Authorization | string | 是 | Bearer Token |
| Content-Type | string | 是 | multipart/form-data |

**请求参数**：
| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| files | file | 是 | 图片文件 |

**响应数据**：
```json
[
  "图片 URL"
]
```
