<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>专家库</el-breadcrumb-item>
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
                            @clear="getExpList"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="expSelect"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="openAddForm">添加专家</el-button>
                </el-col>
            </el-row>

            <!-- 专家列表区域 -->
            <el-table 
                :data="expList.slice((queryInfo.pagenum-1)*queryInfo.pagesize,queryInfo.pagenum*queryInfo.pagesize)" 
                border 
                stripe 
                @row-click="goDetail">
                <el-table-column
                    v-for="item in colName"
                    v-bind:key="item.label"
                    :label="item.label"
                    :prop="item.name"
                >
                </el-table-column>
                <el-table-column width="100px" class="operation" label="操作">
                    <template v-slot="scope">
                        <!-- 修改按钮 -->
                        <el-button
                                type="primary"
                                icon="el-icon-edit"
                                circle
                                size="mini"
                                @click.stop="showEditDialog(scope.row.exp_id)"
                        ></el-button>
                        <!-- 删除按钮 -->
                        <el-button
                                type="danger"
                                icon="el-icon-delete"
                                circle
                                size="mini"
                                @click.stop="removeExpById(scope.row.exp_id)"
                        ></el-button>
                        <!-- 分配角色按钮 -->
                        <!-- <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button
                                    type="warning"
                                    icon="el-icon-setting"
                                    circle
                                    size="mini"
                            ></el-button>
                        </el-tooltip> -->

                    </template>
                </el-table-column>
            </el-table>

            <!--分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 4, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加专家的对话框 -->
        <add-form
                :addDialogVisible="addDialogVisible"
                :title="title"
                @close="closeAdd"
        ></add-form>

        <!-- 修改用户的对话框 -->
        <edit-form
                :editDialogVisible="editDialogVisible"
                :editForm="editForm"
                :title="title"
                @close="closeEdit"
        ></edit-form>
    </div>
</template>

<script>
    import bus from "../../assets/comm/eventBus";
    import proAdd from "./proAdd";
    import proEdit from "./proEdit.vue"
    export default {
        data(){
            return{
                //    获取用户列表的参数对象
                queryInfo:{
                    query:'',
                    //当前的页数
                    pagenum:1,
                    //当前每页显示多少条数据
                    pagesize:4
                },
                // 列名
                colName:[
                    {
                        name:'exp_id',
                        label:'id',
                    },{
                        name:'exp_name',
                        label:'专家姓名',
                    },{
                        name:'dept_name',
                        label:'所属科室',
                    },{
                        name:'position',
                        label:'职位',
                    },
                ],
                //查询到的专家信息对象
                editForm:{},
                // 后台获取的专家数据list
                expList:[],
                total:0,
                //控制添加专家对话框的显示与隐藏
                addDialogVisible:false,
                //控制修改专家信息对话框的显示与隐藏
                editDialogVisible:false,
                // 编辑框的标题
                title:'',
                //输入框内容
                searchKey:'',
            }
        },
        created() {
            this.getExpList()
        },
        methods:{
            // 获取专家list
            async getExpList(){
                // console.log(this.queryInfo);
                const {data:res} =await this.$http.get('exp/explist',{params: this.queryInfo})
                // console.log(res)
                if (res.status !== 0) {
                    return this.$message.error('获取专家列表失败！')
                }
                this.expList = res.data
                this.total = res.data.length
            },

            // 分页器改变每页条数
            handleSizeChange(newSize){
                this.queryInfo.pagenum = 1
                this.queryInfo.pagesize = newSize
            },
            //点击页面号
            handleCurrentChange(newPage){
                // console.log(newPage)
                this.queryInfo.pagenum = newPage
                // this.getCurrentPageData(newPage)
                // this.getUserList()
            },
            // 打开详情界面
            async goDetail(val){
                // 传回来一行的数据对象
                const {data: res} = await this.$http.get('exp/expinfo/'+ val.exp_id)
                if (res.status !== 0)
                    return this.$message.error('查询专家信息失败')
                // this.detail = res.data
                // bus.emit('getDetail',this.detail);
                this.$router.push('/proDetail')
                setTimeout(() => {
                    bus.$emit('getdetail',res.data);
                }, 20);
                console.log('跳转');
            },
            // 打开添加专家对话框
            openAddForm(){
                this.title = '添加专家'
                this.addDialogVisible = true
                // console.log(addDialogVisible)
            },
            //添加专家对话框的关闭事件
            closeAdd(visible){
                this.addDialogVisible = visible
            },
            //修改信息对话框的关闭事件
            closeEdit(visible){
                this.editDialogVisible = visible
            },
            // 展示编辑用户的对话框
            async showEditDialog(id) {
                // console.log(id);
                this.title = '更改信息'
                const {data: res} = await this.$http.get('exp/expinfo/'+ id)
                // console.log(res);
                if (res.status !== 0)
                    return this.$message.error('查询专家信息失败')
                this.editForm = res.data
                this.editDialogVisible = true
                // console.log(this.editForm)
            },

            //根据ID删除对应的专家信息
            async removeExpById(id) {
            //弹框询问用户是否删除数据
                const confirmResult =await this.$confirm(
                    '此操作将永久删除该专家, 是否继续?', '提示',
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

                const {data: res} = await this.$http.get('exp/deletexp/' + id)
                // console.log(res);
                if (res.status !== 0) {
                    return this.$message.error('删除专家失败')
                }

                this.$message.success('删除专家成功')
                this.getExpList()
            },

            // 搜索框函数
            async expSelect(){
                // console.log(this.searchKey);
                const {data: res} = await this.$http.get('exp/searchexp/' + this.searchKey)
                if (res.status !== 0) {
                    return this.$message.error('获取专家列表失败！')
                }
                this.expList = res.data
                this.total = res.data.length
            },
        },
        // destroyed(){
        //    bus.$emit('getdetail',res.data);
        // },
        components:{
            'add-form':proAdd,
            'edit-form':proEdit
        }
    }
</script>

<style scoped>
    .el-table cell {
        white-space: nowrap;
        width: fit-content;
    }
</style>