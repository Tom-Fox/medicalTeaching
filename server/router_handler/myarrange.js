const fs = require('fs')
const db = require('../db/index')

// 获取课件列表
exports.getCowList = (req,res) => {
    // 查询数据库得到当前页数据
    const sql = `select cow_name from coursewares where arr_id=?`
    // console.log(req.params.arr_id);
    // 调用db.query()执行 SQL 语句
    db.query(sql,req.params.arr_id,(err,results) => {
        // 执行SQL语句失败
        if(err) return res.cc(err)
        if (results.length === 0) return res.cc('当前页课件列表未获取到课件信息！')
        // 用户信息获取成功
        res.send({
            status: 0,
            msg:'获取计划列表成功！',
            data: results,
        })
    })
}

// 根据用户id获取计划列表:更新的计划显示不全
exports.getarrListById = (req,res) => {
    const sql = `select * from orders,lessons,experts,arrangements,progress 
                    where orders.les_id = lessons.les_id=arrangements.les_id 
                    and lessons.exp_id = experts.exp_id 
                    and arrangements.pro_id=progress.pro_id 
                    and user_id=?`
    // 调用db.query()执行 SQL 语句
    db.query(sql,req.user.id,(err,results) => {
        // 执行SQL语句失败
        if(err) return res.cc(err)
        if (results.length === 0) return res.cc('当前页课程列表数据获取失败！')
        // 课程信息获取成功
        res.send({
            status: 0,
            msg:'获取课程列表成功！',
            data: results,
        })
    })
}

// 关键字搜索计划
exports.searchArr = (req,res) => {
    let mysql = require('mysql');
    const sql = `select * from arrangements,lessons,experts,progress,orders 
                    where orders.les_id=arrangements.les_id=lessons.les_id
                    and lessons.exp_id=experts.exp_id
                    and arrangements.isDelete=0 
                    and arrangements.pro_id=progress.pro_id 
                    and user_id=? 
                    and concat(les_name,exp_name,date,time,pro_name) like `
                    +mysql.escape(`%`+req.params.key+`%`)
    // key:前端搜索框传来的关键字
    db.query(sql,[req.user.id,req.params.key],(err,results) => {
        if(err) return res.cc(err)
        // if (results.length === 0) return res.cc('当前搜索数据获取失败！')
        res.send({
            status: 0,
            msg:'搜索计划信息成功！',
            data: results,
        })
    })
}

// 单文件下载
exports.downloadSrc = (req,res) => {
    console.log(req.query);
    req.query.url ? res.download(`upload/${req.query.url}`) : res.send({
        success: false
    })
    console.log(res);
}