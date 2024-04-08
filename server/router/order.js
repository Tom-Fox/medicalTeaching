const express = require('express')
const router = express.Router()

// 导入订阅路由处理函数对应的模块
const order_handler = require('../router_handler/order')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { new_ord_schema,
        get_ord_schema,
        update_ord_schema,
        delete_ord_schema,
        search_ord_schema
     } = require('../schema/order')
// 获取所有订阅信息的路由
router.get('/ordlist',order_handler.getOrdList)

// // 获取订阅信息的路由
// router.get('/ordinfo/:ord_id',expressJoi(get_ord_schema), order_handler.getOrdInfo)

// 添加新订阅的路由
router.post('/neworder',expressJoi(new_ord_schema),order_handler.newOrder)

// // 更新订阅信息的路由
// router.post('/ordinfo',expressJoi(update_ord_schema),order_handler.updateOrdInfo)

// // 删除订阅的路由
// router.get('/deletord/:ord_id',expressJoi(delete_ord_schema),order_handler.deleteOrdById)

// // 关键字搜索订阅的路由
// router.get('/searchord/:key',expressJoi(search_ord_schema),order_handler.searchOrd)

module.exports = router