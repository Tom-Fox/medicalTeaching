const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')

// 导入用户路由处理函数对应的模块
const arrange_handler = require('../router_handler/arrange')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { new_arr_schema,
        get_arr_schema,
        update_arr_schema,
        delete_arr_schema,
        search_arr_schema
     } = require('../schema/arrange')
// 获取所有计划信息的路由
router.get('/arrlist',arrange_handler.getAllArrInfo)

// 根据id获取计划列表的路由
router.get('/perarrlist',arrange_handler.getarrListById)

// 获取计划信息的路由
router.get('/arrinfo/:arr_id',expressJoi(get_arr_schema), arrange_handler.getArrInfo)

// 添加新计划的路由
router.post('/newarr',expressJoi(new_arr_schema),arrange_handler.newArrange)

// 更新计划信息的路由
router.post('/arrinfo',expressJoi(update_arr_schema),arrange_handler.updateArrInfo)

// 删除计划的路由
router.get('/deletarr/:arr_id',expressJoi(delete_arr_schema),arrange_handler.deleteArrById)

// 关键字搜索计划的路由
router.get('/searcharr/:key',expressJoi(search_arr_schema),arrange_handler.searchArr)

// 单文件上传的路由
// router.post('/upload',multer({
//      dest:'upload'
// }).single('file'),arrange_handler.uploadSrc)

//不能都命名为file,地址会冲突 

// 多文件上传的路由
router.post('/upload', multer({
     dest: 'upload'
   }).array('file',10), arrange_handler.uploadArray)

// dest为文件上传的地址：server根目录下的upload文件夹
// single内为上传文件的名称

// 获取课件列表的路由
router.get('/cowlist/:arr_id',arrange_handler.getCowList)

// 下载文件的路由
router.get('/download',arrange_handler.downloadSrc)

module.exports = router