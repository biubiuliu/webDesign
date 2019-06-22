<template>
    <div class="materialLib">
        <!-- <h1 style="color:red">{{msg}}</h1> -->
        <div class="tag">
            <div id="commonsId" class="commons_room active" @click="commonsRFun">
                公共库
            </div>
            <div id="privateId" class="private_room" @click="privateRFun">私人库</div>
        </div>
        <div>
            <div class="comm_body" v-if="this.bgUrl">
                <div class="materialBg_title">
                    <span>
                        <a v-if="this.bgUrl.length !== 0 &&!isAll" @click="bgAll" class="allCursor">
                            <i class="iconfont iconfanhui"></i> 
                        </a> &#8194; 背景
                    </span>
                    <span v-if="this.bgUrl.length !== 0 &&isAll" @click="bgAll" class="allCursor">全部<i class="iconfont iconyou"></i> </span>
                    <!-- <span v-else class="allCursor"><i class="iconfont iconyou"></i> </span> -->
                </div>
                <ul class="reuseUl" v-if="this.bgUrl.length !== 0">
                    <li class="reuseLi" v-for="bgImg in bgUrl"  :key="bgImg.id" >
                        <a href="javascript:;" class="delback" v-if="!isAll&&is_personal" @click.stop="delMaterial(bgImg.id,2)">
                            <i class="iconfont iconshanchu"></i>
                        </a>
                        <img :src="bgImg.img_url" alt="图片丢失" :id="bgImg.id"  @click="selectDecorate"  crossorigin="anonymous">
                    </li>
                </ul>
                <div v-else class="materiaHeight">
                    <h4 v-if="isShowSpin">加载中 ... </h4>
                    <h4 v-else> 暂无背景</h4>
                </div>
            </div>
            <div class="comm_body" v-if="this.materialBgImgArr">
                <div class="materialBg_title">
                    <span>
                        <span v-if="this.isAll" ></span>
                        <a @click="bgMateial" v-else class="allCursor" >
                            <i class="iconfont iconfanhui"></i>
                        </a>  &#8194;
                        {{ isAll?'素材':materialCardArr&&materialCardArr[getmaterialData.material_type-1]
                            &&materialCardArr[getmaterialData.material_type-1].name?materialCardArr[getmaterialData.material_type-1].name:''}}
                    </span>                  
                </div>
                <ul class="reuseUl" v-if="this.isAll">
                    <li  @click="bgMateial(item)" class="reuseLiCard" v-for="item in materialCardArr" :key='item.id' :class="item.bgColor">
                        <i :class="item.icon"></i>
                        <p>{{item.name}}</p>
                    </li>
                </ul>
                <div v-else  >
                    <h4 v-if="isShowSpin">加载中 ... </h4> 
                    <ul v-else class="reuseUl">
                        <li class="reuseLi" v-for="item in materialBgImgArr" :key="item.id">
                            <a href="javascript:;" class="delback" v-if="!isAll&&is_personal" @click.stop="delMaterial(item.id,1)">
                                <i class="iconfont iconshanchu"></i>
                            </a>
                            <img :src="item.material_img" :id="item.id"   @click="selectDecorateMaterial" alt="图片丢失"  crossorigin="anonymous">
                        </li>
                    </ul>

                </div>
                
                
            </div>
            <div class="comm_body" v-if="this.goodsBgImgArr">
                <div class="materialBg_title">
                    <span>
                        <a @click="bgCustom"  v-if='!isAll' class="allCursor">
                            <i class="iconfont iconfanhui"></i>
                        </a>  &#8194;自定义商品
                    </span>
                    <span @click="bgCustom"  v-if='isAll' class="allCursor">全部
                        <i class="iconfont iconyou"></i>
                    </span>
                </div>
                <ul v-if="this.goodsBgImgArr.length !== 0" class="reuseUl">
                    <li class="reuseLi" v-for="(item,index) in goodsBgImgArr" :key="index">
                        <a href="javascript:;" class="delback" v-if="!isAll&&is_personal" @click.stop="delMaterial(item.goods_id,3)">
                            <i class="iconfont iconshanchu"></i>
                        </a>
                        <img :src="item.pic_image" :id="item.goods_id" :name ="item.id"  @click="selectDecorateGoods" alt="图片丢失"  crossorigin="anonymous">
                    </li>
                </ul>
                <div v-else class="materiaHeight">
                    <h4 v-if="isShowSpin">加载中 ... </h4>
                    <h4 v-else> 暂无自定义商品图</h4>
                </div>
            </div>
        </div>
        <Spin class="spin" fix  v-if="this.$store.state.app.isShowSpin">
            <div class="balls" >
                <div></div>
                <div></div>
                <div></div>
            </div>
        </Spin>
        <Page v-if="!this.isAll" class="pages" :total="this.pages.total" :page-size="this.pages.per_page" show-elevator size='small' @on-change="nextPage" />
    </div>
