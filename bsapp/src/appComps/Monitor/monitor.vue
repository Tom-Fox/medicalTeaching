<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>播出管理</el-breadcrumb-item>
            <el-breadcrumb-item>运行监控</el-breadcrumb-item>
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
                            v-model="queryInfo.query"
                            clearable
                            @clear=""
                    >
                        <el-button slot="append" icon="el-icon-search" @click=""></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 专家列表区域 -->
            <el-table :data="stateList" border stripe @row-click="goDetail">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="账号" prop="id"></el-table-column>
                <el-table-column label="所属医院" prop="hospital"></el-table-column>
                <el-table-column label="在线状态">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.ifOnline" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="播放状态">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.ifWatch" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="占用资源" prop="usage"></el-table-column>
                <el-table-column width="140px" class="operation" label="操作">
                    <template v-slot="scope">
                        <!-- 修改按钮 -->
                        <el-button
                                type="primary"
                                icon="el-icon-edit"
                                circle
                                size="mini"
                                @click=""
                        ></el-button>
                        <!-- 删除按钮 -->
                        <el-button
                                type="danger"
                                icon="el-icon-delete"
                                circle
                                size="mini"
                                @click=""
                        ></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
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

            <!--分页区域-->
            <el-pagination
                    @size-change=""
                    @current-change=""
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加专家的对话框 -->
        <add-form
                :addDialogVisible="addDialogVisible"
                @close="close"
        ></add-form>

        <!-- 修改用户的对话框 -->

    </div>
</template>

<script>
    import lessonAdd from "../Lesson/lessonAdd";
    import eventBus from "../../assets/comm/eventBus";
    export default {
        data(){

            return{
                //    获取用户列表的参数对象
                queryInfo:{
                    query:'',
                    //当前的页数
                    pagenum:1,
                    //当前每页显示多少条数据
                    pagesize:2
                },
                // 列名
                colName:[
                    {
                        name:'id',
                        label:'账号',
                    },{
                        name:'hospital',
                        label:'所属医院',
                    },{
                        name:'ifWatch',
                        label:'播放状态',
                    },{
                        name:'ifOnline',
                        label:'在线状态',
                    },{
                        name:'usage',
                        label:'占用资源',
                    },
                ],
                stateList:[
                    {
                        id:'356355',
                        hospital:'中南大学湘雅三医院',
                        ifWatch:true,
                        ifOnline:true,
                        //视频资源编号
                        usage:'74635243',
                    },{
                        id:'864721',
                        hospital:'南通大学附属医院',
                        ifWatch:false,
                        ifOnline:false,
                        usage:'',
                    },
                    {
                        id:'786520',
                        hospital:'柳州市人民医院',
                        ifWatch:false,
                        ifOnline:true,
                        usage:'74635243',
                    },
                ],
                total:0,
                //控制添加用户对话框的显示与隐藏
                addDialogVisible:false,
            }
        },
        created() {
            // this.getUserList()
        },
        methods:{
            goDetail(val){
                let thisRowData = this;
                thisRowData = val;
                eventBus.$emit('pass',val);
                // console.log(val);
                this.$router.push('/pDetail')
            },
            open(){
                this.addDialogVisible = true;
                console.log(addDialogVisible);
            },
            //添加用户对话框的关闭事件
            close(visible){
                this.addDialogVisible = visible
            },
        },
        components:{
            'add-form':lessonAdd
        }
    }
</script>

<style scoped>
    .operation{
        width: 140px;
    }
    .el-table cell {
        white-space: nowrap;
        width: fit-content;
    }
</style>