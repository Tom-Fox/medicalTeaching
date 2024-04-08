<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>播出管理</el-breadcrumb-item>
            <el-breadcrumb-item>播出计划</el-breadcrumb-item>
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
                            @clear="getArrList"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="arrSelect"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 计划列表区域 -->
            <el-table
                :data="arrList.slice((queryInfo.pagenum-1)*queryInfo.pagesize,queryInfo.pagenum*queryInfo.pagesize)"
                border
                stripe
                @row-click="goDetail"
                >
                <el-table-column
                    v-for="item in colName"
                    :label="item.label"
                    :prop="item.name"
                    v-bind:key="item.name"
                >
                </el-table-column>
                <!-- <el-table-column label="开课状态" prop="process">{{row}}</el-table-column> -->
                <el-table-column min-width="100px" class="operation" label="操作">
                    <template v-slot="scope">
                        <!-- 修改按钮 -->
                        <el-button
                                type="primary"
                                icon="el-icon-edit"
                                circle
                                size="mini"
                                @click.stop="showEditDialog(scope.row.arr_id)"
                        ></el-button>
                        <!-- 删除按钮 -->
                        <el-button
                                type="danger"
                                icon="el-icon-delete"
                                circle
                                size="mini"
                                @click.stop="removeArrById(scope.row.arr_id)"
                        ></el-button>
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

        <!-- 修改计划的对话框 -->
        <edit-form
            :editDialogVisible="editDialogVisible"
            :editForm="editForm"
            @close="closeEdit"
        ></edit-form>
    </div>
</template>

<script>
import bus from '../../assets/comm/eventBus'
import arrEdit from './arrEdit'
export default {
  data () {
    return {
      //    获取用户列表的参数对象
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
          name: 'arr_id',
          label: '计划编号'
        }, {
          name: 'les_name',
          label: '课程名称'
        }, {
          name: 'exp_name',
          label: '主讲人'
        }, {
          name: 'chapter',
          label: '节次'
        }, {
          name: 'date',
          label: '授课日期'
        }, {
          name: 'time',
          label: '授课时间'
        },
        {
          name: 'pro_name',
          label: '开课状态'
        }
      ],
      arrList: [],
      total: 0,
      // 控制修改计划信息对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的课程信息对象
      editForm: {},
      // 输入框内容
      searchKey: ''
    }
  },
  created () {
    this.getArrList()
  },
  methods: {
    // 获取计划list
    async getArrList () {
      // console.log(this.queryInfo);
      const { data: res } = await this.$http.get('arr/arrlist', { params: this.queryInfo })
      // console.log(res)
      if (res.status !== 0) {
        return this.$message.error('获取课程列表失败！')
      }
      this.arrList = res.data
      this.total = res.data.length
    },

    // 搜索计划
    async arrSelect () {
      const { data: res } = await this.$http.get('arr/searcharr/' + this.searchKey)
      if (res.status !== 0) {
        return this.$message.error('获取计划列表失败！')
      }
      console.log(res)
      this.arrList = res.data
      this.total = res.data.length
    },
    // 分页器改变每页条数
    handleSizeChange (newSize) {
      this.queryInfo.pagenum = 1
      this.queryInfo.pagesize = newSize
    },
    // 点击页面号
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
    },
    // 展示修改计划的对话框
    async showEditDialog (id) {
      // console.log(id);
      const { data: res } = await this.$http.get('arr/arrinfo/' + id)
      // console.log(res);
      if (res.status !== 0) { return this.$message.error('查询课程信息失败') }
      this.editForm = res.data
      this.editDialogVisible = true
      // console.log(this.editForm)
    },
    goDetail (val) {
      console.log(val)
      this.$router.push('/arrDetail')
      setTimeout(() => {
        bus.$emit('pass', val)
      }, 20)
    },
    open () {
      this.addDialogVisible = true
      // console.log(addDialogVisible)
    },
    // 修改信息对话框的关闭事件
    closeEdit (visible) {
      this.editDialogVisible = visible
    }
  },
  components: {
    'edit-form': arrEdit
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
