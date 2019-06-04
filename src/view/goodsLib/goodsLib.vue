<template>
    <div class="goodList_body">
        <div class="select_box">
            <Select v-model="selsectBrand" size="small" style="width:100px" placeholder="品牌" clearable id="select">
                <Option v-for="(item ,index) in brandArr" :key="index" :value="item.name" :label="item.name" class="option">
                    <span>{{item.name}}</span>
                </Option>
            </Select>
            <Select v-model="selsectStyle" size="small"  placeholder="风格" clearable style="width:100px" id="select">
                <Option v-for="(item ,index) in styleArr" :key="index" :value="item.name" :label="item.name" class="option">
                    <span>{{item.name}}</span>
                </Option>
            </Select>
            <Select v-model="selsectClassify" size="small"  placeholder="分类" clearable style="width:100px" id="select">
                <Option  v-for="(item ,index) in brandArr" :key="index" :value="item.name" :label="item.name" class="option">
                    <span>{{item.name}}</span>
                </Option>
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
import { goodsList } from '@/api/material.js'
export default {
    name: 'goodsLib',
    data() {
        return {
            msg: '这是商品库',
            goodsImgArr:[],
            selsectBrand:"selsectBrand",
            selsectStyle:"selsectStyle",
            selsectClassify:"selsectClassify",
            brandArr:[
                {name:"中国",id:"0"},
                {name:"日本",id:"1"},
                {name:"韩国",id:"2"},
                {name:"欧美",id:"3"},
                {name:"非洲",id:"4"},
                {name:"美洲",id:"5"},
            ],
            styleArr:[
                {name:"简约",id:"0"},
                {name:"中式",id:"1"},
                {name:"欧美",id:"2"},
                {name:"东南亚",id:"3"},
            ],
            classifyArr:[
                {name:"沙发",id:"0"},
                {name:"椅子",id:"1"},
                {name:"茶几",id:"2"},
                {name:"床",id:"3"},
                {name:"桌子",id:"4"},
            ],
            goodsLibModal: false,
            social:[],
            getGoods:{ page : null, style_id : null, keywords : null, brand_id : null, category_id : null}
        }
    },
    mounted() {
        this.handlegoodsList(this.getGoods)
    },
    methods: {
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
        handlegoodsList(getGoods){
            let getGoods2 = this.getGoods
            goodsList(getGoods2.page, getGoods2.style_id, getGoods2.keywords, getGoods2.brand_id, getGoods2.category_id).then(res=>{
                this.goodsImgArr = res.data.message.data
                console.log( res)
            }).catch(err=>{
                console.log( err)
            })
        }
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
    color: black
  }
.select_box  /deep/ .ivu-select-item:hover {
    background: #f90;
  }
.goodList_body{
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
</style>
