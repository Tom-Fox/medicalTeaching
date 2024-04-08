<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>播出管理</el-breadcrumb-item>
            <el-breadcrumb-item>客户订单</el-breadcrumb-item>
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
                            @clear="getOrdList"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="ordSelect"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">增加记录</el-button>
                </el-col>
            </el-row>

            <!-- 订单列表区域 -->
            <el-table 
                :data="orderList.slice((queryInfo.pagenum-1)*queryInfo.pagesize,queryInfo.pagenum*queryInfo.pagesize)" 
                border 
                stripe 
            >
                <el-table-column
                        v-for="item in colName"
                        :label="item.label"
                        :prop="item.name"
                        :key="item.name"
                >
                </el-table-column>
                <el-table-column width="140px" class="operation" label="操作">
                    <template v-slot="scope">
                        <!-- 修改按钮 -->
                        <el-button
                                type="primary"
                                icon="el-icon-edit"
                                circle
                                size="mini"
                                @click="showEditDialog(scope.row.ord_id)"
                        ></el-button>
                        <!-- 删除按钮 -->
                        <el-button
                                type="danger"
                                icon="el-icon-delete"
                                circle
                                size="mini"
                                @click="removeOrdById(scope.row.ord_id)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--            分页区域-->
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
    </div>
</template>

<script>

    export default {
        data(){
            return{
                //    获取用户列表的参数对象
                queryInfo:{
                    //当前的页数
                    pagenum:1,
                    //当前每页显示多少条数据
                    pagesize:5
                },
                total:0,
                // 获取订单列表
                orderList:[],
                // 列名
                colName:[
                    {
                        name:'ord_id',
                        label:'订单编号',
                    },{
                        name:'ins_name',
                        label:'医院名称',
                    },{
                        name:'les_name',
                        label:'订阅课程',
                    },
                ],
                // 客户医院列表
                insOptions:[],
                // 课程列表
                lesOptions:[],
                //输入框内容
                searchKey:'',
                //控制添加订单对话框的显示与隐藏
                addDialogVisible:false,
                //控制修改订单信息对话框的显示与隐藏
                editDialogVisible:false,
            }
        },
        created() {
            this.getOrdList()
        },
        methods:{
            // 获取订阅list
            async getOrdList(){
                const {data:res} =await this.$http.get('ord/ordlist',{params: this.queryInfo})
                // console.log(res)
                if (res.status !== 0) {
                    return this.$message.error('获取课程列表失败！')
                }
                this.orderList = res.data           
                this.total = res.data.length
            },


            // 分页器改变每页条数
            handleSizeChange(newSize){
                this.queryInfo.pagenum = 1
                this.queryInfo.pagesize = newSize
            },
            //点击页面号
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
            },
        }
    }
</script>

<style scoped>

</style>