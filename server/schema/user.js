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
const id = joi.number().integer().min(1).required()
// 用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
// 密码的验证规则
const pwd = joi
  .string()
  .pattern(/^[\S]{3,12}$/)
  .required()

const role_id = joi.required()
const ins_id = joi.required()
const email = joi.string().email().required()
// 搜索框传来的关键字
const key = joi.required()

// 定义验证 avatar 头像的验证规则
const avatar = joi.string().dataUri().required()

// 注册和登录表单的验证规则对象
exports.reg_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    pwd,
    role_id,
    ins_id,
    email
  },
}

exports.login_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    pwd,
  },
}

// 验证规则对象-更新用户基本信息
exports.update_userinfo_schema = {
  // 需要对req.body 里面的数据进行验证
  body: {
    // 一致可以不写后面，简写如上一个验证规则对象里的写法
    id,
    username,
    role_id,
    ins_id,
    email
  }
}

// 校验规则对象 - 删除用户
exports.delete_user_schema = {
  params: {
    id,
  },
}

// 校验规则对象 - 搜索用户
exports.search_user_schema = {
  params: {
    key,
  },
}

// 验证规则对象-更新密码
exports.update_pwd_schema = {
  body:{
    oldPwd:pwd,
    newPwd:joi.not(joi.ref('oldPwd')).concat(pwd)
  }
}

// 验证规则对象-更新头像
exports.update_avatar_schema = {
  body:{
    avatar
  }
}