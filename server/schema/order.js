// 导入定义验证规则的包
const joi = require('joi')
/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */
const ord_id = joi.required()
const les_id = joi.required()
const user_id = joi.required()
// 搜索框传来的关键字
const key = joi.required()

// 验证规则对象-创建计划
exports.new_arr_schema = {
    body:{
        les_id,
        user_id,
    }
}

// 验证规则对象-更新计划信息
exports.update_arr_schema = {
    // 需要对req.body 里面的数据进行验证
    body: {
      // 一致可以不写后面，简写如上一个验证规则对象里的写法
      ord_id,
      user_id,
      les_id,
    }
  }
  
  // 校验规则对象 - 获取计划信息
  exports.get_arr_schema = {
    params: {
        ord_id,
        user_id,
        les_id,
    },
  }

  // 校验规则对象 - 删除计划
exports.delete_arr_schema = {
    params: {
        ord_id,
    },
  }

  // 校验规则对象 - 搜索用户
exports.search_arr_schema = {
    params: {
      key,
    },
  }