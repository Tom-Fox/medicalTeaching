import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'

import Login from '../appComps/login.vue'
import Home from '../appComps/home.vue'
// 导入全局样式表
import '../assets/css/global.css'

import welcome from "../appComps/Welcome/welcome"

import users from '../appComps/User/users'

import lessons from '../appComps/Lesson/lessons'
import lessonDetail from "../appComps/Lesson/lessonDetail";
import lesResrc from "../appComps/Lesson/lesResrc";
import videoShow from "../appComps/Tabs/videoShow";

import professors from '../appComps/Professor/professors'
import proDetial from "../appComps/Professor/proDetial";
import proAdd from "../appComps/Professor/proAdd";

import orders from '../appComps/Order/orders'
import arrangements from '../appComps/Arrangement/arrangements'
import arrDetail from "../appComps/Arrangement/arrDetail";

import monitor from '../appComps/Monitor/monitor'

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },
    {
        path: '/login',
        name: 'login',
        component: Login
    },{
        path: '/home',
        name: 'home',
        component: Home,
        //重定向
        redirect: '/welcome',
        //子路由，在home嵌套显示welcome组件
        children:[
            {path:'/welcome', component: welcome},

            {path: '/users', component: users},
            {path: '/lessons', component: lessons},
            {path: '/lessonDetail', component: lessonDetail},
            {path: '/lesResrc', component: lesResrc},
            {path: '/videoShow', component: videoShow},

            {path: '/professors', component: professors},
            {path: '/proDetail', component: proDetial},
            {path: '/proAdd', component: proAdd},

            {path: '/arrangements', component: arrangements},
            {path: '/arrDetail', component: arrDetail},
            
            {path: '/monitor', component: monitor},
            {path: '/orders', component: orders},
        ]
    }
]

const router = new VueRouter({
    routes,
    mode: "history"
})

//挂载路由导航守卫
router.beforeEach((to,from,next) => {
//    to 将要访问的路径
//    from 从哪个路径跳转而来
//    next 函数，表示放行
//    next() 放行  next('/login') 强制跳转

    if(to.path ==='/login') return next();
//    获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();
})

export default router