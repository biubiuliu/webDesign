<template>
    <div :style="{position: 'fixed', width: '100%', minWidth:'800px'}">
        <Menu mode="horizontal" theme="dark" id="dark" active-name="1">
            <div class="layout-nav">
                <MenuItem name="首页"  to="/home/discover">
                    <i  class="iconfont iconzuo"></i>
                    首页
                </MenuItem>
                <MenuItem name="画布尺寸" class="canvasSize" @click.native="isShowCvsFun">
                    画布尺寸
                </MenuItem>
                
                <MenuItem name="我的收藏">
                    保存方案
                </MenuItem>
                <MenuItem name="撤销" class="layout-user">
                    <i  class="iconfont icondaohangchexiao"></i>
                    撤销 
                </MenuItem>
                <MenuItem name="重置" >
                    <i  class="iconfont iconzhongzhi"></i>
                    重置
                </MenuItem>
                <MenuItem name="导出清单" class="layout-user">
                    <i  class="iconfont iconxiazai"></i>
                    导出清单
                </MenuItem>
            </div>
        </Menu>
        <transition name="fade">
            <div class="canvasCard"  v-if="isShowCvs">
                <Card shadow>
                    <p slot="title">选择画布尺寸</p>
                    <RadioGroup v-model="vertical" vertical @on-change="CanvasSizeFun">
                        <Radio label="0">
                            <Icon type="social-apple"></Icon>
                            <span>1 : 1</span>
                        </Radio>
                        <Radio label="1">
                            <Icon type="social-android"></Icon>
                            <span>A3 竖排</span>
                        </Radio>
                        <Radio label="2">
                            <Icon type="social-windows"></Icon>
                            <span>A3 横排</span>
                        </Radio>
                        <Radio label="3">
                            <Icon type="social-windows"></Icon>
                            <span>16 : 9</span>
                        </Radio>
                    </RadioGroup>
                </Card>
                <div class="moudal" @click="closeMoudalFun"></div>
            </div>
            
        </transition>
    </div>
</template>
<script>
import { mapState,mapMutations } from 'vuex';
export default {
    name: 'designBar',
    data() {
        return {
            msg: '这是我的设计bar',
            vertical: '0',
            isShowCvs: false,
        }
    },
    computed: {
        ...mapState(["cvsState"]),
        ...mapMutations([
            "changeCvsSizeFun"
        ]),
    },
    methods: {
       //控制画布尺寸弹出框
        isShowCvsFun() {
            this.isShowCvs = !this.isShowCvs
        },
        //改变画布大小
        CanvasSizeFun() {
            this.$store.state.app.cvsState = this.vertical
            this.changeCvsSizeFun
        },
        //closeMoudalFun 点击遮罩层关闭画布尺寸
        closeMoudalFun() {
            this.isShowCvs = false
        }
    },
}
</script>
<style scoped>
    .layout-nav{
        display: flex;
    }
    .layout-user{
        margin-left: auto;
    }
    .canvasSize{
        position: relative;
    }
    .canvasCard{
        position: absolute;
        top: 60px;
        left: 100px;
        color:#515A6E;
        text-align: left
    }
    .moudal{
        position: fixed;
        width: 100%;
        left: 0;
        top: 60px;
        min-height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: -1;
    }
</style>
