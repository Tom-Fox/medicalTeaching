<template>
    <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>资源管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
        <!-- 搜索与添加区域 -->
        <div style="margin-top: 15px;">

        </div>
        <el-row :gutter="20">
            <el-col :span="7">
                <el-input
                        placeholder="请输入内容"
                        class="input-with-select"
                        v-model="searchKey"
                        clearable
                        @clear="getUserList"
                >
                    <el-button slot="append" icon="el-icon-search" @click="userSelect"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
            </el-col>
        </el-row>

        <!-- 用户列表区域 -->
        <el-table :data="userlist.slice((queryInfo.pagenum-1)*queryInfo.pagesize,queryInfo.pagenum*queryInfo.pagesize)" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="id" prop="id"></el-table-column>
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="机构" prop="ins_name"></el-table-column>
            <el-table-column label="在线状态">
                <template v-slot="scope">
                    <el-switch v-model="scope.row.mg_state" disabled></el-switch>
                </template>
            </el-table-column>
            <el-table-column width="140px" label="操作">
                <template v-slot="scope">
                    <!-- 修改按钮 -->
                    <el-button
                            type="primary"
                            icon="el-icon-edit"
                            circle
                            size="mini"
                            @click="showEditDialog(scope.row.id)"
                    ></el-button>
                    <!-- 删除按钮 -->
                    <el-button
                            type="danger"
                            icon="el-icon-delete"
                            circle
                            size="mini"
                            @click="removeUserById(scope.row.id)"
                    ></el-button>
                    <!-- 修改密码按钮 -->
                    <el-tooltip effect="dark" content="修改密码" placement="top" :enterable="false">
                        <el-button
                                type="warning"
                                icon="el-icon-setting"
                                circle
                                size="mini"
                        ></el-button>
                    </el-tooltip>

                </template>
            </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="30%"
            @close="addDialogClosed"
    >
        <!-- 内容主体区 -->
        <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-width="70px"
        >
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
                <el-input v-model="addForm.pwd"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="role">
                <el-select v-model="addForm.role_id" placeholder="请选择">
                    <el-option
                    v-for="item in roleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="机构" prop="institution">
                <el-select v-model="addForm.ins_id" placeholder="请选择">
                <el-option
                v-for="item in insOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="addDialogClosed"
    >
        <!-- 内容主体区 -->
        <el-form
                :model="editForm"
                :rules="addFormRules"
                ref="editFormRef"
                label-width="70px">
            <el-form-item label="id">
                <el-input v-model="editForm.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="role_name">
                <el-select 
                    v-model="editForm.role_name" 
                    placeholder="请选择" 
                    @change="roleChange"
                    >
                    <el-option
                        v-for="item in roleOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>            
            </el-form-item>
            <el-form-item label="机构" prop="ins_name">
                <el-select 
                    v-model="editForm.ins_name" 
                    placeholder="请选择"
                    @change="insChange"
                    >
                    <el-option
                    v-for="item in insOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>
            </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
    </el-dialog>
</div>
</template>

