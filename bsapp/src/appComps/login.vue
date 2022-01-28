<template>
    <div class="loginPage">        
        <div class="divTitle">
            斗鸡视频管理系统
        </div>
        <div class="divData">
            <div class="divRow">                    
                <div class="divLabel">
                    用户名
                </div>
                <div class="divEditor">
                    <el-input v-model="userCode" placeholder="请输入用户名"></el-input>
                </div> 
            </div>
            <div class="divRow">                    
                <div class="divLabel">
                    密码
                </div>
                <div class="divEditor">
                    <el-input v-model="userPwd" type="password" placeholder="请输入密码"></el-input>
                </div> 
            </div>
            <div class="divBtns">      
                <el-button type="text">忘记密码</el-button>
                <el-button type="primary">登录系统</el-button>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        data(){
            return {
                userCode:"admin",
                userPwd:""
            };
        }
    }
</script>

<style lang="less" scoped>
    .loginPage{
        width:400px;
        position: absolute;
        background-color: #fff;
        left: 50%;
        top: 50%;
        transform: translate(-50% , -50%);

        .divTitle{
            font-size: 1.2em;
            font-weight: bold;
            padding: 15px;
            border-bottom: 1px solid #eee;
            border-left:2px solid #062579;
        }

        .divData{
            padding: 15px;

            .divRow{
                display: flex;
                padding: 10px 0px;
                align-items: center;
                .divLabel{
                    width: 100px;
                    padding-right: 10px;
                    text-align: right;
                }
            }

            .divBtns{
                padding-top: 15px;
                display: flex;
                justify-content: space-between;
            }
        }
    }
</style>