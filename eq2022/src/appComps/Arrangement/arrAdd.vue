<template>
    <el-dialog
            title="添加计划"
            :visible.sync="addDialogVisible"
            width="45%"
            @close="addDialogClosed"
    >
        <!-- 内容主体区 -->
        <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
        >
        <el-form-item label="课程类别" prop="lessonType">
            <el-input ></el-input>
        </el-form-item>
        <el-form-item label="课程名称" prop="lessonName">
            <el-input ></el-input>
        </el-form-item>
        <el-form-item label="主讲人" prop="lecturer">
            <el-input ></el-input>
        </el-form-item>
        <el-form-item label="授课时间" prop="date">
            <div class="block">
                <el-date-picker
                        v-model="value1"
                        type="datetimerange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['12:00:00']">
                </el-date-picker>
            </div>
        </el-form-item>
        <el-form-item label="所属医院" prop="hospital">
            <el-input ></el-input>
        </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
</template>

<script>
export default {
  methods: {
    // 点击按钮，添加新用户
    addUser () {
      this.addDialogVisible = false
      this.$emit('close', this.addDialogVisible)
    },
    // 监听修改用户对话框的关闭事件
    addDialogClosed () {
      // this.$refs.editFormRef.resetFields();
      this.addDialogVisible = false
      this.$emit('close', this.addDialogVisible)
    },
    close () {
      this.addDialogVisible = false
      this.$emit('close', this.addDialogVisible)
    }
  },
  props: {
    // 控制添加用户对话框的显示与隐藏
    addDialogVisible: Boolean
  }
}
</script>

<style scoped>

</style>
