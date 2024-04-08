const express = require('express')
const router = express.Router()

// 导入课程路由处理函数对应的模块
const lesson_handler = require('../router_handler/lesson')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { new_les_schema,
    get_les_schema,
    update_les_schema,
    delete_les_schema,
    search_les_schema
 } = require('../schema/lesson')

 // 获取课程列表的路由
router.get('/leslist',lesson_handler.getLessonList)

// 根据id获取课程列表的
router.get('/perleslist',lesson_handler.getLesListById)

// 获取课程信息的路由
router.get('/lesinfo/:les_id',expressJoi(get_les_schema), lesson_handler.getLesInfo)

// 添加新课程的路由
router.post('/newles',expressJoi(new_les_schema),lesson_handler.newLesson)

// 更新课程信息的路由
router.post('/lesinfo',expressJoi(update_les_schema),lesson_handler.updateLesInfo)

// 删除课程的路由
router.get('/deletles/:les_id',expressJoi(delete_les_schema),lesson_handler.deleteLesById)

// 关键字搜索课程的路由
router.get('/searchles/:key',expressJoi(search_les_schema),lesson_handler.searchLes)


module.exports = router