<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <!-- 侧边栏菜单区域 -->
      <el-menu
        background-color="#333744"
        text-color="#fff"
        active-text-color="#ffd04b"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        :default-active="activePath"
      >
        <el-menu-item index="/lessons">
          <i class="fa fa-home"></i>
          <span slot="title">我的课程</span>
        </el-menu-item>
        <el-menu-item index="/arrangements">
          <i class="fa fa-bars"></i>
          <span slot="title">我的课程计划</span>
        </el-menu-item>
        <el-menu-item index="/replay">
          <i class="fa fa-area-chart"></i>
          <span slot="title">点播回放</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 页面主体区域 -->

    <el-container>
      <!--头部区域-->
      <el-header>
        <div>
          <span>国家呼吸研医教协同播放系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>

      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 是否折叠
      isCollapse: false,
      //  被激活的链接地址
      activePath: ''
    }
  },
  created () {
    // this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //  获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    //    保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  el-aside{
    position: fixed;
    z-index: 1000;
  }
  i{
    padding: 10px;
  }

  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    div {
      align-items: center;
    }
  }

  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right: none;
    }
  }

  .el-main{
    background-color: #EAEDF1;
  }

  .toggle-button{
    background-color: #4a5064;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
