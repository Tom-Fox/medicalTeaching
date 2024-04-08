<template>
    <div class="video">
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
                <el-breadcrumb-item>视频资源</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <video ref="myVideo" @canplay="getTotal" @timeupdate="timeUpdate">
<!--            <source src="https://video.pearvideo.com/mp4/adshort/20200103/cont-1638717-14760593_adpkg-ad_hd.mp4" />-->
            <source :src="src" />
        </video>
<!--        <transition name="animation" appear>-->
            <div class="controls">
                <div class="con_left">
                    <!--播放与暂停-->
                    <span class="icon_play3" @click="togglePlay">
                    <i :class="{'fa fa-play':!isPlay,'fa fa-pause':isPlay}" aria-hidden="true"></i>
                </span>
                    <!--停止-->
                    <span class="icon_stop2" @click="stopPlay">
                    <i class="fa fa-stop" aria-hidden="true"></i>
                </span>
                    <!--播放时间/总时长-->
                    <span>{{currentTime}}/{{totalTime}}</span>
                </div>
                <div class="con_right">
                    <!--声音-->
                    <span class="icon_volume_low" @click="toggleMuted">
                    <i :class="{'fa fa-volume-down':!isMuted,'fa fa-volume-off':isMuted}" aria-hidden="true"></i>
                </span>
                    <!--全屏-->
                    <span class="icon_loop" @click="toggleFullScreen">
                    <i class="fa fa-expand" aria-hidden="true"></i>
                        <!--                    <i class="fa fa-compress" aria-hidden="true"></i> -->
                </span>
                </div>
            </div>
<!--        </transition>-->

<!--        <div id="div1" style="background-color:#3a87ad;height: 500px;width: 500px;" @mouseenter="mEnter" @mouseout="mOut">-->
<!--            点我-->
<!--        </div>-->
    </div>
 </template>

<script>
    export default {
        data () {
            return {
                myVideo:null,
                //标记当前播放状态
                isPlay:false,
            //    标记当前视频是否静音
                isMuted:false,
            //    当前播放时间
                currentTime:'00:00:00',
            //    总时长
                totalTime:'00:00:00'
            }
        },
        mounted() {
        //    获取播放器元素
            this.myVideo = this.$refs.myVideo
        },
        methods:{
            mEnter(){
                var oDiv=document.getElementById("div1");
                // if (oDiv.classList.contains('play-first')) {

                // } else {
                    oDiv.className = 'play-first';
                // }

            },
            mOut(){
                var oDiv=document.getElementById("div1")
                oDiv.className = 'play-second';
            },
            //播放与暂停
            togglePlay(){
            //    视频标签video原生方法中，
            //    play()：让视频播放
            //    pause():让视频暂停
            //    修改当前的播放状态
                this.isPlay = !this.isPlay
                if(this.isPlay){
                    this.myVideo.play()
                }else {
                    this.myVideo.pause()
                }
            },

        //    停止播放
            stopPlay(){
                this.myVideo.pause()
            //    currentTime属性用来标记当前视频播放到的时间，以秒为单位
                this.myVideo.currentTime = 0
            //    重置播放状态为初始
                this.isPlay = false
            },

        //    时间格式化处理
            timeFormat(time){
                let hour = Math.floor(time / 3600);
                let minute = Math.floor((time % 3600) / 60);
                let second = Math.floor(time % 60);
                hour = hour < 10 ? "0" + hour : hour ;
                minute = minute < 10 ? "0" + minute : minute;
                second = second < 10 ? "0" + second : second;
                return `${hour}:${minute}:${second}`;
            },

        //    获取总时长
            getTotal(){
                // console.log(this.myVideo.duration);
                this.totalTime = this.timeFormat(this.myVideo.duration)
            },
        //    获取当前视频播放时间
            timeUpdate(){
                this.currentTime = this.timeFormat(this.myVideo.currentTime)
            },

        //    静音操作
            toggleMuted(){
                this.isMuted = !this.isMuted
                this.myVideo.muted = !this.myVideo.muted
            },
            //    全屏切换
            toggleFullScreen(){
                //    若当前是全屏状态，就退出全屏，否则进入全屏状态
                //    获取当前的全屏状态
                let isFullscreen = !(document.webkitIsFullScreen || document.fullscreenEnabled);
                console.log(isFullscreen);
                if (!isFullscreen) {
                    const inFun = this.myVideo.requestFullscreen || this.myVideo.webkitRequestFullScreen;
                    //    让当前整个播放器进入全屏
                    inFun.call(this.myVideo);
                }else{
                    const exitFun = document.exitFullscreen || document.webkitIsFullScreen;
                    //    退出全屏状态需要使用document
                    exitFun.call(document);
                }
            },
            goback(){
                this.$router.go(-1)
            },
        },


        //定义props属性，用于接收父组件所传来的数据
        props:['src']
    }
</script>

<style lang="less" scoped>
.video{
    position: relative;
    .breadcrumb{
        display: flex;
        background-color: #EAEDF1;
        margin: 0;
    }
    video{
        width: 100%;
        height: 100%;
    }

    .controls{
        width: 100%;
        height: 40px;
        position: absolute;
        bottom: 0;
        left: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: space-between;
        align-items: center;
        span{
            padding: 0 5px;
            color: #fff;
        }
    }
}

#div1 {
    position: fixed;
    left: 35%;
    top: 32%;
    width: 95px;
    height: 70px;
    background: rgb(221, 221, 221);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    font-weight: 700;
    color: rgb(136, 136, 136);
    opacity: 0;
    border-radius: 10px;
}

.animation-enter-active {
    animation: aaa 2.5s ;
}
.animation-leave-active {
    animation: aaa 2.5s reverse;
}

@keyframes aaa
{
    0%   {opacity:0;}
    40%  {opacity:0.75;}
    100% {opacity:0;}
}

@-webkit-keyframes aaa /* Safari and Chrome */
{
    0%   {opacity:0;}
    40%  {opacity:0.75;}
    100% {opacity:0;}
}

</style>