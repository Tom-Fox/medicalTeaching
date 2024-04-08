// // 导入 mitt 包
// import mitt from 'mitt'
// // 创建 eventBus 实例对象
// const bus = mitt()

import Vue from 'vue'

const bus = new Vue()

// 将 eventBus 实例对象共享出去
export default bus


