const fs = require('fs')
const db = require('../db/index')

// 获取所有计划信息
exports.getAllArrInfo = (req,res) => {
    // 查询数据库得到当前页数据
    // const sql1 = `select id, username, role_id, ins_id, email from users limit ${(currentPage - 1) * pageSize},${pageSize}`
    const sql1 = `select * from arrangements,lessons,experts,progress 
                    where arrangements.les_id=lessons.les_id
                    and lessons.exp_id=experts.exp_id
                    and arrangements.pro_id=progress.pro_id
                    and arrangements.isDelete=0`
    // 查询用户总数
    const sql2 = `select count(*) as total from users`
    
    // 调用db.query()执行 SQL 语句
    db.query(sql1,(err,results) => {
        // 执行SQL语句失败
        if(err) return res.cc(err)
        if (results.length === 0) return res.cc('当前页计划列表数据获取失败！')
        // 用户信息获取成功
        res.send({
            status: 0,
            msg:'获取计划列表成功！',
            data: results,
        })
    })
}

// 获取修改计划框显示信息的处理函数
exports.getArrInfo = (req,res) => {
    // 定义查询用户信息的 SQL 语句
    const sql = `select arrangements.arr_id,les_name,exp_name,date,time,chapter 
                    from experts,arrangements,lessons 
                    where arr_id=? 
                    and experts.exp_id=lessons.exp_id 
                    and lessons.les_id=arrangements.les_id`
    // const {query} = url.parse(req.url,true)
    // 调用db.query()执行 SQL 语句
    db.query(sql, req.params.arr_id, (err,results) => {
        // 执行 SQL 语句失败
        if(err) return res.cc(err)
        // 执行 SQL 语句成功，但查询结果可能为空
        if(results.length !== 1) return res.cc('获取计划信息失败！')

        // 计划信息获取成功
        res.send({
            status: 0,
            msg:'获取计划信息成功！',
            data: results[0],
        })
    })
}

// 添加新计划的处理函数
exports.newArrange = (req,res) => {
    // 获取客户端提交到服务器的用户信息
    const arrinfo = req.body
    // 定义 sql 语句，查询课程是否已有计划
    const sql1 = `select * from arrangements where les_id=?`
    db.query(sql1,arrinfo.les_id,(err,results) => {
        // 执行 sql 语句失败
        if(err) return res.cc(err)
        // 判断计划是否已安排过计划，并设置章节数+1   
        arrinfo.chapter = results.length+1

        // 定义插入新用户的 SQL 语句
        const sql2 = 'insert into arrangements set ?'
        // 调用 db.query() 执行 SQL 语句
        db.query(sql2,
            {
                les_id:arrinfo.les_id,
                chapter:arrinfo.chapter,
                date:arrinfo.date,
                time:arrinfo.time,
                // chapter:
            },(err,results) => {
                // 判断 SQL 语句是否执行成功
                if(err) 
                    return res.cc(err)
                // 判断影响行数是否为1
                if(results.affectedRows !== 1) 
                    return res.cc('添加计划失败，请稍后再试！')
                // 注册用户成功
                res.cc('添加成功！',0)
            })
    })
}

// 更新计划基本信息（串流密匙、录播地址）的处理函数
exports.updateArrInfo = (req,res) => {
    // console.log('执行更新计划信息处理函数');
    // 定义待执行的SQL语句
    const sql = `update arrangements set ? where arr_id=?`
    // 调用db.query()执行SQL语句并传递参数
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

// 删除计划信息
exports.deleteArrById = (req,res) => {
    // console.log('执行删除计划处理函数');
    const sql = `update experts set isDelete=1 where exp_id=?`
    db.query(sql,req.params.exp_id,(err,results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('删除计划失败！')
        return res.cc('删除计划成功！', 0)
    })
}

// 关键字搜索计划
exports.searchArr = (req,res) => {
    let mysql = require('mysql');
    const sql = `select * from arrangements,lessons,experts,progress 
                    where arrangements.les_id=lessons.les_id
                    and lessons.exp_id=experts.exp_id
                    and arrangements.isDelete=0 
                    and arrangements.pro_id=progress.pro_id 
                    and concat(les_name,exp_name,date,time,pro_name) like `
                    +mysql.escape(`%`+req.params.key+`%`)
    // key:前端搜索框传来的关键字
    db.query(sql,req.params.key,(err,results) => {
        if(err) return res.cc(err)
        // if (results.length === 0) return res.cc('当前搜索数据获取失败！')
        res.send({
            status: 0,
            msg:'搜索计划信息成功！',
            data: results,
        })
    })
}

// 上传单个文件
exports.uploadSrc = (req,res) => {
    console.log(req.file);
    fs.renameSync(req.file.path, `upload/${req.file.originalname}`)
    res.send(req.file)
}

// 多文件上传
exports.uploadArray = (req,res) => {
    const files = req.files
    // console.log(req.files);
    const fileList = []
    const filenameList = []
    console.log(req.body.arr_id)
    for (var i in files) {
        var file = files[i]
        var obj = {arr_id:req.body.arr_id,cow_name:file.originalname}
        fs.renameSync(file.path,`upload/${file.originalname}`)
        file.path = `upload/${file.originalname}`
        fileList.push(file) 
        filenameList.push(obj)
    }
    console.log(filenameList);
    const sql = `insert into coursewares set ?`
        db.query(sql,filenameList,(err,results) => {
                // 判断 SQL 语句是否执行成功
                if(err) return res.cc(err)
                // 注册用户成功
                res.cc('添加文件名成功！',0)
            })
    res.send(fileList)
}

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

// 客户端接口

// 根据用户id获取计划列表
exports.getarrListById = (req,res) => {
    const sql = `select arr_id, les_name, exp_name, chapter, date, time, pro_id 
                    from orders,lessons,experts,arrangements 
                    where orders.les_id = lessons.les_id=arrangements.les_id 
                    and lessons.exp_id = experts.exp_id 
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

// 单文件下载
exports.downloadSrc = (req,res) => {
    console.log(req.query);
    req.query.url ? res.download(`upload/${req.query.url}`) : res.send({
        success: false
    })
    console.log(res);
}