<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>点播回放</el-breadcrumb-item>
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
        <!--                <el-col :span="4">-->
        <!--                    <el-button type="primary" @click="open">录入计划</el-button>-->
        <!--                </el-col>-->
      </el-row>

      <!-- 专家列表区域 -->
      <el-table :data="arrList" border stripe @row-click="goDetail">
        <el-table-column
          v-for="item in colName"
          :label="item.label"
          :prop="item.name"

        >
        </el-table-column>
        <el-table-column min-width="100px" class="operation" label="操作">
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

  </div>



  <!-- 添加专家的对话框 -->
</template>

<script>
    export default {
      data () {
        return {
          //    获取用户列表的参数对象
          queryInfo: {
            query: '',
            // 当前的页数
            pagenum: 1,
            // 当前每页显示多少条数据
            pagesize: 2
          },
          // 列名
          colName: [
            {
              name: 'lessonNum',
              label: '课程编号'
            }, {
              name: 'lessonType',
              label: '课程类别'
            }, {
              name: 'lessonName',
              label: '课程名称'
            }, {
              name: 'lecturer',
              label: '主讲人'
            }, {
              name: 'date',
              label: '授课时间'
            }, {
              name: 'hospital',
              label: '所属医院'
            }, {
              name: 'lessonState',
              label: '开课状态'
            }
          ],
          arrList: [
            {
              lessonNum: '63248',
              lessonType: '胸外科',
              lessonName: '微创胸腔镜手术',
              lecturer: '何建行',
              date: '周三下午、周五上午',
              hospital: '广州医科大学附属第一医院',
              lessonState: '开课中'
            },
            {
              lessonNum: '63249',
              lessonType: '呼吸内科',
              lessonName: '肺功能临床诊断',
              lecturer: '郑劲平',
              date: '周一下午、周四上午',
              hospital: '广州医科大学附属第一医院',
              lessonState: '已结课'
            },
            {
              lessonNum: '63250',
              lessonType: '重症监护室',
              lessonName: '肿瘤切除手术',
              lecturer: '王小虎',
              date: '周一下午、周三上午',
              hospital: '广州医科大学附属第一医院',
              lessonState: '即将开课'
            }
          ],
          total: 0,
          // 控制添加用户对话框的显示与隐藏
          addDialogVisible: false
        }
      },
      created () {
        // this.getUserList()
      },
      methods: {
        goDetail (val) {
          let thisRowData = this
          thisRowData = val
          // eventBus.$emit('pass', val)
          // console.log(val);
          this.$router.push('/arrDetail')
        },
        open () {
          this.addDialogVisible = true
          console.log(addDialogVisible)
        },
        // 添加用户对话框的关闭事件
        close (visible) {
          this.addDialogVisible = visible
        }
      },
    }
</script>

<style scoped>

</style>
