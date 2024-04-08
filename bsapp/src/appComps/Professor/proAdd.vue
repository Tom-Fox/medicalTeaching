<template>
    <!-- 添加用户的对话框 -->
    <el-dialog
            :title="title"
            :visible.sync="addDialogVisible"
            width="45%"
            @close="addDialogClosed"
    >
        <!-- 内容主体区 -->
        <el-form
                :model="addForm"
                rules=""
                ref="addFormRef"
                label-width="70px"
        >
            <el-form-item label="专家姓名" prop="exp_name">
                <el-input v-model="addForm.exp_name"></el-input>
            </el-form-item>
            <el-form-item label="所属科室" prop="department">
                <el-select v-model="addForm.dept_id" placeholder="请选择">
                    <el-option
                            v-for="item in deptOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职位" prop="position">
                <el-input 
                    v-model="addForm.position"
                    autosize
                    type="textarea"
                ></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="addExpert">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        data(){

            return{
                //添加用户的表单数据
                addForm:{
                    exp_name:'',
                    dept_id:'',
                    position:'',
                    mobile:'',
                },
                // 部门列表
                deptOptions: [{
                    value: '1',
                    label: '呼吸内科'
                }, {
                    value: '2',
                    label: '胸外科'
                }, {
                    value: '3',
                    label: '重症监护室'
                }, {
                    value: '4',
                    label: '变态反应科'
                },],
                
            }

        },
        created() {

        },
        methods:{
            //点击按钮，添加新用户
            addExpert(){
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                    // 可以发起添加用户的网络请求
                    const {data:res} = await this.$http.post('exp/newexp', this.$qs.stringify(this.addForm))
                    // console.log('执行post');
                    if (res.status !== 1)
                        this.$message.error('添加专家失败')
                    
                    // 隐藏添加用户的对话框
                    this.addDialogVisible = false
                    this.$emit('close',this.addDialogVisible)

                    // 重新获取用户目录列表数据
                    this.$parent.getExpList()
                    // 提示修改成功
                    this.$message.success('添加专家成功')
                })
            },
            //监听修改用户对话框的关闭事件
            addDialogClosed() {
                // this.$refs.editFormRef.resetFields();
                this.addDialogVisible = false;
                this.$emit('close',this.addDialogVisible)
                // console.log(props.title);
            },
            close(){
                this.addDialogVisible = false;
                this.$emit('close',this.addDialogVisible)
            }
        },
        props:{
            //控制添加专家对话框的显示与隐藏
            addDialogVisible:Boolean,
            title:String
        }

    }
</script>

<style scoped>

</style>