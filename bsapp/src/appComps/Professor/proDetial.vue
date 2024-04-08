<template>
    <div>
        <div class="bread">
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
                <el-breadcrumb-item>专家库</el-breadcrumb-item>
                <el-breadcrumb-item>专家详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="table">
            <el-descriptions
                    class="margin-top"
                    :column="1"
                    border
                    :key="new Date().getTime()"
            >
                <template slot="title">

                </template>
                <el-descriptions-item label="专家id">{{detail.exp_id}}</el-descriptions-item>
                <el-descriptions-item label="专家姓名">{{detail.exp_name}}</el-descriptions-item>
                <el-descriptions-item label="所属部门">{{detail.dept_name}}</el-descriptions-item>
                <el-descriptions-item label="职位">{{detail.position}}</el-descriptions-item>

                <el-descriptions-item label="教授课程">
                    <el-row>胸心外科单孔胸腔镜手术</el-row>
                    <el-row>CT 引导下活检</el-row>
                    <el-row>支气管镜检查</el-row>
                    <el-row>超声引导下的胸腔穿刺术</el-row>

                </el-descriptions-item>
            </el-descriptions>

        </div>

    </div>

</template>

<script>
    import bus from "../../assets/comm/eventBus";
    export default {
        data(){
            return{
                detail:{
                    exp_id:'',
                    exp_name:'',
                    dept_name:'',
                    position:''
                }
            }
        },
        created(){
            // console.log('创建detail页面')
            // 调用 bus.on()方法注册一个自定义事件，通过实践处理函数的形参接收数据
            // bus.on('getDetail',(detail) => {
            //     this.detail = detail
            //     console.log(this.detail);
            // });
            bus.$on('getdetail',(detail) => {
                this.detail = detail
                console.log(this.detail)
            })
            
        },
        methods:{
            goback(){
                this.$router.go(-1)
            },
        },
    }
</script>

<style lang="less" scoped>
    .bread{
        display: flex;
        .back{
            margin-right: 20px;
        }
    }
    .table{
        width: 80%;
    }
    .el-descriptions__body{
        background-color: #00c0ef;
    }
    el-descriptions-item{
        /*text-align: center;*/
    }
    .operation{
        padding: 20px;
    }
</style>