<template>
    <div>
        <design-bar class="dseignBar"></design-bar>
        <left-bar></left-bar>
        <div class="conten-box">
            <div class="block" id="routerV">
                <div class="drawers_body" id="trol">
                    <router-view class="drawers_div" ></router-view>
                    <div class="drawes_trol">
                        <div class="btn_drawer" @click="drawerTrol"><i id="Alicon" :class="leftIcon"></i></div>
                    </div>
                </div>
            </div>
            <div class="canvas_body">
                <action-bar></action-bar>
                <div class="canvas_div">
                    <canvas-card v-show="!this.goodsItem"></canvas-card>
                    <goods-img v-show="this.goodsItem"></goods-img>
                </div>
            </div>
            <div class="block" id="routerVR" v-if="isShowRNav&&this.goodsItem">
                <div class="drawers_bodyR" id="trolR">
                    <goods-info :id="this.goodsItem.goods_id"/>
                    <div class="drawes_trolR">
                        <div class="btn_drawerR" @click="drawerTrolR"><i id="AliconR" :class="rightIcon"></i></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import designBar from '@/components/commons/designBar/designBar'
import leftBar from '@/components/commons/leftBar/leftBar'
import actionBar from '@/components/commons/actionBar/actionBar'
import canvasCard from '@/components/commons/canvasCard/canvasCard'
import goodsImg from '@/components/commons/goodsImg/goodsImg'

import materialLib from '@/view/materialLib/materialLib'
import goodsLib from '@/view/goodsLib/goodsLib'
import favorite from '@/view/favorite/favorite'
import uploading from '@/view/uploading/uploading'

// 商品信息
import goodsInfo from  '@/components/commons/goodsInfo/goodsInfo'

import {mapState} from 'vuex'
export default {
name: 'designHome',

components: {
    designBar,
    leftBar,
    actionBar,
    canvasCard,
    goodsImg,
    materialLib,
    goodsLib,
    favorite,
    uploading,
    goodsInfo
},
    watch: {
        $route(to) {
            this.buttonControl = false;
            this.drawerTrol();
            if(to.name =='goodsLib' || to.name =='favorite'){
                this.isShowRNav = true;
            }else{
                this.isShowRNav = false;
            }
        },
    },
    data() {
        return {
            msg: '这是内容创建设计',
            buttonControl: true,
            buttonControlR: true,
            leftIcon: 'iconfont iconzuo',
            rightIcon: 'iconfont iconyou',
            isShowRNav:false,
        }
    },
    computed: {
        ...mapState({
            goodsItem: state =>{
                    return state.app.goodsItem
                },
            }),
    },
    created() {
        if(this.$route.name =='goodsLib' || this.$route.name =='favorite'){
            this.isShowRNav = true;
        }
    },
    methods: {
        drawerTrol() {
            this.buttonControl = !this.buttonControl;
            var trol = document.getElementById('trol')
            var routerV = document.getElementById('routerV')
            var Alicon = document.getElementById('Alicon')
            if(this.buttonControl !==false){
                trol.style.width = '400px';
                routerV.style.width = '400px';
                this.leftIcon = 'iconfont iconzuo'
            }else{
                trol.style.width = '0px';;
                routerV.style.width = '0px';;
                this.leftIcon = 'iconfont iconyou'
            }
        },
        drawerTrolR () {
            this.buttonControlR = !this.buttonControlR;
            var trolR = document.getElementById('trolR')
            var routerVR = document.getElementById('routerVR')
            var AliconR = document.getElementById('AliconR')
            if(this.buttonControlR !==false){
                trolR.style.width = '320px';
                routerVR.style.width = '320px';
                this.rightIcon = 'iconfont iconyou '
            }else{
                trolR.style.width = '0px';
                routerVR.style.width = '0px';
                this.rightIcon = 'iconfont iconzuo';
            }
        }
    },
}
</script>
<style scoped>
.block{
    display: block;
    width: 400px;
    transition-property:width;
    transition-duration:.5s;
    transition-timing-function:ease;
}
.conten-box{
    display: flex;
}
.dseignBar{
    z-index: 999;
}
.drawers_body{
    background: #293039;
    margin: 60px 0 0 60px;
    position: fixed;
    width: 400px;
    height: 100%;
    z-index: 1;
    transition-property:width;
    transition-duration:.5s;
    transition-timing-function:ease;
}
.drawers_bodyR{
    background: #293039;
    margin: 60px  0px 0 0;
    position: fixed;
    right: 0px;
    width: 320px;
    height: 100%;
    transition-property:width;
    transition-duration:.5s;
    transition-timing-function:ease;
}
.drawes_trol{
    position: absolute;
    right: -18px;
    top: 30%;
    cursor: pointer;
}
.drawes_trolR{
    position: absolute;
    left: -18px;
    top: 30%;
    cursor: pointer;
}
.drawers_div{
    overflow-x:hidden;
    height: 100%;
}
.btn_drawer,.btn_drawerR{
    width: 20px;
    height: 50px;
    border-radius: 5px;
    line-height: 50px;
    background: #293039;
}
.canvas_body{
    width: 100%;
    min-height:100vh;
    background: #EDF0F2;
    display: flex;
    flex-direction: column;
    align-items: center;

}
.canvas_div{
    margin-top: 20px;
    color: black
}

</style>
