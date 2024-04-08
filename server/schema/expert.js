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
const exp_name = joi.string()
const dept_id = joi.required()
const position = joi.required()
const exp_id = joi.required()
// 搜索框传来的关键字
const key = joi.required()
exports.new_exp_schema = {
    body:{
        exp_name,
        dept_id,
        position
    }
}

// 验证规则对象-更新专家信息
exports.update_exp_schema = {
    // 需要对req.body 里面的数据进行验证
    body: {
      // 一致可以不写后面，简写如上一个验证规则对象里的写法
      exp_id,
      exp_name,
      dept_id,
      position,
    }
  }
  
  // 校验规则对象 - 获取专家信息
  exports.get_exp_schema = {
    params: {
      exp_id,
    },
  }

  // 校验规则对象 - 删除专家
exports.delete_exp_schema = {
    params: {
      exp_id,
    },
  }

  // 校验规则对象 - 搜索用户
exports.search_exp_schema = {
    params: {
      key,
    },
  }