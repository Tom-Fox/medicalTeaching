<template>
    <!-- 修改信息的对话框 -->
    <el-dialog
            :title="title"
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
            <el-form-item label="id" prop="exp_id">
                <el-input v-model="editForm.exp_id" disabled></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="exp_name">
                <el-input v-model="editForm.exp_name"></el-input>
            </el-form-item>
            <el-form-item label="科室" prop="dept_name">
                <el-select 
                    v-model="editForm.dept_name" 
                    placeholder="请选择"
                    @change="deptChange"
                    >
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
                    v-model="editForm.position"
                    autosize
                    type="textarea"
                 ></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="editExpInfo">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        data(){

            return{
                //添加表单的验证规则对象
                editFormRules:{
                    exp_name:[
                        {
                            required: true,
                            message:'请输入专家姓名',
                            trigger: 'blur'
                        },
                    ],
                    dept_id:[
                        {
                            required: true,
                            message:'请选择部门',
                            trigger: 'blur'
                        },
                    ],
                    position:[
                        {
                            required: true,
                            message:'请输入职位',
                            trigger: 'blur'
                        }
                    ],

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
            //修改专家信息并提交
            editExpInfo() {
                console.log(this.editForm);
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                    // 发起修改专家信息的数据请求
                    const {data:res} = await this.$http.post('exp/expinfo',this.$qs.stringify(this.editForm)
                    )
                    console.log(res);

                    if (res.status !== 0) {
                        return this.$message.error('更新专家信息失败')
                    }

                    // 修改成功的必做三部曲
                    // 关闭对话框
                    this.editDialogVisible = false
                    // 重新获取专家目录列表数据
                     this.$parent.getExpList()
                    // 提示修改成功
                    this.$message.success('更新专家信息成功')
                })
            },
            // 更改部门选择器
            deptChange(val){
                let obj = {}
                obj = this.deptOptions.find((item) => {
                    return item.value ===val
                })
                this.editForm.dept_id = obj.value
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
            title:String,
            // 修改专家信息的表单数据
            editForm:Object
        }

    }
</script>

<style scoped>

</style>