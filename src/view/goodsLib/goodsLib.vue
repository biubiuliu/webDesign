<template>
    <div class="goodList_body">
        <div class="goodsSearch">
            <Input search size="large" v-model="keyworldVal" placeholder="搜索你喜欢的" @on-search="searchGoodsList" />
        </div>
        
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
            <Button class="roomlabel" @click="changeChooseLableFun(2,0,null)" :class="{choose:spaceLabelId==0}">全部</Button>
            <Button class="roomlabel" @click="changeChooseLableFun(2,item.id||item.cat_id,item)" :class="{choose:spaceLabelId==(item.id?item.id:item.cat_id)}" 
                v-for="(item,index) in classifyArr" :key="index" v-show="isClassifySon" >
                {{item.name||item.cat_name}}
                <!-- <div class="brand_lable">
                    <li v-for="(m,n) in item.son" :key="n" :class="{series_choose:seriesId==m.cat_id}" @click.stop="changeChooseSeriesFun(2,item.bid,m.cat_id)">
                        {{m.cat_name}}
                    </li>
                </div> -->
                
            </Button>
            <Button v-show="!isClassifySon" class="roomlabel" v-for="m in classifySonArr" :key="m.cat_id" :class="{series_choose:seriesId==m.cat_id}" @click.stop="changeChooseSeriesFun(2,m.parent_id,m.cat_id)">
                {{m.cat_name}}
            </Button>
        </div>

        <Spin fix v-if="this.$store.state.app.isShowSpin">
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
        <div v-if="this.goodsImgArr.length !== 0">
            <ul class="goodsUl flexLayout">
                <li class="goodsLi" v-for="(item,index) in goodsImgArr" :key="index" @click="goodsImgDownFun(item,index)"  @mouseenter="mouseenter(item,item.goods_id)"  @mouseleave="mouseleave(item,item.goods_id)">
                    <!-- <span  v-for="(items,index) in item.imgs" :key="index" :id ="items.id" ></span> -->
                    <img class="goodsImg" :src="item.goods_thumb" :id="item.goods_id" :name ="item.goods_id" alt="图片丢失"  >
                    <div class="iconBox flexLayout"  :class="{ collectionDownActive:collectionDown==item.goods_id}" >
                        <div @click.stop="iconshoucang1Fun(item.goods_id)" ><i  class="iconfont iconshoucang1 collectActive"></i></div>
                        <div @click.stop="iconxiazaiFun(item,item.goods_id)"><i  class="iconfont iconxiazai"></i></div>
                    </div>
                    
                </li>
            </ul>
            <!-- <Spin fix v-if="isShowSpin">
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin> -->
        </div>
        <div v-else>
            <br/><br/><br/><br/>
            <h1>抱歉! 没有搜索到{{this.keyworldVal}}</h1>
        </div>
        <div class="goodsModalBox">
            <Modal
                title="下载的商品"
                v-model="goodsLibModal"
                @on-ok="goodsLibModalOk" 
                @on-cancel="goodsLibModalCancel"
                ok-text="下载"
                :styles="{left: '80px',top: '180px',margin:'0',width:'340px'}">
                <ul class="flexLayout" v-if="goodsImgSonArr.length !== 0">
                    <li class="goodsLiM" v-for="(item,index) in goodsImgSonArr" :key="index">
                        <CheckboxGroup v-model="social" @on-change="CheckboxFun(social)" true-value="true"  class="checkBoxLeftTop">
                            <Checkbox :label="item.pic_image">&nbsp;</Checkbox>
                        </CheckboxGroup>
                        <a :href="item.pic_image" download="image" target="blank">
                            <img class="goodsImg" :src="item.pic_image" alt="图片丢失">
                        </a>
                    </li>
                </ul>
                    <div v-else>
                        <h4>抱歉! 暂无相关图片</h4>
                    </div>
            </Modal>
        </div>
    </div>
