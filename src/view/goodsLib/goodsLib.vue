<template>
    <div class="goodList_body">
        <div class="goodsList">
            <div v-for="(item,index) in goodsListArr" :key=index class="goodsTabs" @click="changeGoodsNav(item.id)" :class="{goodsNavActive:goodsNav==item.id}">{{item.title}}</div>
        </div>
        <div  class="vertical"  v-show="goodsNav == 0">
            <Button class="roomlabel" @click="changeChooseLableFun(1,0)" :class="{choose:brandLableId==0}">全部</Button>
            <Button class="roomlabel" @click="changeChooseLableFun(1,item.bid)" :class="{choose:brandLableId==item.bid}" 
                v-for="(item ,index) in brandArr"  :value="item.bid" :key="index" :label="item.name">
                {{item.name}}
            </Button>
        </div>
        <div  class="vertical" v-show="goodsNav == 1">
            <Button class="roomlabel" @click="changeChooseLableFun(0,0)" :class="{choose:styleLableId==0}">全部</Button>
            <Button class="roomlabel" @click="changeChooseLableFun(0,item.id)" :class="{choose:styleLableId==item.id}" 
                v-for="(item,index) in styleArr" :key="index">
                {{item.name||item.style_name}}
            </Button>
        </div>
        <div class="vertical" v-show="goodsNav == 2">
            <Button class="roomlabel" @click="changeChooseLableFun(2,0)" :class="{choose:spaceLabelId==0}">全部</Button>
            <Button class="roomlabel" @click="changeChooseLableFun(2,item.id||item.cat_id)" :class="{choose:spaceLabelId==(item.id?item.id:item.cat_id)}" 
                v-for="(item,index) in classifyArr" :key="index">
                {{item.name||item.cat_name}}
                <div class="brand_lable">
                    <!-- <li  v-for="(itemSon ,index) in item.son" :key="index"  :label="itemSon.cat_name"   :value="itemSon.cat_id" :class="{series_choose:seriesId==m.id}" @click.stop="changeChooseSeriesFun(2,item.bid,m.id)">
                        {{m.series_name}}
                    </li> -->
                    <li v-for="(m,n) in item.son" :key="n" :class="{series_choose:seriesId==m.cat_id}" @click.stop="changeChooseSeriesFun(2,item.bid,m.cat_id)">
                        {{m.cat_name}}
                    </li>
                </div>
            </Button>
        </div>

        <Spin fix v-if="this.$store.state.app.isShowSpin">
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
        <div>
            <ul class="goodsUl flexLayout">
                <li class="goodsLi" v-for="(item,index) in goodsImgArr" :key="index" @click="goodsImgDownFun(item,index)"  @mouseenter="mouseenter(item,index)"  @mouseleave="mouseleave(item,index)">
                    <!-- <span  v-for="(items,index) in item.imgs" :key="index" :id ="items.id" ></span> -->
                    <img class="goodsImg" :src="item.goods_thumb" :id="item.goods_id" :name ="item.goods_id" alt="图片丢失"  >
                    <div class="iconBox flexLayout">
                        <div @click="iconshoucang1Fun(index)" ><i  class="iconfont iconshoucang1"></i></div>
                        <div @click="iconxiazaiFun(index)"><i  class="iconfont iconxiazai"></i></div>
                    </div>
                    
                </li>
            </ul>
            <Spin fix v-if="isShowSpin">
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
        </div>
        <div class="goodsModalBox">
            <Modal
                title="下载的商品"
                v-model="goodsLibModal"
                :styles="{left: '80px',top: '180px',margin:'0',width:'340px'}">
                <ul class="flexLayout">
                    <li class="goodsLi" v-for="(item,index) in goodsImgArr" :key="index">
                        <CheckboxGroup v-model="social"  class="checkBoxLeftTop">
                            <Checkbox :label="index">&nbsp;</Checkbox>
                        </CheckboxGroup>
                        <img class="goodsImg" :src="item.goods_thumb" alt="图片丢失">
                    </li>
                </ul>
            </Modal>
        </div>
    </div>
