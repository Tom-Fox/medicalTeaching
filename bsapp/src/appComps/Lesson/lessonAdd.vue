<template>
    <!-- 添加用户的对话框 -->
    <el-dialog
            title="添加课程"
            :visible.sync="addDialogVisible"
            width="45%"
            @close="addDialogClosed"
    >
        <!-- 内容主体区 -->
        <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-width="70px"
        >
            <el-form-item label="课程名" prop="les_name">
                <el-input v-model="addForm.les_name"></el-input>
            </el-form-item>
            <el-form-item label="主讲人" prop="expert">
                <el-select v-model="addForm.exp_id" placeholder="请选择">
                    <el-option
                            v-for="item in expOptions"
                            :key="item.exp_id"
                            :label="item.exp_name"
                            :value="item.exp_id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="课程简介" prop="introduction">
               <el-input 
                v-model="addForm.introduction"
                autosize
                type="textarea"
                ></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
    <el-button @click="close">取 消</el-button>
    <el-button type="primary" @click="addLesson">确 定</el-button>
  </span>
    </el-dialog>
</template>

<script>
    export default {
        data(){
            return{
                //添加用户的表单数据
                addForm:{
                    les_name:'',
                    exp_id:'',
                    introduction:'',
                },
                // 添加表单的验证规则对象
                addFormRules:{
                    les_name:[
                        {
                            required: true,
                            message:'请输入课程名',
                            trigger: 'blur'
                        },
                    ],
                    expert:[
                         {
                            required: true,
                            message:'请选择主讲人',
                            trigger: 'blur'
                        },
                    ],
                },
            }
        },
        created() {
            
        },
        methods:{
            //点击按钮，添加新课程
            addLesson(){
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                    // 可以发起添加课程的网络请求
                    const {data:res} = await this.$http.post('les/newles', this.$qs.stringify(this.addForm))
                    // console.log('执行post');
                    if (res.status !== 0)
                        this.$message.error('添加课程失败')
                    
                    // 隐藏添加课程的对话框
                    this.addDialogVisible = false
                    this.$emit('close',this.addDialogVisible)

                    // 重新获取课程目录列表数据
                    this.$parent.getLesList()
                    // 提示修改成功
                    this.$message.success('添加专家成功')
                })
            },
           
            //监听修改用户对话框的关闭事件
            addDialogClosed() {
                // this.$refs.editFormRef.resetFields();
                this.addDialogVisible = false;
                this.$emit('close',this.addDialogVisible)
            },
            close(){
                this.addDialogVisible = false;
                this.$emit('close',this.addDialogVisible)
            }
        },
        props:{
            //控制添加用户对话框的显示与隐藏
            addDialogVisible:Boolean,
            expOptions:Array
        }

    }
</script>

<style scoped>

</style>