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
const arr_id = joi.required()
const bro_src = joi.string()
const rec_src = joi.string()
const les_id = joi.required()
const date = joi.required()
const time = joi.required()
const chapter = joi.required()
// 搜索框传来的关键字
const key = joi.required()

// 验证规则对象-创建计划
exports.new_arr_schema = {
    body:{
        les_id,
        chapter,
        date,
        time,
    }
}

// 验证规则对象-更新计划信息
exports.update_arr_schema = {
    // 需要对req.body 里面的数据进行验证
    body: {
      // 一致可以不写后面，简写如上一个验证规则对象里的写法
      arr_id,
      date,
      time,
      bro_src,
      rec_src
    }
  }
  
  // 校验规则对象 - 获取计划信息
  exports.get_arr_schema = {
    params: {
      arr_id,
    },
  }

  // 校验规则对象 - 删除计划
exports.delete_arr_schema = {
    params: {
      arr_id,
    },
  }

  // 校验规则对象 - 搜索用户
exports.search_arr_schema = {
    params: {
      key,
    },
  }