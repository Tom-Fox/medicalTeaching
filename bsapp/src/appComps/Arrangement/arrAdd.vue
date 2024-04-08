<template>
    <el-dialog
            title="添加计划"
            :visible.sync="addArrDialogVisible"
            width="45%"
            @close="addDialogClosed"
    >
        <!-- 内容主体区 -->
        <el-form
        :model="arrForm"
        :rules="arrFormRules"
        ref="addFormRef"
        label-width="70px"
        >
        <el-form-item label="课程名称" prop="les_name">
            <el-input v-model="arrForm.les_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="主讲人" prop="exp_name">
            <el-input v-model="arrForm.exp_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="授课时间" required>
            <el-col :span="11">
                <el-form-item prop="date">
                    <el-date-picker 
                        
                        placeholder="选择日期" 
                        v-model="arrForm.date" 
                        style="width: 100%"
                        value-format="yyyy-MM-dd"
                        ></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
                <el-form-item prop="time">
                    <el-time-picker 
                        placeholder="选择时间" 
                        v-model="arrForm.time" 
                        style="width: 100%"
                        value-format="HH:mm:ss"
                        ></el-time-picker>
                </el-form-item>
            </el-col>
        </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
    <el-button @click="addArrDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addArr">确 定</el-button>
  </span>
    </el-dialog>
</template>

<script>
    export default {
        data(){
            return{
                arrFormRules:{
                    date: [
                        { required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    time: [
                        { required: true, message: '请选择时间', trigger: 'change' }
                    ],
                }
            }
        },
        methods:{
            //点击按钮，添加新用户
            addArr(){
                console.log(this.arrForm);
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                //    发起修改专家信息的数据请求
                    const {data:res} = await this.$http.post('arr/newarr',this.$qs.stringify(this.arrForm))
                    console.log(res);

                    if (res.status !== 0) {
                        return this.$message.error('创建计划失败')
                    }

                //    修改成功的必做三部曲
                //    关闭对话框
                    this.addArrDialogVisible = false
                    // 重新获取专家目录列表数据
                    //  this.$parent.getLesList()
                //    提示修改成功
                    this.$message.success('创建计划成功')
                    this.$emit('close',this.addArrDialogVisible)
                })
            },
            //监听修改用户对话框的关闭事件
            addDialogClosed() {
                // this.$refs.editFormRef.resetFields();
                this.addArrDialogVisible = false;
                this.$emit('close',this.addArrDialogVisible)
                // console.log('日期：',this.addForm.date);
                // console.log('时间：',this.addForm.time);
            },
            
        },
        props:{
            //控制添加用户对话框的显示与隐藏
            addArrDialogVisible:Boolean,
            arrForm:Object
        }
    }
</script>

<style scoped>

</style>