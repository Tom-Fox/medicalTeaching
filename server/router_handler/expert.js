const db = require('../db/index')

// 获取所有专家信息
exports.getAllExpInfo = (req,res) => {
    // 查询数据库得到当前页数据
    // const sql1 = `select id, username, role_id, ins_id, email from users limit ${(currentPage - 1) * pageSize},${pageSize}`
    const sql1 = `select exp_id, exp_name, dept_name, position
                    from experts,departments 
                    where experts.dept_id=departments.dept_id
                    and experts.isDelete=0`
    // 查询用户总数
    const sql2 = `select count(*) as total from users`
    
    // 调用db.query()执行 SQL 语句
    db.query(sql1,(err,results) => {
        // 执行SQL语句失败
        if(err) return res.cc(err)
        if (results.length === 0) return res.cc('当前页专家列表数据获取失败！')
        // 用户信息获取成功
        res.send({
            status: 0,
            msg:'获取专家列表成功！',
            data: results,
        })
    })
}

// 获取专家简易列表
exports.getExpertList = (req,res) => {
    // 查询数据库得到当前页数据
    // const sql1 = `select id, username, role_id, ins_id, email from users limit ${(currentPage - 1) * pageSize},${pageSize}`
    const sql1 = `select exp_id, exp_name from experts where experts.isDelete=0`
    // 调用db.query()执行 SQL 语句
    db.query(sql1,(err,results) => {
        // 执行SQL语句失败
        if(err) return res.cc(err)
        if (results.length === 0) return res.cc('当前页专家列表获取失败！')
        // 用户信息获取成功
        res.send({
            status: 0,
            msg:'获取专家列表成功！',
            data: results,
        })
    })
}

// 获取专家信息的处理函数
exports.getExpInfo = (req,res) => {
    // 定义查询用户信息的 SQL 语句
    const sql = `select * from experts,departments where exp_id=? and experts.dept_id=departments.dept_id`
    // const {query} = url.parse(req.url,true)
    // 调用db.query()执行 SQL 语句
    db.query(sql, req.params.exp_id, (err,results) => {
        // 执行 SQL 语句失败
        if(err) return res.cc(err)
        // 执行 SQL 语句成功，但查询结果可能为空
        if(results.length !== 1) return res.cc('获取专家信息失败！')

        // 专家信息获取成功
        res.send({
            status: 0,
            msg:'获取专家信息成功！',
            data: results[0],
        })
    })
}

// 添加新专家的处理函数
exports.newExpert = (req,res) => {
    // 获取客户端提交到服务器的用户信息
    const expinfo = req.body
    console.log(expinfo)
    // 对表单数据进行合法性校验

    // 定义 sql 语句，查询用户名是否被占用
    const sqlStr = 'select * from experts where exp_name=?'
    db.query(sqlStr,expinfo.exp_name,(err,results) => {
        // 执行 sql 语句失败
        if(err) return res.cc(err)
        // 判断专家是否已被登记
        if(results.length > 0) {
            return res.cc('已有该专家')
        }

        // 定义插入新用户的 SQL 语句
        const sql = 'insert into experts set ?'
        // 调用 db.query() 执行 SQL 语句
        db.query(sql,
            {
                exp_name:expinfo.exp_name,
                dept_id:expinfo.dept_id,
                position:expinfo.position,
            },(err,results) => {
                // 判断 SQL 语句是否执行成功
                if(err) 
                    return res.cc(err)
                // 判断影响行数是否为1
                if(results.affectedRows !== 1) 
                    return res.cc('添加专家失败，请稍后再试！')
                // 注册用户成功
                res.cc('添加成功！',0)
            })
    })
}

// 更新专家基本信息的处理函数
exports.updateExpInfo = (req,res) => {
    // console.log('执行更新专家信息处理函数');
    // 定义待执行的SQL语句
    const sql = `update experts set ? where exp_id=?`
    // 调用db.query()执行SQL语句并传递参数
    db.query(sql,[req.body, req.body.exp_id],(err,results) => {
        // console.log(req.body);
        // 执行SQL 语句失败
        if(err) return res.cc(err)
        // 执行SQL 语句成功，但影响行数不为1
        if(results.affectedRows !== 1) return res.cc('修改专家信息失败！')
        // 修改用户信息成功
        return res.cc('修改专家信息成功！', 0)
    })
}

// 删除专家信息
exports.deleteExpById = (req,res) => {
    // console.log('执行删除专家处理函数');
    const sql = `update experts set isDelete=1 where exp_id=?`
    db.query(sql,req.params.exp_id,(err,results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('删除专家失败！')
        return res.cc('删除专家成功！', 0)
    })
}

// 关键字搜索专家
exports.searchExp = (req,res) => {
    let mysql = require('mysql');
    const sql = `select * from experts,departments 
                    where experts.dept_id=departments.dept_id 
                    and experts.isDelete=0 
                    and concat(exp_id,exp_name,dept_name,position) like `
                    +mysql.escape(`%`+req.params.key+`%`)
    // key:前端搜索框传来的关键字
    db.query(sql,req.params.key,(err,results) => {
        if(err) return res.cc(err)
        // if (results.length === 0) return res.cc('当前搜索数据获取失败！')
        res.send({
            status: 0,
            msg:'搜索专家信息成功！',
            data: results,
        })
    })
}