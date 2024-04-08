<template>
    <div class="loginPage">        
        <div class="divTitle">
            国家呼吸研医教协同管理系统
        </div>
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="80px">
            <div class="divData">
                <el-form-item label="用户名" prop="username" class="divEditor">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名">
                    </el-input>
                </el-form-item>

                <el-form-item label="密码" prop="pwd" class="divEditor">
                    <el-input v-model="loginForm.pwd" type="password" placeholder="请输入密码">
                        <i slot="prefix" class="fa fa-lock"></i>
                    </el-input>
                </el-form-item>

                <el-form-item class="divBtns">
                    <el-button type="text">忘记密码</el-button>
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </div>
        </el-form>

    </div>
</template>

<script>
    export default {
        mounted(){
            var me = this;
            try {
                console.log('login is load...');
                var comm = me.comm;
                console.log(comm);
            } catch (error) {
                console.log(error);
            }
        },

        data(){
            return {
                //这是登录表单的数据绑定对象
                loginForm:{
                    username:"admin",
                    pwd:"123"
                },
                //这是表单的验证规则对象
                loginFormRules:{
                    //验证用户名是否合法
                    username:[
                      {required: true, message:'请输入用户名', trigger: 'blur' },
                      { min: 1, max: 10, message: '长度在 1 到 10 个字符之间', trigger: 'blur' }
                    ],
                    //验证密码是否合法
                    pwd:[
                        {required: true, message:'请输入密码', trigger: 'blur' },
                        { min: 3, max: 15, message: '长度在 3 到 15 个字符之间', trigger: 'blur' }
                    ],
                }
            };
        },
        methods:{
            //点击重置按钮，重置登录表单
            resetLoginForm(){
                this.$refs.loginFormRef.resetFields();
            },
            //表单预验证
            login(){
                this.$refs.loginFormRef.validate(async valid => {
                    //若不合法，不发起请求
                    if (!valid) return;
                    // post需要this.$qs.stringify(this.loginForm)
                    const {data:res} = await this.$http.post('api/login',this.$qs.stringify(this.loginForm));
                    console.log(res)
                    if (res.status !== 0) return this.$message.error('登录失败');
                    this.$message.success('登录成功');
                //    1.将登录成功之后的token保存到客户端的sessionStorage
                //      1.1 项目中除了登录之外的其他API接口，必须在登陆之后才能访问
                //      1.2 token只应在网站打开期间生效，所以将token保存在sessionStorage 中
                    window.sessionStorage.setItem("token",res.token);
                //    2.通过编程式导航跳转到后台主页，路由地址是 /home
                    this.$router.push('/home');

                });
            }
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
            .divBtns{
                padding-top: 15px;
                display: flex;
                justify-content: space-between;
            }
        }
    }
</style>