</template>
<script>
import { goodsList, category } from '@/api/material.js'
import {mapState, mapGetters, mapActions} from 'vuex'
export default {
    name: 'goodsLib',
    data() {
        return {
            msg: '这是商品库',
            goodsImgArr:[],
            selsectBrand:[],
            selsectStyle:[],
            selsectClassify:[],
            brandArr:[],
            styleArr:[],
            classifyArr:[],
            classifySonArr:[],
            goodsLibModal: false,
            social:[],
            getGoods:{ page : null, style_id : null, keywords : null, brand_id : null, category_id : null},
            spaceLabelId:0,// 选择的分类标签id
            styleLableId:0,// 选择的风格标签id
            brandLableId:0,// 选择的品牌标签id
            seriesId:0,// 分类下面的系列id
            goodsNav:0,
            goodsListArr:[
                {title:'品牌',id:'0'},
                {title:'风格',id:'1'},
                {title:'分类',id:'2'}
            ]

        }
    },
    computed: {
        ...mapState({
                isShowSpin: state =>{
                    return state.app.isShowSpin
                },
                goodsItem: state =>{
                    return state.app.goodsItem
                },
            }),
        ...mapGetters([
                'card',
                'selectedObj',
            ]),
    },
    mounted() {
        this.handlegoodsList(this.getGoods)
        this.handlecategory()
    },
    methods: {
        ...mapActions([
            'saveState',
            'setGoodsItem',
        ]),
        /**
         * start function
         */
        mouseenter(item,index) {

        },
        mouseleave(item,index) {

        },
        goodsImgDownFun(item,index) {
            this.modal9 = true;
            this.$store.dispatch("setGoodsItem", item)
            this.$store.dispatch("setImgIndex", 0)
        },
        iconshoucang1Fun(index) {
            console.log("收藏", index)
        },
        iconxiazaiFun(index) {
            console.log( "下载", index)
        },
                // 筛选表签
        changeChooseLableFun (type,id) {
            console.log("0.0",type,id)
            switch (type) {
                case 0:
                    this.styleLableId=id; 
                    this.ChangeStyleOpt(id)
                    break;          
                case 1:
                    this.brandLableId=id; 
                    this.ChangebrandOpt(id)
                    break;                 
                case 2:
                    this.spaceLabelId=id; 
                    this.seriesId = 0;
                    this.ChangeClassifyOpt(id)
                    break;
                default:
                    break;
            }
       },
    changeChooseSeriesFun (type,id,series_id) {
           this.brandLableId = id;
           this.seriesId = series_id
           this.ChangeClassifyOpt(series_id)
       },
       //改变nav
       changeGoodsNav(id){
           this.goodsNav = id
           switch (id) {
               case 0:

                   break;
               case 1:

                   break;
               case 2:

                   break;
           
               default:
                   break;
           }
       },
        //品牌列表改变
        ChangebrandOpt(value){
            this.getGoods.brand_id = value
            this.handlegoodsList(this.getGoods)
        },
         //风格列表改变
        ChangeStyleOpt(value){
            this.getGoods.style_id = value
            this.handlegoodsList(this.getGoods)
        },
         //分类列表改变
        ChangeClassifyOpt(value){
            this.getGoods.category_id = value
            this.handlegoodsList(this.getGoods)
        },
        /**
         * end function
         * start api
         */
        handlegoodsList(getGoods){
            let getGoods2 = this.getGoods
            goodsList(getGoods2.page, getGoods2.style_id, getGoods2.keywords, getGoods2.brand_id, getGoods2.category_id).then(res=>{
                this.goodsImgArr = res.data.message.data
                // console.log('------------------', res)
                
            }).catch(err=>{
                console.log( err)
            })
        },
        //品牌列表
        handlecategory() {
            category().then(res=>{
                this.brandArr = res.data.message.brand
                this.styleArr = res.data.message.style
                this.classifyArr = res.data.message.category
            }).catch(err=>{
                console.log( err)
            })
        },
        /**
         * end api
         */
    },
    
}
</script>
<style scoped>
.goodsList{
    display:flex;
    justify-content:space-around;
    width: 100%;
    border-bottom: 1px solid #666;
    padding: 20px 0;
    cursor: pointer;
}
.goodsNavActive{
    color: #f90;
    border-bottom: 1px solid #f90;
}
.goodsTabs{
    font-size: 20px;
    height: 50px;
    line-height: 50px;
    flex: 1;
}
.option{
    text-align: left;
}
.goodList_body{
    position: relative;
    height: 90vh;
}
.select_box{
    margin-top: 10px;
}
#select>div{
    background: #293039 !important;
}
.flexLayout{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
}
.goodsUl{
    padding: 10px 30px;
    
}
.goodsLi{
    position: relative;
    margin-top: 10px;
    background: white
}
.iconBox{
    width: 100%;
    position: absolute;
    padding: 0 5px;
    top: 5px;
}
i{
    font-size: 10px
}
.iconBox>div{
    width: 16px;
    height: 16px;
    border-radius: 3px;
    line-height: 16px;
    background: rgba(0, 0, 0, 0.5)
}
.goodsImg{
    width: 100px;
    height: 100px;
}
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;    
}
.ivu-modal{
    top: 0;
    left:0;
    margin:0;
    width:0;
}
.checkBoxLeftTop{
    position: absolute;
    top: 0px;
    left: 0px;
    color: gold
}
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
.roomlabel{
    margin-top: 10px;
    margin-left: 10px;
    font-size: 14px;
    position: relative;
}
.roomlabel:hover .brand_lable{
    display: block
}
.roomlabel:hover .brand_lable li{
    color: #666
}
.brand_lable li:hover{
    background: #f2f2f2;
}
.brand_lable{
    position: absolute;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    left: 0;
    top: 32px;
    width: 100%;
    z-index: 99;
    display: none;
}
.brand_lable li{
    word-wrap:break-word;
    line-height: 30px;
    width: 100%;
}
.vertical{
    margin: 0;
}
.vertical span{
    font-size: 12px;
    color: #333;
}
.choose{
    background-color: #ff9a00;
    color: #fff;
    margin-left: 10px;
}
.series_choose{
    background-color: #ff9a00!important;
    color: #fff!important;
}
</style>
