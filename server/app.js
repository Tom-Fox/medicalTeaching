// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()
const multer = express('multer')
const joi = require('joi')

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

// 配置解析表单数据的中间件，只能解析application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))

// 一定要在路由之前封装 res.cc 函数
app.use((req,res,next) => {
    // status 默认为1，表失败
    // err 的值，可能是一个错误对象，可以是一个错误的描述字符串
    res.cc = function(err ,status =1) {
        res.send({
            status,
            msg: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 一定要在路由前配置解析 token 的中间件
const expressJWT =  require('express-jwt')
const config = require('./config')

app.use(expressJWT({secret: config.jwtSecretKey}).unless({path: [/^\/api/]}))


// 导入并使用路由模块
const userRouter =  require('./router/user')
app.use('/api',userRouter)
// 导入并使用用户信息的路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my',userinfoRouter)
// 导入并使用专家信息的路由模块
const expertRouter = require('./router/expert')
app.use('/exp',expertRouter)
// 导入并使用课程信息的路由模块
const lessonRouter = require('./router/lesson')
app.use('/les',lessonRouter)
// 导入并使用计划信息的路由模块
const arrangeRouter = require('./router/arrange')
app.use('/arr',arrangeRouter)
// 导入并使用订阅信息的路由模块
const orderRouter = require('./router/order')
app.use('/ord',orderRouter)

// 导入并使用录制的路由模块
const recordRouter = require('./router/record')
app.use('/rec',recordRouter)


// 导入并使用播放端计划信息的路由模块
const myarrRouter = require('./router/myarrange')
app.use('/myarr',myarrRouter)

// 验证失败错误中间件
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 身份认证失败的错误
    if(err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知错误
    res.cc(err)
  })


// 调用app.listen 方法，指定端口号并启动 web 服务器
app.listen(3007,() => {
    console.log('api server running at http://127.0.0.1:3007')
})