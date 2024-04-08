// 导入数据库操作模块
const { expression } = require('joi')
const db = require('../db/index')
// 导入处理密码的模块
const bcrypt = require('bcryptjs')
const { query } = require('express')
const url = require('url')
// 获取所有用户信息的处理函数
exports.getAllUserInfo = (req,res) => {
    // 获取前台传来的“当前页号”和“每页条数”
    const currentPage = req.body.currentPage
    const pageSize = req.body.pageSize

    // ？输出变量
    var list = []
    var total = 0
    // 查询数据库得到当前页数据
    // const sql1 = `select id, username, role_id, ins_id, email from users limit ${(currentPage - 1) * pageSize},${pageSize}`
    const sql1 = `select id, username, role_name, ins_name, email 
                    from users,roles,institutions 
                    where users.role_id=roles.role_id 
                    and users.ins_id=institutions.ins_id
                    and users.isDelete=0`
    // 查询用户总数
    const sql2 = `select count(*) as total from users`
    
    // 调用db.query()执行 SQL 语句
    db.query(sql1,(err,results) => {
        // 执行SQL语句失败
        if(err) return res.cc(err)
        if (results.length === 0) return res.cc('当前页数据获取失败！')
        // 用户信息获取成功
        res.send({
            status: 0,
            msg:'获取用户信息成功！',
            data: results,
        })
    })
}

// 获取用户基本信息的处理函数
exports.getUserInfo = (req,res) => {
    // 定义查询用户信息的 SQL 语句
    const sql = `select id, username, users.role_id, role_name, users.ins_id, ins_name, email from users,roles,institutions where id=? and users.role_id=roles.role_id and users.ins_id=institutions.ins_id`
    const {query} = url.parse(req.url,true)
    // console.log(query.id);
    // 调用db.query()执行 SQL 语句
    db.query(sql, query.id, (err,results) => {
        // 执行 SQL 语句失败
        if(err) return res.cc(err)
        // 执行 SQL 语句成功，但查询结果可能为空
        if(results.length !== 1) return res.cc('获取用户信息失败！')

        // 用户信息获取成功
        res.send({
            status: 0,
            msg:'获取用户信息成功！',
            data: results[0],
        })
    })
}

// 更新用户个人基本信息的处理函数
exports.updateUserInfo = (req,res) => {
    console.log('执行更新用户处理函数');
    // 定义待执行的SQL语句
    const sql = `update users set ? where id=?`
    // 调用db.query()执行SQL语句并传递参数
    db.query(sql,[req.body, req.body.id],(err,results) => {
        // console.log(req.body);
        // 执行SQL 语句失败
        if(err) return res.cc(err)
        // 执行SQL 语句成功，但影响行数不为1
        if(results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')
        // 修改用户信息成功
        return res.cc('修改用户基本信息成功！', 0)
    })
}

// 删除用户信息
exports.deleteUserById = (req,res) => {
    // console.log('执行删除用户处理函数');
    const sql = `update users set isDelete=1 where id=?`
    db.query(sql,req.params.id,(err,results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('删除用户失败！')
        return res.cc('删除用户成功！', 0)
    })
}

// 关键字搜索用户
exports.searchUser = (req,res) => {
    let mysql = require('mysql');
    const sql = `select * from users,roles,institutions 
                    where users.role_id=roles.role_id 
                    and users.ins_id=institutions.ins_id 
                    and concat(id,username,role_name,ins_name) like `
                    +mysql.escape(`%`+req.params.key+`%`)
    const sql2 = `select * from users where concat_ws("",id,username) like `+mysql.escape(`%`+req.params.key+`%`)
    // key:前端搜索框传来的关键字
    db.query(sql,req.params.key,(err,results) => {
        if(err) return res.cc(err)
        // if (results.length === 0) return res.cc('当前搜索数据获取失败！')
        res.send({
            status: 0,
            msg:'搜索用户信息成功！',
            data: results,
        })
    })
}

// 更新用户密码的处理函数
exports.updatePwd = (req,res) =>{
    // 根据id查询用户的信息
    const sql = `select * from users where id=?`
    // 执行根据id查询用户的信息的SQL语句
    db.query(sql,req.user.id,(err,results) => {
        // 执行SQL 语句失败
        if(err) return res.cc(err)
        // 判断结果是否存在
        if(results.length !== 1) return res.cc('用户不存在！')

        // 判断用户输入的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].pwd)
        if(!compareResult) return res.cc('旧密码错误！')

        // 定义更新密码的SQL 语句
        const sql = `update users set pwd=? where id=?`
        // 对新密码进行加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        // 调用db.query()执行SQL 语句
        db.query(sql, [newPwd,req.user.id], (err,results) => {
            // 执行sql 语句失败
            if(err) return res.cc(err)
            // 判断影响的行数
            if(results.affectedRows !== 1) return res.cc('更新密码失败！')
            // 成功
            res.cc('更新密码成功', 0)
        })
        
    })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req,res) => {
    // 1.定义更新头像的SQL 语句
    const sql = `update users set user_pic=? where id=?`
    // 2.调用db.query() 执行SQL 语句
    db.query(sql,[req.body.avatar,req.user.id],(err,results) =>{
        // 执行 SQL 语句失败
        if(err) return res.cc(err)
        // 影响的行数是否等于1
        if(results.affectedRows !== 1) return res.cc('更换头像失败！')
        // 成功
        res.cc('更换头像成功！',0)
    })
}