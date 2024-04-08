import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../appComps/login.vue'
import home from '../appComps/home'
// 导入全局样式表
import '../assets/css/global.css'
import lessons from '../appComps/Lesson/lessons'
import lessonDetail from "../appComps/Lesson/lessonDetail";

import arrangements from "../appComps/Arrangement/arrangements";
import arrDetail from "../appComps/Arrangement/arrDetail";

import lesResrc from "../appComps/Arrangement/lesResrc";
import videoShow from "../appComps/Arrangement/videoShow";

import audioCog from "../appComps/Audio/audioCog";
import videoCog from "../appComps/Video/videoCog";

import tempChoice from "../appComps/Temp/tempChoice";

import replay from "../appComps/Replay/replay";
// 导入全局样式表
import '../assets/css/global.css'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  {
      path: '/login',
      name: 'login',
      component: Login
  }, {
  path: '/home',
  component: home,
  // 重定向
  redirect: '/lessons',
  children: [
    {path: '/arrangements', component: arrangements},
    {path: '/arrDetail', component: arrDetail},
    {path: '/lessons', component: lessons},
    {path: '/lessonDetail', component: lessonDetail},
    {path: '/lesResrc', component: lesResrc},
    {path: '/videoShow', component: videoShow},


    {path: '/audioCog', component: audioCog},
    {path: '/videoCog', component: videoCog},
    {path: '/tempChoice', component: tempChoice},

    {path: '/replay', component: replay},
  ]
}
]

const router = new VueRouter({
  routes,
  mode: 'history'
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
