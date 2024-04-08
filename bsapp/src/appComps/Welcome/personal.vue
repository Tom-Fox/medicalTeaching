<template>
    <div class="panel">
        <div :gutter="10" class="panel-group">
            <div class="ele">
                <div class="card-panel" @click="handleSetLineChartData('在线客户端数')">
                    <div class="card-panel-icon-wrapper icon-people">
                        <i class="fa fa-users" />
                    </div>
                    <div class="description">
                        <div class="card-panel-text">
                            在线客户端数
                        </div>
                        <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
                    </div>
                </div>
            </div>
            <div :xs="12" :sm="12" :lg="6" class="ele">
                <div class="card-panel" @click="handleSetLineChartData('购买订单数')">
                    <div class="card-panel-icon-wrapper icon-shopping">
                        <i class="fa fa-jpy" />
                    </div>
                    <div class="description">
                        <div class="card-panel-text">
                            购买订单数
                        </div>
                        <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
                    </div>
                </div>
            </div>
        </div>

        <div :gutter="40" class="panel-group">

            
        </div>
    </div>

</template>

<script>
    import CountTo from 'vue-count-to'
    export default {
        components:{
            CountTo
        },
        methods: {
            handleSetLineChartData(type) {
                this.$emit('handleSetLineChartData', type)
            }
        }
    }
</script>

<style lang="less" scoped>
    .panel{
        padding-left: 20px;
        margin-bottom:0;
        -webkit-box-shadow:0 0 0 0;
        box-shadow:0 0 0 0;
        .panel-group {
            display: flex;
            .ele {
                background-color: #fff;
                width: 250px;
                margin-right: 60px;
                /*padding-left: 20px;*/
            }
    }


    .card-panel {
        display: flex;
        width: 240px;
        cursor: pointer;
        font-size: 12px;
        position: relative;
        overflow: hidden;
        /*border-color: rgba(0, 0, 0, .05);*/


    .card-panel-icon-wrapper {
        color: #fff;
        width: 20%;
        height: 50%;
    }

    .icon-people {
        background: #40c9c6;
    }

    .icon-message {
        background: #36a3f7;
    }

    .icon-money {
        background: #f4516c;
    }

    .icon-shopping {
        background: #34bfa3
    }
    }



    .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
    }

    .card-panel-icon {
        float: left;
        font-size: 48px;
    }

    .description {
        float: right;
        font-weight: bold;
        margin: 26px;

    .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
    }

    .card-panel-num {
        font-size: 20px;
    }
    }
    }

</style>