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
            <el-form-item label="编号" prop="les_id">
                <el-input v-model="editForm.les_id" disabled></el-input>
            </el-form-item>
            <el-form-item label="课程名" prop="les_name">
                <el-input v-model="editForm.les_name"></el-input>
            </el-form-item>
            <el-form-item label="主讲人" prop="expert">
                <el-select 
                    v-model="editForm.exp_name" 
                    placeholder="请选择"
                    @change="expChange"
                    >
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
                    v-model="editForm.introduction"
                    autosize
                    type="textarea"
                 ></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="editLesInfo">确 定</el-button>
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
                    les_name:[
                        {
                            required: true,
                            message:'请输入课程名',
                            trigger: 'blur'
                        },
                    ],
                    exp_id:[
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
            //修改专家信息并提交
            editLesInfo() {
                console.log(this.editForm);
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                //    发起修改专家信息的数据请求
                    const {data:res} = await this.$http.post('les/lesinfo',this.$qs.stringify(this.editForm)
                    )
                    console.log(res);

                    if (res.status !== 0) {
                        return this.$message.error('更新专家信息失败')
                    }

                //    修改成功的必做三部曲
                //    关闭对话框
                    this.editDialogVisible = false
                    // 重新获取专家目录列表数据
                     this.$parent.getLesList()
                //    提示修改成功
                    this.$message.success('更新专家信息成功')
                })
            },
            // 更改主讲人选择器
            expChange(val){
                let obj = {}
                obj = this.expOptions.find((item) => {
                    return item.exp_id ===val
                })
                this.editForm.exp_id = obj.exp_id
                // console.log(this.editForm.role_id);
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