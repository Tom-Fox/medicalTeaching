const db = require('../db/index')
const fs = require('fs')

// 上传录制视频地址
exports.recLesson = (req,res) => {
    const sql = `update arrangements set ? where arr_id=?`
    db.query(sql,[req.body, req.body.arr_id],(err,results) => {
        console.log(req.body);
        // 执行SQL 语句失败
        if(err) return res.cc(err)
        // 执行SQL 语句成功，但影响行数不为1
        if(results.affectedRows !== 1) return res.cc('修改计划信息失败！')
        // 修改用户信息成功
        return res.cc('修改计划信息成功！', 0)
    })
}

exports.getArrKey = (req,res) => {
    const sql = `select bro_src from arrangements 
                    where arr_id=?`
    db.query(sql,req.params.arr_id, (err,results) => {
        // 执行 SQL 语句失败
        if(err) return res.cc(err)
        // 执行 SQL 语句成功，但查询结果可能为空
        if(results.length !== 1) return res.cc('获取计划信息失败！')
        // 授课计划的串流秘钥获取成功
        res.send({
            status: 0,
            msg:'获取直播地址成功！',
            data: results[0],
        })
    })
}