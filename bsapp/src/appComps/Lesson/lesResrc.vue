<template>
    <!-- 如果使用一个组件，那属性值的设置优先设置给子组件中的props属性 -->
    <video-show src="https://video.pearvideo.com/mp4/adshort/20200103/cont-1638717-14760593_adpkg-ad_hd.mp4"></video-show>
</template>

<script>
    import videoShow from "../Tabs/videoShow";
    export default {
        components:{
            videoShow
        }
    }
</script>

<style scoped>

</style>