<script>
    export default {
        data(){
            //验证邮箱的规则
            var checkEmail = (rule, value, cb) => {
                //验证邮箱的正则表达式
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if (regEmail.test(value)) {
                //    合法的邮箱
                    return cb()
                }
                cb(new Error('请输入合法的邮箱'))
            }
            //验证手机号的规则
            var checkMobile = (rule, value, cb) => {
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if (regMobile.test(value)) {
                    //    合法的手机号
                    return cb()
                }
                cb(new Error('请输入合法的手机号'))
            }

            return{
                // 获取用户列表的参数对象
                queryInfo:{
                    query:'',
                    //当前的页数
                    pagenum:1,
                    //当前每页显示多少条数据
                    pagesize:5
                },
                // 数据库获取的用户列表
                userlist:[],
                // 分页显示的总条数
                total:0,
                //控制添加用户对话框的显示与隐藏
                addDialogVisible:false,
                //添加用户的表单数据
                addForm:{
                    username:'',
                    pwd:'',
                    email:'',
                    role_id: '',
                    ins_id: '',
                },
                //添加表单的验证规则对象
                addFormRules:{
                    username:[
                        {
                            required: true,
                            message:'请输入用户名',
                            trigger: 'blur'
                        },
                        {
                            min:3,
                            max:10,
                            message: '用户名的长度在3~10个字符之间',
                            trigger: 'blur'
                        }
                    ],
                    pwd:[
                        {
                            required: true,
                            message:'请输入密码',
                            trigger: 'blur'
                        },
                        {
                            min:3,
                            max:15,
                            message: '密码的长度在3~15个字符之间',
                            trigger: 'blur'
                        }
                    ],
                    email:[
                        {
                            required: true,
                            message:'请输入邮箱',
                            trigger: 'blur'
                        },
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile:[
                        {
                            required: true,
                            message:'请输入手机号',
                            trigger: 'blur'
                        },
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                },
                //角色选择器内容
                roleOptions: [{
                    value: '2',
                    label: '管理员',
                    }, {
                    value: '3',
                    label: '导播员'
                    }, {
                    value: '4',
                    label: '播放单位'
                    }],
                //绑定的role_id值 
                role_id: '' ,
                //机构选择器内容
                insOptions: [{
                    value: '1',
                    label: '河海大学',
                    }, {
                    value: '2',
                    label: '呼吸研'
                    }, {
                    value: '3',
                    label: '复旦大学附属华山医院'
                    }, {
                    value: '4',
                    label: '北京天坛医院'
                    }, {
                    value: '5',
                    label: '北京同仁医院'
                    }, {
                    value: '6',
                    label: '中南大学湘雅二医院'
                    }, {
                    value: '7',
                    label: '深圳大学总医院'
                    }],
                //绑定的ins_id值 
                ins_id: '' ,
                //控制修改用户对话框的显示与隐藏
                editDialogVisible:false,
                //查询到的用户信息对象
                editForm:{},
                //输入框内容
                searchKey:'',
            }
        },
        // mounted() {
        //     this.getCurrentPageData()
        // },
        created(){
            this.getUserList()
        },
        methods:{
            async getUserList(){
                console.log(this.queryInfo);
                const {data:res} =await this.$http.get('my/userlist',{params: this.queryInfo})
                // console.log(res)
                if (res.status !== 0) {
                    return this.$message.error('获取用户列表失败！')
                }
                this.userlist = res.data
                this.total = res.data.length
            },

            // 分页器改变每页条数
            handleSizeChange(newSize){
                this.queryInfo.pagenum = 1
                this.queryInfo.pagesize = newSize
                // this.getCurrentPageData(1)
                // this.getUserList()
                // console.log(this.pagesize);
            },
            //点击页面号
            handleCurrentChange(newPage){
                // console.log(newPage)
                this.queryInfo.pagenum = newPage
                // this.getCurrentPageData(newPage)
                // this.getUserList()
            },

            //监听switch开关状态的改变
            async userStateChanged(userinfo){
                console.log(userinfo)
                const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
                if (res.meta.status !== 200){
                    userinfo.mg_state = !userinfo.mg_state
                    return this.$message.error('更新用户状态失败')
                }
                this.$message.success('更新用户状态成功！')
            },
            //监听添加用户对话框的关闭事件
            addDialogClosed(){
                this.$refs.addFormRef.resetFields()
            },
            //点击按钮，添加新用户
            addUser(){
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                //    可以发起添加用户的网络请求
                    const {data:res} = await this.$http.post('api/reguser', this.$qs.stringify(this.addForm))
                    // console.log('执行post');
                    if (res.status !== 1)
                        this.$message.error('添加用户失败')
                    this.$message.success('添加用户成功')
                //    隐藏添加用户的对话框
                    this.addDialogVisible = false
                //    重新获取用户目录列表数据
                    this.getUserList()
                })
            },
            // 展示编辑用户的对话框
            async showEditDialog(id) {
                const {data: res} = await this.$http.get('my/userinfo'+ '?id=' + id)
                // console.log(res);
                if (res.status !== 0)
                    return this.$message.error('查询用户信息失败')
                this.editForm = res.data
                this.editDialogVisible = true
                // console.log(editForm)
            },
            //监听修改用户对话框的关闭事件
            addDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },

            // 更改角色选择器
            roleChange(val){
                let obj = {}
                obj = this.roleOptions.find((item) => {
                    return item.value ===val
                })
                this.editForm.role_id = obj.value
                // console.log(this.editForm.role_id);
            },
            // 更改机构选择器
            insChange(val){
                let obj = {}
                obj = this.insOptions.find((item) => {
                    return item.value ===val
                })
                this.editForm.ins_id = obj.value
                console.log(this.editForm.ins_id);
            },
            //修改用户信息并提交
            editUserInfo() {
                console.log(this.editForm);
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                //    发起修改用户信息的数据请求
                    const {data:res} = await this.$http.post('my/userinfo',this.$qs.stringify(this.editForm)
                    )
                    console.log(res);

                    if (res.status !== 0) {
                        return this.$message.error('更新用户信息失败')
                    }

                //    修改成功的必做三部曲
                //    关闭对话框
                    this.editDialogVisible = false
                //    刷新数据列表
                    this.getUserList()
                //    提示修改成功
                    this.$message.success('更新用户信息成功')
                })
            },

            //根据ID删除对应的用户信息
            async removeUserById(id) {
            //弹框询问用户是否删除数据
                const confirmResult =await this.$confirm(
                    '此操作将永久删除该用户, 是否继续?', '提示',
                    {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)

                //如果用户确认删除，则返回值为字符串 confirm
                //如果用户取消了删除，则返回值为字符串cancel
                // console.log(confirmResult);
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }

                const {data: res} = await this.$http.get('my/deleteuser/' + id)
                console.log(res);
                if (res.status !== 0) {
                    return this.$message.error('删除用户失败')
                }

                this.$message.success('删除用户成功')
                this.getUserList()
            },

            // 搜索框函数
            async userSelect(){
                console.log(this.searchKey);
                const {data: res} = await this.$http.get('my/searchuser/' + this.searchKey)
                if (res.status !== 0) {
                    return this.$message.error('获取用户列表失败！')
                }
                this.userlist = res.data
                this.total = res.data.length
            },

        }
    }
</script>

<style scoped>

</style>