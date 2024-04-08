const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')

// 导入用户路由处理函数对应的模块
const myarrange_handler = require('../router_handler/myarrange')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const {
        search_arr_schema
     } = require('../schema/myarrange')

// 根据id获取自己订阅计划列表的路由
router.get('/perarrlist',myarrange_handler.getarrListById)

// 根据id关键字搜索计划的路由
router.get('/searcharr/:key',expressJoi(search_arr_schema),myarrange_handler.searchArr)

// 获取课件列表的路由
router.get('/cowlist/:arr_id',myarrange_handler.getCowList)

// 下载文件的路由
router.get('/download',myarrange_handler.downloadSrc)

module.exports = router