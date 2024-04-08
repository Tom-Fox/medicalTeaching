<template>
    <div class="welcome">
        <el-row class="home" :gutter="20">
            <el-col :span="8" style="margin-top: 20px">
                <!--个人信息显示卡-->
                <el-card class="profile" shadow="hover">
                    <!-- 头像 -->
                    <div class="user">
                        <img :src="userImg" />
                        <!-- 账号、权限 -->
                        <div class="userInfo">
                            <p class="name">Admin</p>
                            <p class="access">超级管理员</p>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col class="panel" :span="14" style="margin-top: 20px;-webkit-box-shadow:0 0 0 0;
        box-shadow:0 0 0 0;">
                <personal-panel></personal-panel>
            </el-col>
        </el-row>
        <el-row class="home" :gutter="30" justify="space-between">
            <el-col :span="12" style="margin-top: 20px">
                <el-card class="box-card">
                        <pie-chart></pie-chart>
                </el-card>
            </el-col>
            <el-col :span="12" style="margin-top: 20px">
                <el-card class="box-card">
                        <folding-chart></folding-chart>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-card class="table" style="margin-top: 20px;height: 360px;">
                <el-table :data="tableData">
                    <el-table-column
                            show-overflow-tooltip
                            v-for="(val,key) in tableLabel"
                            :key="key"
                            :prop="key"
                            :label="val"
                    >
                    </el-table-column>
                </el-table>
            </el-card>

        </el-row>


    </div>
</template>

<script>
    import pie from './pie'
    import folding from "./folding";
    import personal from "./personal";

    export default {
        data(){
            return {
                userImg: require("../../assets/images/profile1.jpg"),
                tableData: [
                    {
                        name: "肺功能临床诊断",
                        todayBuy:10,
                        monthBuy:30,
                        totalBuy:80,
                    },{
                        name: "肿瘤切除手术",
                        todayBuy:10,
                        monthBuy:40,
                        totalBuy:60,
                    },{
                        name: "化疗/靶向治疗及放射治疗",
                        todayBuy:10,
                        monthBuy:20,
                        totalBuy:100,
                    },{
                        name: "微创肺/胸腔镜手术",
                        todayBuy:10,
                        monthBuy:30,
                        totalBuy:70,
                    },{
                        name: "视频辅助胸腔镜/胸腔镜肺叶切除术",
                        todayBuy:10,
                        monthBuy:30,
                        totalBuy:80,
                    },
                    {
                        name: "气道外科及复杂手术（气管切除及袖状肺叶切除）",
                        todayBuy:10,
                        monthBuy:30,
                        totalBuy:80,
                    },
                ],
                tableLabel:{
                    name:'课程',
                    todayBuy:'今日购买',
                    monthBuy:'本月购买',
                    totalBuy:'总购买',
                },

            }
        },
        mounted(){
            this.$http.get('/user?ID=12345')
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        components:{
            'pie-chart':pie,
            'folding-chart':folding,
            'personal-panel':personal
        }
    }
</script>

<style lang="less" scoped>
    .welcome{
        height: 100%;
    }
    .home {
        /*width: 100%;*/
        .panel{
            background-color:  #EAEDF1;
        }
        .profile {

            .user {
                display: flex;
                align-items: center;


                img {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    margin-right: 40px;
                }

                .userInfo {

                    .name {
                        font-size: 32px;
                        margin-bottom: 10px;
                    }

                    .access {
                        color: #999999;
                    }

                }
            }
            .login-info {

                p {
                    line-height: 28px;
                    font-size: 14px;
                    color: #999;

                    span {
                        color: #666;
                        margin-left: 60px;
                    }

                }
            }
        }
        .pie{
            /*height: 250px;*/
        }
        .num {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;

            .el-card {
                width: 32%;
                margin-bottom: 20px;
            }

            .icon {
                font-size: 30px;
                width: 80px;
                height: 80px;
                text-align: center;
                line-height: 80px;
                color: #fff;
            }

            .detail {
                margin-left: 15px;
                display: flex;
                flex-direction: column;
                justify-content: center;

                .num {
                    font-size: 30px;
                    margin-bottom: 10px;
                }

                .txt {
                    font-size: 14px;
                    text-align: center;
                    color: #999;
                }

            }
        }
        .graph {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;

            .el-card {
                width: 48%;
            }

        }
    }
    .table{
        height:auto
    }
</style>