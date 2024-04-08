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
                <el-breadcrumb-item>课程列表</el-breadcrumb-item>
                <el-breadcrumb-item>课程详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="table">
            <el-descriptions
                    class="margin-top"
                    :column="1"
                    border
                    :key="new Date().getTime()"
                    labelStyle="width:80px"
            >
                <template slot="title">

                </template>
                <el-descriptions-item label="课程编号">{{detail.les_id}}</el-descriptions-item>
                <el-descriptions-item label="课程名称">{{detail.les_name}}</el-descriptions-item>
                <el-descriptions-item label="课程类别">{{detail.dept_name}}</el-descriptions-item>
                <el-descriptions-item label="主讲人">{{detail.exp_name}}</el-descriptions-item>
                <el-descriptions-item label="课程简介">{{detail.introduction}}</el-descriptions-item>
                <el-descriptions-item label="开课状态">
                    <el-tag size="small">
                        <!-- {{detail.lessonState}} -->
                        开课中
                    </el-tag>
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script>
    import bus from "../../assets/comm/eventBus";
    import lesPreview from "./lesPreview";
    export default {
        components: {
            'les-preview':lesPreview
        },
        data(){
            return{
                detail:{
                    les_id:'',
                    les_name:'',
                    exp_name:'',
                    dept_name:'',
                    introduction:''
                }
            }
        },
        created() {
            //此处的 pass 与 lesssons 中定义的emit事件一致。
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
        props:{
            // detail:Object
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
</style>