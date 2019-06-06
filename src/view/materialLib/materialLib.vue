<template>
    <div class="materialLib">
        <!-- <h1 style="color:red">{{msg}}</h1> -->
        <div class="tag">
            <div id="commonsId" class="commons_room active" @click="commonsRFun">
                公共库
            </div>
            <div id="privateId" class="private_room" @click="privateRFun">私人库</div>
        </div>
        <div v-if="isRoow">
            <div class="comm_body">
                <div class="materialBg_title">
                    <span>背景</span>
                    <span>全部 <i class="iconfont iconyou"></i> </span>
                </div>
                <ul class="reuseUl">
                    <li class="reuseLi" v-for="bgImg in bgUrl"  :key="bgImg.id" >
                        <img :src="bgImg.img_url" alt="图片丢失" :id="bgImg.id"  @click="selectDecorate"  crossorigin="anonymous">
                    </li>
                </ul>
            </div>
            <div class="comm_body">
                <div class="materialBg_title">
                    <span>素材</span>
                    <span>全部 <i class="iconfont iconyou"></i> </span>
                </div>
                <ul class="reuseUl">
                    <li class="reuseLi" v-for="bgImg in materialBgImgArr" :key="bgImg.id">
                        <img :src="bgImg.material_img"  @click="selectDecorateMaterial" alt="图片丢失"  crossorigin="anonymous">
                    </li>
                </ul>
            </div>
            <div class="comm_body">
                <div class="materialBg_title">
                    <span>自定义商品</span>
                    <span>全部 <i class="iconfont iconyou"></i> </span>
                </div>
                <ul class="reuseUl">
                    <li class="reuseLi" v-for="bgImg in goodsBgImgArr" :key="bgImg.goods_id">
                        <img :src="bgImg.pic_image"  @click="selectDecorateGoods" alt="图片丢失"  crossorigin="anonymous">
                    </li>
                </ul>
            </div>
        </div>
        <div v-else>
            <h1>私人库</h1>
        </div>
    </div>
