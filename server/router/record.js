const express = require('express')
const router = express.Router()

// 导入录制处理函数对应的模块
const record_handler = require('../router_handler/record')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { record_schema} = require('../schema/record')

// 上传录制视频地址路由
router.post('/addupload',record_handler.recLesson)

// 获得指定计划的串流密匙
router.get('/getKey/:arr_id',record_handler.getArrKey)

module.exports = router