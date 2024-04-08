<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>课程列表</el-breadcrumb-item>
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
                            @clear="getLesList"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="lesSelect"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 课程列表区域 -->
            <el-table
                :data="lessonList.slice((queryInfo.pagenum-1)*queryInfo.pagesize,queryInfo.pagenum*queryInfo.pagesize)"
                border
                stripe
                @row-click="goDetail">
                <el-table-column
                    v-for="item in colName"
                    :label="item.label"
                    :prop="item.name"
                    v-bind:key="item.name"
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
                                @click.stop="showEditDialog(scope.row.les_id)"
                        ></el-button>
                        <!-- 删除按钮 -->
                        <el-button
                                type="danger"
                                icon="el-icon-delete"
                                circle
                                size="mini"
                                @click.stop="removeLesById(scope.row.les_id)"
                        ></el-button>
                        <!-- 添加计划按钮 -->
                        <el-tooltip effect="dark" content="添加计划" placement="top" :enterable="false">
                            <el-button
                                    type="warning"
                                    icon="el-icon-setting"
                                    circle
                                    size="mini"
                                    @click.stop="openArrAdd(scope.row.les_id)"
                            ></el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>

            <!--分页区域-->
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
import bus from '../../assets/comm/eventBus'
export default {
  data () {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5
      },
      // 列名
      colName: [
        {
          name: 'les_id',
          label: '课程编号'
        }, {
          name: 'les_name',
          label: '课程名称'
        }, {
          name: 'dept_name',
          label: '课程类别'
        }, {
          name: 'exp_name',
          label: '主讲人'
        }
      ],
      lessonList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改专家信息对话框的显示与隐藏
      editDialogVisible: false,
      // 控制添加计划框的显示与隐藏
      addArrDialogVisible: false,
      // 输入框内容
      searchKey: '',
      // 查询到的专家信息对象
      editForm: {},
      // 专家列表
      expOptions: []
    }
  },
  created () {
    this.getLesList()
    this.getExpList()
  },
  methods: {
    // 获取课程list
    async getLesList () {
      // console.log(this.queryInfo);
      const { data: res } = await this.$http.get('les/perleslist')
      // console.log(res)
      if (res.status !== 0) {
        return this.$message.error('获取课程列表失败！')
      }
      this.lessonList = res.data
      this.total = res.data.length
    },
    // 获取选择框内的主讲人列表
    async getExpList () {
      const { data: res } = await this.$http.get('exp/expchoice')
      if (res.status !== 0) { return this.$message.error('查询专家信息失败') }
      this.expOptions = res.data
    },
    // 分页器改变每页条数
    handleSizeChange (newSize) {
      this.queryInfo.pagenum = 1
      this.queryInfo.pagesize = newSize
    },
    // 点击页面号
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      // this.getCurrentPageData(newPage)
      // this.getUserList()
    },
    // 打开详情界面
    async goDetail (val) {
      // 传回来一行的数据对象
      const { data: res } = await this.$http.get('les/lesinfo/' + val.les_id)
      if (res.status !== 0) { return this.$message.error('查询课程信息失败') }
      // this.detail = res.data
      // bus.emit('getDetail',this.detail);
      this.$router.push('/lessonDetail')
      setTimeout(() => {
        bus.$emit('getdetail', res.data)
      }, 20)
      console.log('跳转')
    },
    // 打开添加课程对话框
    openAddForm () {
      this.addDialogVisible = true
      // console.log(addDialogVisible);
    },
    // 添加课程对话框的关闭事件
    closeAdd (visible) {
      this.addDialogVisible = visible
    },
    // 修改信息对话框的关闭事件
    closeEdit (visible) {
      this.editDialogVisible = visible
    },
    // 展示编辑用户的对话框
    async showEditDialog (id) {
      // console.log(id);
      const { data: res } = await this.$http.get('les/lesinfo/' + id)
      // console.log(res);
      if (res.status !== 0) { return this.$message.error('查询课程信息失败') }
      this.editForm = res.data
      this.editDialogVisible = true
      // console.log(this.editForm)
    },

    // 根据ID删除对应的用户信息
    async removeLesById (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该课程, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串cancel
      // console.log(confirmResult);
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.get('les/deleteles/' + id)
      console.log(res)
      if (res.status !== 0) {
        return this.$message.error('删除课程失败')
      }

      this.$message.success('删除课程成功')
      this.getLesList()
    },
    // 搜索框函数
    async lesSelect () {
      // console.log(this.searchKey);
      const { data: res } = await this.$http.get('les/searchles/' + this.searchKey)
      if (res.status !== 0) {
        return this.$message.error('获取课程列表失败！')
      }
      this.lessonList = res.data
      this.total = res.data.length
    }
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
