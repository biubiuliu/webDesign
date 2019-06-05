<template>
    <div class="goodList_body">
        <Spin fix v-if="this.$store.state.app.isShowSpin">
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
        <div class="select_box">
            <Select v-model="selsectBrand" size="small"  style="width:100px" placeholder="品牌" clearable id="select1"
                    @on-change="ChangebrandOpt">
                <Option v-for="(item ,index) in brandArr"  :value="item.bid" :key="index" :label="item.brandName" class="option">
                    <span>{{item.brandName}}{{item.bid}}</span>
                </Option>
            </Select>
            <Select v-model="selsectStyle" size="small"  placeholder="风格" clearable style="width:100px" id="select2"
                    @on-change="ChangeStyleOpt">
                <Option v-for="(item ,index) in styleArr" :key="index" :value="item.id" :label="item.style_name" class="option">
                    <span>{{item.style_name}}</span>
                </Option>
            </Select>
            <Select v-model="selsectClassify" size="small"  placeholder="分类" clearable style="width:100px" id="select3"
                    @on-change="ChangeClassifyOpt">
                <OptionGroup v-for="(item ,index) in classifyArr" :key="index"  :label="item.cat_name">
                    <Option v-for="(itemSon ,index) in item.son" :key="index"  :label="itemSon.cat_name"   :value="itemSon.cat_id"  class="option">
                        <span>{{itemSon.cat_name}}</span>
                    </Option>
                </OptionGroup>
            </Select>
        </div>
        <div>
            <ul class="goodsUl flexLayout">
                <li class="goodsLi" v-for="(item,index) in goodsImgArr" :key="index" @click="goodsImgDownFun"  @mouseenter="mouseenter(item,index)"  @mouseleave="mouseleave(item,index)">
                    <img class="goodsImg" :src="item.goods_thumb" alt="">
                    <div class="iconBox flexLayout" v-if="true">
                        <div @click="iconshoucang1Fun(index)" ><i  class="iconfont iconshoucang1"></i></div>
                        <div @click="iconxiazaiFun(index)"><i  class="iconfont iconxiazai"></i></div>
                    </div>
                </li>
            </ul>
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
            getGoods:{ page : null, style_id : null, keywords : null, brand_id : null, category_id : null}
        }
    },
    mounted() {
        this.handlegoodsList(this.getGoods)
        this.handlecategory()
    },
    methods: {
        /**
         * start function
         */
        mouseenter(item,index) {
            item.isShowIcon = true; 
        },
        mouseleave(item,index) {
            item.isShowIcon = false;
        },
        goodsImgDownFun() {
            this.modal9 = true;
        },
        iconshoucang1Fun(index) {
            console.log("收藏", index)
        },
        iconxiazaiFun(index) {
            console.log( "下载", index)
        },
        //品牌列表改变
        ChangebrandOpt(value){
            this.getGoods.brand_id = value
            this.handlegoodsList(this.getGoods)
            console.log("你改变了品牌",value)
        },
         //风格列表改变
        ChangeStyleOpt(value){
            this.getGoods.style_id = value
            this.handlegoodsList(this.getGoods)
            console.log("你改变了风格",value)
        },
         //分类列表改变
        ChangeClassifyOpt(value){
            this.getGoods.category_id = value
            this.handlegoodsList(this.getGoods)
            console.log("你改变了分类",value)
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
                // this.classifySonArr = res.data.message.category
            console.log('------------------', res.data.message)
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
.select_box  /deep/ .ivu-select-selection {
    color: white;
    background: #293039;
    border: 0;
}
.select_box  /deep/ .ivu-select-item-selected {
    /* background: #f90; */
    color: black;    
}
.select_box  /deep/ .ivu-select-item:hover {
    background: #f90;

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
.goodsModalBox{
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
</style>