</template>
<script>
import { goodsList, category, isCollect } from '@/api/material.js'
import {mapState, mapGetters, mapActions} from 'vuex'
import { constants } from 'fs';
export default {
    name: 'goodsLib',
    data() {
        return {
            msg: '这是商品库',
            goodsImgArr:[],
            goodsImgSonArr:[],
            selsectBrand:[],
            selsectStyle:[],
            selsectClassify:[],
            brandArr:[],
            styleArr:[],
            classifyArr:[],
            classifySonArr:[],
            isClassifySon:true,
            goodsLibModal: false,
            social:[],
            getGoods:{ page : null, style_id : null, keywords : null, brand_id : null, category_id : null},
            spaceLabelId:0,// 选择的分类标签id
            styleLableId:0,// 选择的风格标签id
            brandLableId:0,// 选择的品牌标签id
            seriesId:0,// 分类下面的系列id
            goodsNav:0,
            collectionDown:0, // 收藏 下载 id
            goodsListArr:[
                {title:'品牌',id:'0'},
                {title:'风格',id:'1'},
                {title:'分类',id:'2'}
            ],
            keyworldVal: null , // 搜索关键字
            // 收藏参数
            isCollectData:{
                id: null,//方案 id / 商品id
                type: 2,	//1：收藏方案 2：收藏商品
                is_cancel: 0 ,	//0（默认）：收藏 1： 取消收藏
            },
            downloadNum:0,

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
            this.collectionDown = index
            // console.log("mouseenter",item, index)
        },
        mouseleave(item,index) {
            this.collectionDown = 0
            // console.log("mouseleave",item, index)
        },
        goodsImgDownFun(item,index) {
            this.modal9 = true;
            this.$store.dispatch("setGoodsItem", item)
            this.$store.dispatch("setImgIndex", 0)
        },
        iconshoucang1Fun(index) {
            this.isCollectData.id = index
            this.handleGetisCollect(this.isCollectData);
            console.log("收藏", index)
        },
        iconxiazaiFun(item, index) {
            this.goodsImgSonArr = item.imgs
            this.goodsLibModal = true;
            // console.log( "下载", item.imgs, index)
        },
                // 筛选表签
        changeChooseLableFun (type,id,item) {
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
                    console.log("沙发 ",item)
                    if(id === 0 ){
                        this.isClassifySon = true
                    }else{
                        this.isClassifySon = false
                        this.classifySonArr = item.son
                    }
                    this.ChangeClassifyOpt(id)
                    break;
                default:
                    break;
            }
        },
        //批量下载
        　　
 
            　　
            
        circularWindow(){ //循环弹窗
    　　　　setTimeout(()=>{
    　　　　　　this.jumpDownloadWindow(this.downloadNum);
    　　　　},500);//次数设置一下延时，不然有的手机会因为反应不过来而出现误差
    　　},
        jumpDownloadWindow(i){//弹出下载窗口
        　　　　var fileFrame = document.createElement("iframe");
        　　　　fileFrame.src = this.social[i];//文件路径
        　　　　fileFrame.style.display = "none";
        　　　　document.body.appendChild(fileFrame);
        
        　　　　this.downloadNum++;
        　　　　if(this.downloadNum!=this.social.length){
        　　　　　　this.circularWindow();
    　　　　}
    
    　　},
        download(name, href){
            var a = document.createElement("a"), //创建a标签           
                e = document.createEvent("mouseevents"); //创建鼠标事件对象       
                e.initEvent("click", false, false); //初始化事件对象       
                a.href = href; //设置下载地址          
                a.download = name; //设置下载文件名       
                a.dispatchEvent(e); //给指定的元素，执行事件click事件    
        },
        CheckboxFun(params){
            console.log("批量下载选中", params)
        },
        goodsLibModalOk(){
            //方法执行次数
            // this.circularWindow(this.downloadNum);
            for (let index = 0; index < this.social.length; index++) {
                this.download( index + '.jpg', this.social[index]);
                alert("ok ",this.social[index] )
            }
            
        },
        goodsLibModalCancel(){
            this.social = []
            console.log("关闭 ")
        },
        changeChooseSeriesFun (type,id,series_id) {
            this.brandLableId = id;
            this.seriesId = series_id
            this.ChangeClassifyOpt(series_id)
        },
        //改变nav
        changeGoodsNav(id){
            this.goodsNav = id

        },
        //搜索商品
        searchGoodsList(){
            this.getGoods.keywords = this.keyworldVal
            this.handlegoodsList(this.getGoods)
            console.log('keyworldVal',this.keyworldVal)
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
            // console.log("分类",value)
        },
        /**
         * end function
         * start api
         */
        handlegoodsList(getGoods){
            let getGoods2 = this.getGoods
            goodsList(getGoods2.page, getGoods2.style_id, getGoods2.keywords, getGoods2.brand_id, getGoods2.category_id).then(res=>{
                this.goodsImgArr = res.data.message.data
                // console.log('------------------', this.goodsImgArr)
                
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
            }).catch(err=>{
                console.log( err)
            })
        },
        //收藏
        handleGetisCollect(data){
            isCollect(data).then( res => {
                console.log(res)
            }).catch( err => {
                console.log(err)
            })
        }
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
    padding: 10px 0 0 10px;
    cursor: pointer;
}
.goodsSearch{
    width: 100%;
    height: auto;
    padding: 20px  30px 0;
}
.goodsNavActive{
    color: #f90;
    border-bottom: 1px solid #f90;
}
.collectActive{
    color: #f90;
}
.collectionDownActive{
    display: flex  !important;
    flex-direction: row  !important;
    justify-content: space-between  !important;
    flex-wrap: wrap  !important;
    width: 100%;
    cursor: pointer;
    position: absolute;
    padding: 0 5px;
    top: 5px;
}
.goodsTabs{
    font-size: 18px;
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
    justify-content: space-around;
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
.goodsLiM{
    position: relative;
    margin-top: 10px;
    background:#F8F8F8;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
}
.iconBox{
    width: 100%;
    cursor: pointer;
    position: absolute;
    padding: 0 5px;
    top: 5px;
    display: none;
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
    box-shadow: -5px 1px 3px rgba(0, 0, 0, 0.3);
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
    padding: 0px 20px;
    text-align: left
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
