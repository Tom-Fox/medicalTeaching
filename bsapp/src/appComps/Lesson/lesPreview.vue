<template>
    <div>
        <el-button @click="wholeWatch">整体预览</el-button>
        <el-button>主视角</el-button>
        <el-button>上视角</el-button>
        <el-button>胸腔镜</el-button>
    </div>
</template>

<script>
    export default {
        methods:{
            wholeWatch(){
                this.$router.push('/lesResrc')
            }
        }
    }
</script>

<style scoped>

</style>