</template>
<script>
import { fabric } from 'fabric'
import {mapState, mapGetters, mapActions} from 'vuex'
import { getmaterial, getmaterialList, delMaterialImg } from '@/api/material.js'
import "@/assets/css/loading.css"

export default {
    name: 'materialLib',
    data() {
        return {
            msg: '这是素材库',
            bgUrl: [],
            isRoow: true,
            goodsBgImgArr:[],
            materialBgImgArr:[],
            isAll:true,
            materialCardArr:[
                {name:'图形',id:'1',icon:'iconfont iconjihegeometric12', bgColor:'reuserLibgColor0'},
                {name:'色卡',id:'2',icon:'iconfont iconzhuti_tiaosepan_o', bgColor:'reuserLibgColor1'},
                {name:'灯光',id:'3',icon:'iconfont icondengguang', bgColor:'reuserLibgColor2'},
                {name:'阴影',id:'4',icon:'iconfont iconbackground', bgColor:'reuserLibgColor3'},
                {name:'透视',id:'5',icon:'iconfont icontoumingdutiaojie', bgColor:'reuserLibgColor4'},
            ],
            getmaterialData:{
                is_personal: 0,
                page: 1,
                type: null, 	// 1代表素材列表，2代表背景图列表，3代表自定义商品列表
                material_type:null, // 获取素材时传对应的分类
            },
            is_personal:0,
            // 分页
            pages: {
                total: null, 	      // 总条数
                per_page: 40,       // 每页多少条
                current_page: 1 ,  // 当前第几页
            },            
        }
    },
    computed: {
        ...mapState({
            isShowSpin: state =>{
            return state.app.isShowSpin
            },
            schemeId: state =>{
            return state.app.schemeId
            },
        }),
        ...mapGetters([
            'card',
            'selectedObj',
            'setGoodsItem',
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
        this.handleGetgetmaterial(this.is_personal)
        this.$store.dispatch("setGoodsItem", null)
        // console.log('新建设计2',this.schemeId)
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
                scaleX: card.width / img.width, 
                scaleY: card.width / img.height,
                left:0,
                top: 0,
                src:e.target.src,
                imgType:0, // imgType:0背景,1素材 2自定义商品
                goods_id: null,
                goodsImg_id:null,
                material_id: null,
                // backgroundImgId:e.target.id
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
                left: Math.random().toFixed(2)*200 + 100,
                top: Math.random().toFixed(2)*200 + 100,
                scaleX: 200/img.width, 
                scaleY: 200/img.height ,
                src:e.target.src,
                imgType:1,
                goods_id: null,
                goodsImg_id:null,
                material_id: e.target.id,
                // backgroundImgId:e.target.id
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
                left: Math.random().toFixed(2)*200 + 100,
                top: Math.random().toFixed(2)*200 + 100,
                scaleX: 200/img.width, 
                scaleY: 200/img.height ,
                src:e.target.src,
                imgType:2,
                goods_id: e.target.id,
                goodsImg_id:e.target.name,
                material_id: e.target.id,
                // backgroundImgId:e.target.id
            }); 
            card.add(img).setActiveObject(img)
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
        //bgAll 全部背景
        bgAll(){
            window.event? window.event.cancelBubble = true : e.stopPropagation();
            this.isAll = !this.isAll
            if(!this.isAll){
                this.getmaterialData.type = 2
                this.handleGetmaterialList(this.getmaterialData)
                return;
            }
            this.handleGetgetmaterial(this.is_personal)
        },
        //bgMateial 全部素材
        bgMateial(item){
            console.log("全部素材",item.id)
            window.event? window.event.cancelBubble = true : e.stopPropagation();
            this.isAll = !this.isAll
            if(!this.isAll){
                this.getmaterialData.type = 1
                this.getmaterialData.material_type = item.id
                this.handleGetmaterialList(this.getmaterialData)
                return;
            }
            this.handleGetgetmaterial(this.is_personal)
        },
        //bgAll 全部自定义
        bgCustom(){
            window.event? window.event.cancelBubble = true : e.stopPropagation();
            this.isAll = !this.isAll
            if(!this.isAll){
                this.getmaterialData.type = 3
                this.handleGetmaterialList(this.getmaterialData)
                return;
            }
            this.handleGetgetmaterial(this.is_personal)
        },
        privateRFun(){
            this.isAll = true
            this.getmaterialData.is_personal = 1
            this.is_personal = 1
            this.handleGetgetmaterial(this.is_personal)
            var commonsId = document.getElementById("commonsId")  
            let privateId = document.getElementById("privateId")
            this.addClass(privateId,"active");  
            this.removeClass(commonsId,"active");  
        },
        commonsRFun() {
            this.isAll = true
            this.getmaterialData.is_personal = 0
            this.is_personal = 0
            this.handleGetgetmaterial(this.is_personal)
            var commonsId = document.getElementById("commonsId")  
            let privateId = document.getElementById("privateId")
            this.removeClass(privateId,"active");  
            this.addClass(commonsId,"active"); 
        },
        // 分页
        nextPage(e) {
            this.getmaterialData.page = e
            this.handleGetmaterialList(this.getmaterialData)
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
        //请求素材库更多
        handleGetmaterialList (getmaterialData) {
            getmaterialList(getmaterialData).then(res => {
                switch (this.getmaterialData.type) {
                    case 1:
                        this.materialBgImgArr = res.data.message.meater.data
                        this.pages.total = res.data.message.meater.total
                        this.pages.per_page = res.data.message.meater.per_page
                        this.bgUrl = null
                        this.goodsBgImgArr = null
                        break;
                    case 2:
                        this.bgUrl = res.data.message.backgroundImg.data
                        this.pages.total = res.data.message.backgroundImg.total
                        this.pages.per_page = res.data.message.backgroundImg.per_page
                        this.materialBgImgArr = null
                        this.goodsBgImgArr = null
                        break;
                    case 3:
                        this.goodsBgImgArr = res.data.message.goods.data
                        this.pages.total = res.data.message.goods.total
                        this.pages.per_page = res.data.message.goods.per_page
                        this.materialBgImgArr = null
                        this.bgUrl = null
                        break;
                
                    default:
                        break;
                }
                
            }).catch(err => {
                console.log(err)
            })
        },

        // 删除私人库素材
        delMaterial(id,type){
            this.$Modal.confirm({
                    title: '提示',
                    content: '<p>是否删除该图片？</p>',
                    onOk: () => {
                        let params = {
                           ids:id.toString(),
                           type:type 
                        }
                        delMaterialImg(params).then(res=>{
                            if(res.data.success){                               
                                this.operation(id,type)
                                this.$Message.success(res.data.message);
                            }
                        })                       
                    },
                    onCancel: () => {
                        //this.$Message.info('Clicked cancel');
                    }
            });
        },

        operation (id,type){
            switch (type) {
                case 1:
                    this.materialBgImgArr =  this.materialBgImgArr.filter((obj) => (obj.id !== id))
                    break;
                case 2:
                    this.bgUrl =  this.bgUrl.filter((obj) => (obj.id !== id))
                    break;
                case 3:
                    this.goodsBgImgArr =  this.goodsBgImgArr.filter((obj) => (obj.id !== id))
                    break;
                default:
                    break;
            }
        },
    },
}
</script>
<style scoped>
.spin{
    background-color:rgba(0, 0, 0, 0) !important;
}
.materiaHeight{
    width: 100%;
    height: 160px;
    line-height: 160px;
    /* border: 1px solid rgba(238, 235, 235, 0.363) */
}
.allCursor{
    cursor: pointer
}
.materialLib{
    height: 92vh;
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
    align-items: center;
}
.materialBg_title span{
    font-size: 14px;
}
.materialBg_title a i{
    color: rgba(255,255,255,.7)
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
    width: 70px;
    height: 70px;
    background: white;
    list-style: none;
    margin:10px 0 0 10px;
    position: relative;
}
.reuseLiCard{
    width: 70px;
    height: 70px;
    cursor: pointer;
    list-style: none;
    margin:10px 0 0 10px

}
.reuserLibgColor0{
    background: #58BA8B;
}
.reuserLibgColor1{
    background: #678AED;
}
.reuserLibgColor2{
    background: #F8BF34;
}
.reuserLibgColor3{
    background: #5A6D8D;
}
.reuserLibgColor4{
    background: #A08E80;
}
.reuseLiCard i{
    font-size: 30px
}
.reuseLi>img{
    width: 70px;
    height: 70px;  
}
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
.demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
}
.delback{
    display: none;
    position: absolute;
    right:3px;
    top:3px;
    height: 15px;
    width:15px;
    background: #fff;
    border-radius: 2px;
}
.reuseLi:hover .delback{
    display: block;
    text-align: center;
}
.iconshanchu{
    color:#666;
    font-size: 12px;
}
</style>
