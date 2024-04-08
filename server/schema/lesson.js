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

const les_id = joi.required()
const les_name = joi.string()
const introduction = joi.required()
const exp_id = joi.required()
// 搜索框传来的关键字
const key = joi.required()

exports.new_les_schema = {
    body:{
        les_name,
        exp_id,
        introduction
    }
}

// 验证规则对象-更新课程信息
exports.update_les_schema = {
    // 需要对req.body 里面的数据进行验证
    body: {
      // 一致可以不写后面，简写如上一个验证规则对象里的写法
      les_id,
      les_name,
      exp_id,
      introduction,
    }
  }
  
  // 校验规则对象 - 获取课程信息
  exports.get_les_schema = {
    params: {
        les_id,
    },
  }

  // 校验规则对象 - 删除课程
exports.delete_les_schema = {
    params: {
        les_id,
    },
  }

  // 校验规则对象 - 搜索课程
exports.search_les_schema = {
    params: {
      key,
    },
  }