<template>
  <div>
    <!-- 面包屑导航区 -->
    <div class="breadcrumb">
        <div class="back">
            <el-button
                    icon="el-icon-arrow-left"
                    size="mini"
                    circle
                    @click="goback"
            ></el-button>
        </div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>课程列表</el-breadcrumb-item>
            <el-breadcrumb-item>课程详情</el-breadcrumb-item>
            <el-breadcrumb-item>直播观看</el-breadcrumb-item>
        </el-breadcrumb>
    </div>

    <video id="videoElement" class="centeredVideo" controls autoplay="autoplay" width="1024" height="576">
        Your browser is too old which doesn't support HTML5 video.
    </video>

    <div class="controls">
        <!--<button onclick="flv_load()">加载</button>-->
        <!-- <button onclick="flv_start()">开始</button>
        <button onclick="flv_pause()">暂停</button>
        <button onclick="flv_destroy()">停止</button> -->
        <!-- <input style="width:100px" type="text" name="seekpoint" />
        <button onclick="flv_seekto()">跳转</button> -->
    </div>
  </div>
</template>

<script>
import flvjs from 'flv.js'
export default {
  data () {
    return {
      arr_id: 6,
      // 串流秘钥
      key: ''
    }
  },
  mounted () {
    this.getKey()
  },
  methods: {
    async getKey () {
      const { data: res } = await this.$http.get('rec/getKey/' + this.arr_id)
      // console.log(res)
      if (res.status !== 0) {
        return this.$message.error('查询计划直播地址失败')
      }
      this.key = res.data.bro_src
      console.log(this.key)
      var url = 'http://127.0.0.1:88/flv?port=4936&app=' + 'myapp' + '&stream=' + this.key
      console.log(url)
      var player = document.getElementById('videoElement')
      if (flvjs.isSupported()) {
        var flvPlayer = flvjs.createPlayer({
          type: 'flv',
          enableWorker: true, // 浏览器端开启flv.js的worker,多进程运行flv.js
          isLive: true, // 直播模式
          hasAudio: true, // 关闭音频
          hasVideo: true,
          stashInitialSize: 128,
          enableStashBuffer: false, // 播放flv时，设置是否启用播放缓存，只在直播起作用。
          url: url
        })
        flvPlayer.attachMediaElement(player)
        flvPlayer.load() // 加载
        flvPlayer.play()
      // setInterval(()=>{
      //     sync(player)
      // },5000);
      }
    },
    async (player) {
      if (!player.buffered.length) {
        return
      }
      var end = player.buffered.end(0)
      var diff = end - player.currentTime
      if (diff >= 4) {
        console.log('进行时延校正')
        player.currentTime = end
      }
    },

    flv_start () {
      player.play()
    },

    flv_pause () {
      player.pause()
    },

    flv_destroy () {
      player.pause()
      player.unload()
      player.detachMediaElement()
      player.destroy()
      player = null
    },

    flv_seekto () {
      player.currentTime = parseFloat(document.getElementsByName('seekpoint')[0].value)
    },
    goback () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.breadcrumb{
        display: flex;
        background-color: #EAEDF1;
        margin: 0;
    }
.mainContainer {
    display: block;
    width: 1024px;
    margin-left: auto;
    margin-right: auto;
}

.urlInput {
    display: block;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 8px;
    margin-bottom: 8px;
}

.centeredVideo {
    display: block;
    width: 100%;
    height: 576px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: auto;
}

.controls {
    display: block;
    width: 100%;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
}
</style>
