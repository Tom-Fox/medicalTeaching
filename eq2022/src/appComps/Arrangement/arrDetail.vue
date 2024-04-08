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
                    labelStyle="width: 80px"
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
                    <el-tag size="small">{{detail.pro_name}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="教学文件">
                    <el-upload
                        :auto-upload="false"
                        drag
                        action="none"
                        :on-change="onChange"
                        :on-remove="onRemove"
                        multiple
                        show-file-list
                        >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                    <el-button type="primary" size="mini" @click="submitUpload">上传<i class="el-icon-upload el-icon--right"></i></el-button>
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
        pro_id: '',
        pro_name: '',
        bro_src: '',
        rec_src: ''
      },
      fileList: [],
      file: ''
    }
  },
  watch: {

  },
  mounted () {
    // 此处的 pass 与 lesssons 中定义的emit事件一致。
    eventBus.$on('pass', (detail) => {
      this.detail = detail
      console.log(this.detail)
    })
  },
  methods: {
    goback () {
      this.$router.go(-1)
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    onChange (file, fileList) {
      this.fileList.push(file.raw)
      // console.log(fileList);
    },
    // 文件列表移除文件时的钩子
    onRemove (file, fileList) {
      // file.raw 才是真实的 file 对象
      this.fileList.splice(this.fileList.indexOf(file.raw), 1)
    },
    // 上传文件
    async submitUpload () {
      console.log('提交文件')
      const formData = new window.FormData()
      formData.append('arr_id', this.detail.arr_id)
      // 向formData对象中添加文件
      this.fileList.forEach(val => {
        formData.append('file', val)
      })

      console.log(this.fileList)
      console.log(formData)
      // formData.append('path',this.path);
      const { data: res } = await this.$http.post('arr/upload', formData)
      console.log(res)
      // if (res.status !== 0) {
      //     return this.$message.error('上传文件失败')
      // }
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
    el-descriptions-item{
        /*text-align: center;*/
    }
</style>
