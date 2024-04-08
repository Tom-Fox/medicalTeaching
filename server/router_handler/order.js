const db = require('../db/index')

// 获取所有客户医院的订阅信息
exports.getOrdList = (req,res) => {
    // 查询数据库得到当前页数据
    const sql1 = `select ord_id, ins_name, les_name  
                    from orders,users,institutions,lessons
                    where orders.user_id=users.id 
                    and users.ins_id=institutions.ins_id 
                    and orders.les_id=lessons.les_id`
    
    // 调用db.query()执行 SQL 语句
    db.query(sql1,(err,results) => {
        // 执行SQL语句失败
        if(err) return res.cc(err)
        if (results.length === 0) return res.cc('当前页订阅列表数据获取失败！')
        // 课程信息获取成功
        res.send({
            status: 0,
            msg:'获取订阅列表成功！',
            data: results,
        })
    })
}

// 添加客户医院的新课程订阅的处理函数
exports.newOrder = (req,res) => {
    // 获取客户端提交到服务器的课程信息
    const ordinfo = req.body
    console.log(ordinfo)
    // 对表单数据进行合法性校验

    // 定义 sql 语句，查询课程名是否被占用
    const sqlStr = 'select * from orders where user_id=? and les_id=?'
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