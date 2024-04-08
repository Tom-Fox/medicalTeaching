const express = require('express')
const router = express.Router()

// 导入用户路由处理函数对应的模块
const expert_handler = require('../router_handler/expert')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { new_exp_schema,
        get_exp_schema,
        update_exp_schema,
        delete_exp_schema,
        search_exp_schema
     } = require('../schema/expert')
// 获取所有专家信息的路由
router.get('/explist',expert_handler.getAllExpInfo)

// 获取专家列表的路由
router.get('/expchoice',expert_handler.getExpertList)

// 获取专家信息的路由
router.get('/expinfo/:exp_id',expressJoi(get_exp_schema), expert_handler.getExpInfo)

// 添加新专家的路由
router.post('/newexp',expressJoi(new_exp_schema),expert_handler.newExpert)

// 更新专家信息的路由
router.post('/expinfo',expressJoi(update_exp_schema),expert_handler.updateExpInfo)

// 删除专家的路由
router.get('/deletexp/:exp_id',expressJoi(delete_exp_schema),expert_handler.deleteExpById)

// 关键字搜索专家的路由
router.get('/searchexp/:key',expressJoi(search_exp_schema),expert_handler.searchExp)


module.exports = router