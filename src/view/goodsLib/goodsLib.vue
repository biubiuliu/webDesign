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
            <Tag color="warning" closable type="border"  v-for="(item,index) in serachTag"  :key="index" @on-close="removeTag(item)" >{{item.name|| item.series_name||item.style_name ||item.cat_name }}</Tag>
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
            <Button v-show="!brandLabSon" class="roomlabel" v-for="m in brandSonArr" :key="m.id" :class="{series_choose:seriesId==m.id}" @click.stop="changeChooseSeriesFun(2,m.id,m.id,m)">
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

        
        <div v-if="this.goodsImgArr.length !== 0">
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
            uploadSingle:'',
            uploadData_Obj:{
                goods_json:null
            },

            uploadData:{
                goods_id: null,
                is_personal:this.$route.query.is_personal,
                img_list:this.$route.query.imgarr,
                
            },
            serachTag:[],
            serachBrandTag:[],
            serachBrandSonTag:[]

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
        console.log(this.uploadData.is_personal == 0 || this.uploadData.is_personal == 1 )
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
            is_collect == 0 ? this.isCollectData.is_cancel = 0 : this.isCollectData.is_cancel = 1
            this.handleGetisCollect(this.isCollectData);
            this.handlegoodsList(this.getGoods);
            console.log("is_collect", is_collect)
            console.log("收藏", this.isCollectData.is_cancel)
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
            console.log("0.0",item)
            if(item){this.serachTag.push(item)}
            console.log("this.serachBrandTag.0",this.serachBrandTag)
            switch (type) {
                case 0:
                    this.styleLableId=id; 
                    this.ChangeStyleOpt(id)
                    break;          
                case 1:
                    this.brandLableId=id; 
                    if(id === 0 ){
                        this.brandLabSon = true
                        this.getGoods.category_id = null
                        if(item){this.serachBrandSonTag.push(item)}
                    }else{
                        this.brandLabSon = false
                        this.brandSonArr = item.series_list
                        if(item){this.serachBrandTag.push(item)}
                    }
                    this.ChangebrandOpt(id)
                    
                    console.log("serachBrandTag ",this.serachBrandTag)
                    console.log("serachBrandSonTag ",this.serachBrandSonTag)
                    break;                 
                case 2:
                    this.spaceLabelId=id; 
                    this.seriesId = 0;
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
        changeChooseSeriesFun (type,id,series_id,item) {
            console.log("点击 ",item)
            this.serachBrandSonTag = item
            // if(item){
            //     if(this.serachTag.indexOf(item) == -1){
            //         var index = this.serachTag.indexOf(name);
            //         console.log("item ",item.id)
            //             this.serachTag.push(item) 
            //     }
                
            // }
            console.log("点击 ",this.serachBrandSonTag)
            this.brandLableId = id;
            this.seriesId = series_id
            this.ChangeClassifyOpt(series_id)
        },
        /**
         * input tag start
         */
        removeTag(name){
                var index = this.serachTag.indexOf(name);
                    if(name.bid){
                        if (index > -1) {
                            this.serachTag.splice(index, this.serachTag.length);
                        }
                    }
                    if (index > -1) {
                        this.serachTag.splice(index, 1);
                        if(this.serachTag.length == 0){
                            this.brandLabSon = true
                            this.isClassifySon = true
                        }
                    }

                    this.getGoods={}
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
                // console.log(res)
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
.spin{
    height: 100%;
    background-color:rgba(0, 0, 0, 0) !important;
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
    justify-content: flex-start;
    flex-wrap: wrap;
}
.goodsUl{
    padding: 10px 20px;

    
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
/**
loading
*/
.balls {
  width: 7.5em;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
}

.balls div {
  width: 1.2em;
  height: 1.2em;
  border-radius: 75%;
  background-color: #f90;
}

.balls div:nth-of-type(1) {
  transform: translateX(-100%);
  animation: left-swing 0.5s ease-in alternate infinite;
}

.balls div:nth-of-type(3) {
  transform: translateX(-95%);
  animation: right-swing 0.5s ease-out alternate infinite;
}

@keyframes left-swing {
  50%,
  100% {
    transform: translateX(95%);
  }
}

@keyframes right-swing {
  50% {
    transform: translateX(-95%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
