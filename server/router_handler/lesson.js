const db = require('../db/index')

// 获取所有课程信息
exports.getLessonList = (req,res) => {
    // 查询数据库得到当前页数据
    const sql1 = `select les_id, les_name, dept_name, exp_name 
                    from lessons,experts,departments 
                    where lessons.exp_id=experts.exp_id 
                    and experts.dept_id=departments.dept_id
                    and lessons.isDelete=0`
    // 查询课程总数
    const sql2 = `select count(*) as total from users`
    
    // 调用db.query()执行 SQL 语句
    db.query(sql1,(err,results) => {
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

// 根据用户id获取课程信息
exports.getLesListById = (req,res) => {
    // console.log(req.body);
    const sql = `select orders.les_id, les_name, dept_name, exp_name 
                    from orders,lessons,experts,departments 
                    where orders.les_id = lessons.les_id 
                    and lessons.exp_id = experts.exp_id 
                    and experts.dept_id=departments.dept_id 
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

// 获取课程信息的处理函数
exports.getLesInfo = (req,res) => {
    // 定义查询课程信息的 SQL 语句
    const sql = `select * from lessons,experts,departments 
                    where les_id=? 
                    and experts.dept_id=departments.dept_id 
                    and lessons.exp_id=experts.exp_id`
    // 调用db.query()执行 SQL 语句
    db.query(sql, req.params.les_id, (err,results) => {
        // 执行 SQL 语句失败
        if(err) return res.cc(err)
        // 执行 SQL 语句成功，但查询结果可能为空
        if(results.length !== 1) return res.cc('获取课程信息失败！')

        // 课程信息获取成功
        res.send({
            status: 0,
            msg:'获取课程信息成功！',
            data: results[0],
        })
    })
}

// 添加新课程的处理函数
exports.newLesson = (req,res) => {
    // 获取客户端提交到服务器的课程信息
    const lesinfo = req.body
    console.log(lesinfo)
    // 对表单数据进行合法性校验

    // 定义 sql 语句，查询课程名是否被占用
    const sqlStr = 'select * from lessons where les_name=?'
    db.query(sqlStr,lesinfo.les_name,(err,results) => {
        // 执行 sql 语句失败
        if(err) return res.cc(err)
        // 判断课程是否已被登记
        if(results.length > 0) {
            return res.cc('已有该课程')
        }

        // 定义插入新课程的 SQL 语句
        const sql = 'insert into lessons set ?'
        // 调用 db.query() 执行 SQL 语句
        db.query(sql,
            {
                les_name:lesinfo.les_name,
                exp_id:lesinfo.exp_id,
                introduction:lesinfo.introduction,
            },(err,results) => {
                // 判断 SQL 语句是否执行成功
                if(err) 
                    return res.cc(err)
                // 判断影响行数是否为1
                if(results.affectedRows !== 1) 
                    return res.cc('添加课程失败，请稍后再试！')
                // 注册课程成功
                res.cc('添加成功！',0)
            })
    })
}

// 更新课程基本信息的处理函数
exports.updateLesInfo = (req,res) => {
    // console.log('执行更新课程信息处理函数');
    // 定义待执行的SQL语句
    const sql = `update lessons set ? where les_id=?`
    // 调用db.query()执行SQL语句并传递参数
    db.query(sql,[req.body, req.body.les_id],(err,results) => {
        // console.log(req.body);
        // 执行SQL 语句失败
        if(err) return res.cc(err)
        // 执行SQL 语句成功，但影响行数不为1
        if(results.affectedRows !== 1) return res.cc('修改课程信息失败！')
        // 修改课程信息成功
        return res.cc('修改课程信息成功！', 0)
    })
}

// 删除课程信息
exports.deleteLesById = (req,res) => {
    // console.log('执行删除课程处理函数');
    const sql = `update lessons set isDelete=1 where les_id=?`
    db.query(sql,req.params.les_id,(err,results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('删除课程失败！')
        return res.cc('删除课程成功！', 0)
    })
}

// 关键字搜索课程
exports.searchLes = (req,res) => {
    let mysql = require('mysql');
    const sql = `select les_id, les_name, dept_name, exp_name 
                    from lessons,experts,departments 
                    where lessons.exp_id=experts.exp_id 
                    and experts.dept_id=departments.dept_id 
                    and lessons.isDelete=0 
                    and concat(les_id,les_name,dept_name,exp_name) like `
                    +mysql.escape(`%`+req.params.key+`%`)
    // key:前端搜索框传来的关键字
    db.query(sql,req.params.key,(err,results) => {
        if(err) return res.cc(err)
        // if (results.length === 0) return res.cc('当前搜索数据获取失败！')
        res.send({
            status: 0,
            msg:'搜索课程信息成功！',
            data: results,
        })
    })
}