</template>
<script>
import { fabric } from 'fabric'
import {mapGetters, mapActions} from 'vuex'
import { getmaterial } from '@/api/material.js'
export default {
    name: 'materialLib',
    data() {
        return {
            msg: '这是素材库',
            bgUrl: [
                // {
                // 'id': 5,
                // 'img_url': 'https://mdproduct.oss-cn-shenzhen.aliyuncs.com/images/201807/source_img/2204_P_1531341193163.jpg'
                // },
                // {
                // 'id': 6,
                // 'img_url': 'https://mdzs.oss-cn-shenzhen.aliyuncs.com/collocation/2019/04/28/edc7426a73e5cc5fb717472194c5b7e6.jpg'
                // },
                // {
                // 'id': 49,
                // 'img_url': 'https://mdzs.oss-cn-shenzhen.aliyuncs.com/collocation/2019/05/14/3ef8d4df3ab739a99e361924e3c71319.jpg'
                // },
                // {
                // 'id': 48,
                // 'img_url': 'https://mdzs.oss-cn-shenzhen.aliyuncs.com/collocation/2019/05/06/382cc9c4ffb493704502b64130713b8f.jpg'
                // },
            ],
            isRoow: true,
            goodsBgImgArr:[],
            materialBgImgArr:[]
        }
    },
    computed: {
        ...mapGetters([
            'card',
            'selectedObj',
        ]),
    },
    watch: {
    // 监听object选中变化
    // 图层layer滚动到对应object
        selectedObj() {
            // console.log('selectedObj change');
        }
    },
    created() {
        this.handleGetgetmaterial(0)
    },
    methods: {
        ...mapActions([
            'saveState',
        ]),
        // 选择装饰
        // 将背景图片渲染到canvas
        selectDecorate(e) {
            const card = this.card
            if (!card) return
            fabric.Image.fromURL(e.target.src, (img) => {
            img.set({
                borderColor: '#f90',
                cornerColor: '#f90',
                cornerSize: 10,
                transparentCorners: false,
                cornerStyle: 'circle',
                borderDashArray: [3,3],
                angle: 0,
                scaleX: card.width / img.width /2, 
                scaleY: card.width / img.height /2,
                left: 100,
                top: 100,
                src:e.target.src,
                imgType:0, // imgType:0背景,1素材 2自定义商品
                backgroundImgId:e.target.id
            });  
            card.add(img).setActiveObject(img)  
            this.saveState()
            },{crossOrigin: 'anonymous'})
        },
        // 将素材图片渲染到canvas
        selectDecorateMaterial(e) {
            const card = this.card
            if (!card) return
            fabric.Image.fromURL(e.target.src, (img) => {
            img.set({
                borderColor: '#f90',
                cornerColor: '#f90',
                cornerSize: 10,
                transparentCorners: false,
                cornerStyle: 'circle',
                borderDashArray: [3,3],
                angle: 0,
                left: 100,
                top: 100,
                scaleX: 200/img.width, 
                scaleY: 200/img.height ,
                src:e.target.src,
                imgType:1,
                backgroundImgId:e.target.id
            }); 
            card.add(img).setActiveObject(img)
            // img.crossOrigin = 'Anonymous';   
            this.saveState()
            },{crossOrigin: 'anonymous'})
        },
        // 将自定义商品图片渲染到canvas
        selectDecorateGoods(e) {
            const card = this.card
            if (!card) return
            fabric.Image.fromURL(e.target.src, (img) => {
            img.set({
                borderColor: '#f90',
                cornerColor: '#f90',
                cornerSize: 10,
                transparentCorners: false,
                cornerStyle: 'circle',
                borderDashArray: [3,3],
                angle: 0,
                left: 100,
                top: 100,
                scaleX: 200/img.width, 
                scaleY: 200/img.height ,
                src:e.target.src,
                imgType:2,
                backgroundImgId:e.target.id
            }); 
            card.add(img).setActiveObject(img)
            // img.crossOrigin = 'Anonymous';   
            this.saveState()
            },{crossOrigin: 'anonymous'})
        },
        // 判断有class是否存在
        hasClass(obj, cls) {  
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
        },
        // 添加class
        addClass(obj, cls) {  
            if (!this.hasClass(obj, cls)) obj.className += " " + cls;  
        }, 
        // 删除css
        removeClass(obj, cls) {  
            if (this.hasClass(obj, cls)) {  
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
                obj.className = obj.className.replace(reg, ' ');  
            }  
        },
        privateRFun(){  
            this.isRoow = false
            var commonsId = document.getElementById("commonsId")  
            let privateId = document.getElementById("privateId")
            this.addClass(privateId,"active");  
            this.removeClass(commonsId,"active");  
        },
        commonsRFun() {
            this.isRoow = true
            var commonsId = document.getElementById("commonsId")  
            let privateId = document.getElementById("privateId")
            this.removeClass(privateId,"active");  
            this.addClass(commonsId,"active"); 
        },
        //请求素材库api
        handleGetgetmaterial (is_personal) {
            getmaterial(is_personal).then(res => {
                this.bgUrl = res.data.message.backgroundImg
                this.goodsBgImgArr = res.data.message.goods
                this.materialBgImgArr = res.data.message.meater
                
            }).catch(err => {
                console.log(err)
            })
        },
    },
    
}
</script>
<style scoped>
.materialLib{
    height: 95vh;
}
.tag{
    width: 400px;
    height: auto;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    font-size: 16px;
    margin: 20px 0px;
    cursor: pointer;
}
.commons_room{
    width: 100px;
}
.private_room{
    width: 100px
}
.active{
    color: #FF9A00;
    border-bottom: 1px solid #FF9A00;

}
.comm_body{
    padding: 20px 30px;
    width: 400px;
}
.materialBg_title{
    display: flex;
    justify-content: space-between;
}
.reuseUl{
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: start;
    flex-wrap: wrap;
}
.reuseLi{
    width: 100px;
    height: 100px;
    background: white;
    list-style: none;
    margin:10px 0 0 10px

}
.reuseLi>img{
    width: 100px;
    height: 100px;
}
</style>
