<template>
    <div class="goodList_body">
        <!-- v-if="this.$store.state.app.isShowSpin" -->
        <Spin class="spin" fix  v-if="this.$store.state.app.isShowSpin">
            <!-- <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div> -->
            <div class="balls" >
                <div></div>
                <div></div>
                <div></div>
            </div>
        </Spin>
        <div class="goodsSearch">
            <Input search size="large" v-model="keyworldVal" placeholder="搜索你喜欢的" @on-search="searchGoodsList" />
            
        </div>
        <div class="bread_box">
            <Tag   color="warning" closable type="border"  @on-close="removeTag(item)"  v-for="(item,value,index) in serachTag.serachBrandAllTag"  :key="index" >{{item.name || item.series_name}}</Tag>            
            <Tag   color="warning" closable type="border"  @on-close="removeTag(item)"  v-for="(item,value,index) in serachTag.styleAllTag"  :key="index" >{{item.style_name}}</Tag>            
            <Tag   color="warning" closable type="border"  @on-close="removeTag(item)"  v-for="(item,value,index) in serachTag.isClassifyAllTag"  :key="index" >{{item.cat_name }}</Tag>            
        </div>
        
        <div class="goodsList">
            
            <div v-for="(item,index) in goodsListArr" :key=index class="goodsTabs" @click="changeGoodsNav(item.id)" :class="{goodsNavActive:goodsNav==item.id}">{{item.title}}</div>
        </div>
        <div  class="vertical"  v-show="goodsNav == 0">
            <Button class="roomlabel" @click="changeChooseLableFun(1,0)" :class="{choose:brandLableId==0}">全部</Button>
            <Button class="roomlabel" @click="changeChooseLableFun(1,item.bid,item)" :class="{choose:brandLableId==item.bid}" 
                v-for="(item ,index) in brandArr"  :value="item.bid" :key="index" :label="item.name" v-show="brandLabSon">
                {{item.name}}
            </Button>
            <Button v-show="!brandLabSon" class="roomlabel" v-for="m in brandSonArr" :key="m.id" :class="{series_choose:seriesId==m.id}" @click.stop="changeChooseSeriesFun(1,m.id,m.id,m)">
                {{m.series_name}}
            </Button>
        </div>
        <div  class="vertical" v-show="goodsNav == 1">
            <Button class="roomlabel" @click="changeChooseLableFun(0,0)" :class="{choose:styleLableId==0}">全部</Button>
            <Button class="roomlabel" @click="changeChooseLableFun(0,item.id,item)" :class="{choose:styleLableId==item.id}" 
                v-for="(item,index) in styleArr" :key="index">
                {{item.name||item.style_name}}
            </Button>
        </div>
        <div class="vertical" v-show="goodsNav == 2">
            <Button class="roomlabel" @click="changeChooseLableFun(2,0,null)" :class="{choose:spaceLabelId==0}">全部</Button>
            <Button class="roomlabel" @click="changeChooseLableFun(2,item.id||item.cat_id,item,item)" :class="{choose:spaceLabelId==(item.id?item.id:item.cat_id)}" 
                v-for="(item,index) in classifyArr" :key="index" v-show="isClassifySon" >
                {{item.name||item.cat_name}}
            </Button>
            <Button v-show="!isClassifySon" class="roomlabel" v-for="m in classifySonArr" :key="m.cat_id" :class="{series_choose:seriesId==m.cat_id}" @click.stop="changeChooseSeriesFun(2,m.parent_id,m.cat_id,m)">
                {{m.cat_name}}
            </Button>
        </div>

        <Scroll class="scrollimg" :distance-to-edge='16' :on-reach-bottom="handleReachBottom"  v-if="this.goodsImgArr.length !== 0">
            <div>
                
                <ul class="goodsUl flexLayout">
                    <li class="goodsLi" v-for="(item,index) in goodsImgArr" :key="index" @click="goodsImgDownFun(item,index)"  @mouseenter="mouseenter(item,item.goods_id)"  @mouseleave="mouseleave(item,item.goods_id)">
                        <img class="goodsImg" :src="item.goods_thumb" :id="item.goods_id" :name ="item.goods_id" alt="图片丢失"  >
                        <div v-if="uploadData.is_personal == 0 || uploadData.is_personal == 1 ? false :true" class="iconBox flexLayout"  :class="{ collectionDownActive:collectionDown==item.goods_id}" >
                            <div @click.stop="iconshoucang1Fun(item.goods_id,item.is_collect)" >
                                <i v-if="item.is_collect == 1"  class="iconfont iconshoucang1 collectActive"></i>
                                <i v-else class="iconfont iconshoucang1"></i>
                            </div>
                            <div @click.stop="iconxiazaiFun(item,item.goods_id)"><i  class="iconfont iconxiazai"></i></div>
                        </div>
                        <div v-if="uploadData.is_personal == 0 || uploadData.is_personal == 1"  class="iconBoxSingel">
                            <div @click.stop="changeRadio(item.goods_id)" >
                                <RadioGroup v-model="uploadSingle">
                                    <Radio :label="item.goods_id">&nbsp;</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                        
                    </li>
                </ul>
                <Button v-if="uploadData.is_personal == 0 || uploadData.is_personal == 1" class="confirmBtn" @click="confirmUpload" type="warning">确定</Button>
            </div>
        </Scroll>
        <div v-else>
            <br/><br/><br/><br/>
            <!-- <h1>加载中</h1> -->
            <!-- <img src="../../assets/loading.svg" alt="" srcset=""> -->
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
import { goodsList, category, isCollect, customGoods } from '@/api/material.js'
import {mapState, mapGetters, mapActions} from 'vuex'
import { constants } from 'fs';
import "@/assets/css/loading.css"
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
            brandSonArr:[],
            styleArr:[],
            classifyArr:[],
            classifySonArr:[],
            isClassifySon:true,
            brandLabSon:true,
            goodsLibModal: false,
            social:[],
            getGoods:{
                page : 0,
                style_id : null,
                keywords : null,
                brand_id : null,
                category_id : null,
                series_id:  null
            },
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
            uploadSingle:'',
            uploadData_Obj:{
                goods_json:null
            },

            uploadData:{
                goods_id: null,
                is_personal:this.$route.query.is_personal,
                img_list:this.$route.query.imgarr,
                
            },
            serachTag:{
                serachBrandAllTag: [],
                styleAllTag: [],
                isClassifyAllTag: [],
            },
            serachBrandTag:[],
            serachBrandSonTag:[],
            styleTag:[],
            isClassifyTag:[],
            isClassifySonTag:[],
            scroll: ''

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
        // this.onInitialized()
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
        iconshoucang1Fun(index,is_collect) {
            this.isCollectData.id = index
            this.goodsImgArr = []
            // this.getGoods.page = 0 
            // is_collect == 0 ? this.isCollectData.is_cancel = 0 : this.isCollectData.is_cancel = 1
            this.isCollectData.is_cancel =  is_collect
            this.handleGetisCollect(this.isCollectData);
   
        
            console.log("this.isCollectData.is_cancel", this.isCollectData.is_cancel)
            console.log( this.isCollectData.is_cancel?"收藏":'取消收藏')
        },
        changeRadio(index){
            console.log("选中", index)
            this.uploadData.goods_id = index,
            this.uploadData_Obj.goods_json = JSON.stringify(this.uploadData)
            console.log("选中穿过来得参数", this.uploadData)
        },
        //确定上传自定义
        confirmUpload(){
            this.handleCustomGoods(this.uploadData_Obj)
        },
        iconxiazaiFun(item, index) {
            this.goodsImgSonArr = item.imgs
            this.goodsLibModal = true;
            // console.log( "下载", item.imgs, index)
        },
                // 筛选表签
        changeChooseLableFun (type,id,item) {
            // this.serachTag = []
            switch (type) {
                case 0:
                    this.styleLableId=id; 
                        this.styleAllTag = []
                        this.styleTag = []
                        if(item){this.styleTag.push(item)}
                        this.serachTag.styleAllTag = this.styleTag
                        this.getGoods.style_id = id
                        this.goodsImgArr = []
                        this.getGoods.page = 0 
                        this.handlegoodsList(this.getGoods)
                        console.log(" switch 0",type,id)
                    break;          
                case 1:
                    this.brandLableId=id; 
                    this.getGoods.brand_id=id; 

                    if(id === 0 ){
                        this.serachBrandTag = []
                        this.brandLabSon = true
                        this.getGoods.category_id = null
                        if(item){this.serachBrandSonTag.push(item.series_list)}
                    }else{
                        this.serachBrandTag = []
                        this.brandLabSon = false
                        this.brandSonArr = item.series_list
                        if(item){this.serachBrandTag.push(item)}
                        this.serachTag.serachBrandAllTag = this.serachBrandTag
                    }
                    console.log(" switch 1",type,id)
                    break;                 
                case 2:
                    this.spaceLabelId=id; 
                    this.getGoods.category_id=id;
                    this.seriesId = 0;
                    if(id === 0 ){
                        this.isClassifySon = true
                        this.isClassifyTag = []
                        if(item){this.isClassifySonTag.push(item.son)}
                    }else{
                        this.isClassifyTag = []
                        this.isClassifySon = false
                        this.classifySonArr = item.son
                        if(item){this.isClassifyTag.push(item)}
                        this.serachTag.isClassifyAllTag = this.isClassifyTag
                    }
                    console.log(" switch 2",type,id)
                    break;
                default:
                    break;
            }
            this.goodsImgArr = []
            this.getGoods.page = 0 
            this.handlegoodsList(this.getGoods)
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
        changeChooseSeriesFun (type,id,series_id,item) {
            this.seriesId = series_id
            // this.changeChooseLableFun(type,id,item)
            console.log("series_id ",series_id)
            if(type == 1){
                this.brandLableId = id;
                this.serachBrandSonTag = item
                this.getGoods.series_id = series_id
                this.serachTag.serachBrandAllTag = this.serachBrandTag.concat(this.serachBrandSonTag)
            }else{
                this.getGoods.category_id = series_id;
                //  this.getGoods.series_id = series_id
                this.isClassifySonTag = item
                this.serachTag.isClassifyAllTag = this.isClassifyTag.concat(this.isClassifySonTag)
            }
            console.log("category_id",this.getGoods.category_id)
            this.goodsImgArr = []
            this.getGoods.page = 0 
            this.handlegoodsList(this.getGoods)
        },
        /**
         * input tag start
         */
        removeTag(name){
                var BrandIndex = this.serachTag.serachBrandAllTag.indexOf(name);
                var styleIndex = this.serachTag.styleAllTag.indexOf(name);
                var isClassifyIndex = this.serachTag.isClassifyAllTag.indexOf(name);
                    if(name.bid||name.id){
                        if (BrandIndex > -1) {
                            console.log("length",this.serachTag.serachBrandAllTag.length)
                            this.serachTag.serachBrandAllTag.splice(BrandIndex, this.serachTag.serachBrandAllTag.length);
                            if(name.bid){
                                console.log("name.bid",name.bid)
                                this.getGoods.brand_id = name.bid
                            }else{
                                this.getGoods.brand_id = null
                                this.getGoods.series_id = null
                                console.log("name.id",name.id)
                            }
                        }
                    }
                    if(name.id){
                        if (styleIndex > -1) {
                            this.serachTag.styleAllTag.splice(styleIndex, this.serachTag.styleAllTag.length);
                            if(name.id){
                                this.getGoods.style_id = name.id
                            }else{
                                this.getGoods.style_id = null
                            }
                        }
                    }
                    if(name.cat_id || name.parent_id){
                        if (isClassifyIndex > -1) {
                            this.serachTag.isClassifyAllTag.splice(isClassifyIndex, this.serachTag.isClassifyAllTag.length);
                            // this.isClassifySon = true
                            if(name.cat_id){
                                this.getGoods.category_id = name.cat_id
                            }else{
                                this.getGoods.category_id = null
                                console.log("name.id",name.id)
                            }
                        }
                    }
                    if(this.serachTag.serachBrandAllTag.length == 0){
                        this.getGoods.brand_id = null
                        this.getGoods.series_id = null
                        this.brandLabSon = true
                    }   
                    if(this.serachTag.isClassifyAllTag.length == 0){
                        this.getGoods.category_id = null
                        this.isClassifySon = true
                    }
                    if(this.serachTag.styleAllTag.length == 0){
                        this.getGoods.style_id = null
                    }
                    this.goodsImgArr = []
                    this.getGoods.page = 0 
                    this.handlegoodsList(this.getGoods)

                    console.log("removeTag------",this.serachTag)
        },
        /**
         * input tag end
         */
        //改变nav
        changeGoodsNav(id){
            this.goodsNav = id

        },
        //搜索商品
        searchGoodsList(){
            this.getGoods.keywords = this.keyworldVal
            this.goodsImgArr = []
            this.getGoods.page = 0 
            this.handlegoodsList(this.getGoods)
            console.log('keyworldVal',this.keyworldVal)
        },
        // 触底加载
        handleReachBottom () {
            return new Promise(resolve => {
                this.getGoods.page ++
                // this.goodsImgArr = this.goodsImgArr.concat(this.goodsImgArr)
                this.handlegoodsList(this.getGoods)
                resolve();
            });
        },
        /**
         * end function
         * start api
         */
        handlegoodsList(getGoods){
            let getGoods2 = this.getGoods
            goodsList(getGoods2.page, getGoods2.style_id, getGoods2.keywords, getGoods2.brand_id, getGoods2.category_id ,getGoods2.series_id).then(res=>{
                this.goodsImgArr = this.goodsImgArr.concat(res.data.message.data)
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
                this.handlegoodsList(this.getGoods);
            }).catch( err => {
                console.log(err)
            })
        },
        //上传自定义图片
        handleCustomGoods(data){
            customGoods(data).then( res => {
                if(res.data.success){
                    this.$router.push({  
                        path: 'goodsLib',           
                    })
                    this.uploadData = {}
                }
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
.bread_box{
    text-align: left;
    padding: 10px 30px;
    margin-top: 20px;
}
.bread_box /deep/ .ivu-breadcrumb-item-link:hover{
   color: #f90;
}
.bread_box /deep/ .ivu-breadcrumb-item-link{
   color: rgba(255,255,255,.7);
}

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
    height: auto;
    height: 100%;
}
.scrollimg{
    margin-top: 10px;
}
.scrollimg /deep/ .ivu-scroll-container{
    height: 70vh !important;
}
.scrollimg /deep/ .ivu-scroll-spinner{
    display: none !important;
}
/* .scrollimg /deep/ .ivu-scroll-content-loading{
    opacity: 1 !important;
} */
.select_box{
    margin-top: 10px;
}
#select>div{
    background: #293039 !important;
}
.flexLayout{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
}
.goodsUl{
    padding: 10px 10px;

    
}
.goodsLi{
    position: relative;
    margin-top: 10px;
    margin-left: 10px;
    background: white
}
.goodsLiM{
    position: relative;
    margin-top: 10px;
    background:#F8F8F8;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
}
.iconBoxSingel /deep/ .ivu-radio-inner{
    border:1px solid #f90
}
.iconBoxSingel /deep/ .ivu-radio-inner:after{
   background-color:  #f90
}
.confirmBtn{
    position: fixed;;
    left: 90px;
    bottom: 0;
    width: 320px
}
.iconBoxSingel{
    width: 25%;
    height: 25%;
    cursor: pointer;
    position: absolute;
    padding: 0 5px;
    top: 5px;
    left: 0;
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
