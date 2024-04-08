<template>
    <!-- 修改信息的对话框 -->
    <el-dialog
            title="修改课程"
            :visible.sync="editDialogVisible"
            width="40%"
            @close="editDialogClosed"
    >
        <!-- 内容主体区 -->
        <el-form
                :model="editForm"
                :rules="editFormRules"
                ref="editFormRef"
                label-width="70px"
        >
            <el-form-item label="课程名" prop="les_name">
                <el-input v-model="editForm.les_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="主讲人" prop="exp_name">
                <el-input v-model="editForm.exp_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="章节" prop="chapter">
                <el-input v-model="editForm.chapter" disabled></el-input>
            </el-form-item>
            <el-form-item label="授课时间" required>
            <el-col :span="11">
                <el-form-item prop="date">
                    <el-date-picker 
                        
                        placeholder="选择日期" 
                        v-model="editForm.date" 
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
                        v-model="editForm.time" 
                        style="width: 100%"
                        value-format="HH:mm:ss"
                        ></el-time-picker>
                </el-form-item>
            </el-col>
        </el-form-item>
        <el-form-item label="直播秘钥" prop="bro_src">
                <el-input v-model="editForm.bro_src"></el-input>
        </el-form-item>
        <el-form-item label="录播链接" prop="rec_src">
            <el-input v-model="editForm.rec_src"></el-input>
        </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="editArrInfo">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        data(){
            return{
                //修改专家信息的表单数据
                // editForm:{
                    
                // },
                //添加表单的验证规则对象
                editFormRules:{
                },
            }
        },
        created() {

        },
        methods:{
            //修改计划信息并提交
            editArrInfo() {
                console.log(this.editForm);
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                //    发起修改计划信息的数据请求
                    const {data:res} = await this.$http.post('arr/arrinfo',this.$qs.stringify(this.editForm)
                    )
                    console.log(res);

                    if (res.status !== 0) {
                        return this.$message.error('更新专家信息失败')
                    }
                //    修改成功的必做三部曲
                //    关闭对话框
                    this.editDialogVisible = false
                //    提示修改成功
                    this.$message.success('更新专家信息成功')
                })
            },
            //监听修改用户对话框的关闭事件
            editDialogClosed() {
                // this.$refs.editFormRef.resetFields();
                this.editDialogVisible = false;
                this.$emit('close',this.editDialogVisible)
                // console.log(props.title);
            },
            close(){
                this.editDialogVisible = false;
                this.$emit('close',this.editDialogVisible)
            }
        },
        props:{
            //控制修改专家对话框的显示与隐藏
            editDialogVisible:Boolean,
            editForm:Object,
            expOptions:Array
        }

    }
</script>

<style scoped>

</style>