<template>
    <div>
        <div class="bread">
            <div class="back">
                <el-button
                        icon="el-icon-arrow-left"
                        size="mini"
                        circle
                        @click="goback"
                ></el-button>
            </div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>播出管理</el-breadcrumb-item>
                <el-breadcrumb-item>播出计划</el-breadcrumb-item>
                <el-breadcrumb-item>计划详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="table">
            <el-descriptions
                    class="margin-top"
                    :column="1"
                    border
                    :key="new Date().getTime()"
                    labelStyle="width:80px"
            >
                <template slot="title">

                </template>
                <el-descriptions-item label="课程名称">{{detail.les_name}}</el-descriptions-item>
                <!-- <el-descriptions-item label="课程类别">{{detail.dept_name}}</el-descriptions-item> -->
                <el-descriptions-item label="授课章节">{{detail.chapter}}</el-descriptions-item>
                <el-descriptions-item label="主讲人">{{detail.exp_name}}</el-descriptions-item>
                <el-descriptions-item label="授课时间">{{detail.date}}{{detail.time}}</el-descriptions-item>
                <el-descriptions-item label="课程简介">{{detail.introduction}}</el-descriptions-item>
                <el-descriptions-item label="开课状态">
                    <el-tag size="small">{{detail.progressStr}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="教学文件">
                    <el-table
                      :data="cowlist"
                      border
                      style="width: 100%">
                      <el-table-column type="index"></el-table-column>
                      <el-table-column prop="cow_name" label="文件名"></el-table-column>
                      <el-table-column label="操作">
                        <template v-slot="scope">
                          <!-- 修改按钮 -->
                          <el-button
                                  type="primary"
                                  icon="fa fa-cloud-download"
                                  circle
                                  size="mini"
                                  @click="download(scope.row.cow_name)"
                          ></el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                </el-descriptions-item>
                <el-descriptions-item label="视频资源">
                    <div>
                        {{detail.bro_src}}
                        {{detail.rec_src}}
                    </div>
                </el-descriptions-item>
            </el-descriptions>
        </div>

    </div>

</template>

<script>
import eventBus from '../../assets/comm/eventBus'
export default {
  data () {
    return {
      detail: {
        arr_id: '',
        les_name: '',
        // dept_name:'',
        chapter: '',
        exp_name: '',
        date: '',
        time: '',
        introduction: '',
        progress: '',
        progressStr: '',
        bro_src: '',
        rec_src: ''
      },
      fileList: [],
      file: '',
      // 获取的课件列表
      cowlist: []
    }
  },
  created () {
    // 此处的 pass 与 lesssons 中定义的emit事件一致。
    eventBus.$on('pass', (detail) => {
      this.detail = detail
      if (detail.progress === 0) this.detail.progressStr = '未开课'
      else if (detail.progress === 1) this.detail.progressStr = '授课中'
      else if (detail.progress === 2) this.detail.progressStr = '已结束'
      // console.log('detail为', this.detail)
      this.getCowList(this.detail.arr_id)
    })
  },
  methods: {
    // 获得课件列表
    async getCowList (id) {
      const { data: res } = await this.$http.get('arr/cowlist/' + id)
      console.log(this.detail.arr_id)
      // if (res.status !== 0) {
      //   return this.$message.error('查询课件失败!')
      // }
      this.cowlist = res.data
    },
    goback () {
      this.$router.go(-1)
    },
    // async submitDownload (name) {
    //   console.log('下载文件')
    //   const { data: res } = await this.$http.get('arr/download?url=' + name)
    //   const link = document.createElement('a')
    //   link.style.display = 'none'
    //   link.href = 'http://127.0.0.1:3007/arr/download?url=' + name
    //   link.download = ''
    //   link.click()
    //   console.log(res)
    // },

    // 下载文件
    download (name) {
      this.$http({
        url: 'arr/download?url=' + name,
        method: 'get',
        responseType: 'blob'
      }).then(res => {
        const blob = new Blob([res.data])
        const link = document.createElement('a')
        link.download = name
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
      })
    }
  },
  props: {
    // detail:Object
    path: String
  }
}
</script>

<style lang="less" scoped>
    .bread{
        display: flex;
        .back{
            margin-right: 20px;
        }
    }
    .el-upload input{
        display: none !important;;
        visibility:hidden;
    }
    .table{
        width: 80%;
    }
    .el-descriptions__body{
        background-color: #00c0ef;
    }
</style>
