<template style="overflow: hidden">
    <div>
        <div class="waterfall">
            <vue-waterfall-easy ref="waterfall"
                                style="width:100%; height:100vh"
                                :imgWidth="290" :imgsArr="imgsArr"
                                :enablePullDownEvent="true"
                                @scrollReachBottom="handleGetGoodsType"
                                @click="linkDetailFun"
                                class="vueWaterfallEasy">
                <div slot="waterfall-head">
                    <Content  class="discover">
                            <div class="bg-div"></div>
                            <img class="discover-img" src="../../../src/assets/bg.png" alt="丢失图片">
                            <div class="search_box">
                                <span class="search_title">{{msg}}</span>
                                <div class="search_div">
                                    <div class="search_select" @mouseenter="selectTrol"  @mouseleave="selectTrolLeave">
                                            {{selectDefault}} &nbsp;&nbsp;
                                            <i :class="leftIcon"></i>
                                        <ul class="alertBox" id="project">
                                            <li class="selectLi" :class="{seachchange:changeblue==index}"
                                                                @mouseenter="mouseenter(index,item)"
                                                                @click="changeSelectFun(index,item)"
                                                                v-for="(item, index) in selectList"
                                                                :key="index">{{item.title}}
                                            </li>
                                        </ul>
                                    </div>  
                                    <input class="search_input" placeholder="搜索你喜欢的" type="text" v-on:input="inputFun" :value="keywords">
                                    <div class="searchBtn" @click="search">
                                        <i class=" iconfont iconsousuo" style="font-size:30px;color:white;"></i>
                                    </div>                                    
                                </div>
                            </div>
                    </Content>
                </div>
                <div slot="waterfall-head" >
                    <div class="discoverLable">
                        <!-- <Button  >
                            Forward
                            <Icon type="md-close" />
                        </Button> -->
                        <div class="vertical">
                            <span>{{changeblue==0?"空间标签":'分类标签'}} :</span>
                            <Button class="roomlabel" @click="changeChooseLableFun(0,0)" :class="{choose:spaceLabelId==0}">全部</Button>
                            <Button class="roomlabel" @click="changeChooseLableFun(0,item.id||item.cat_id)" :class="{choose:spaceLabelId==(item.id?item.id:item.cat_id)}" 
                                v-for="(item,index) in roomLabelArr" :key="index">
                                {{item.name||item.cat_name}}
                            </Button>
                        </div>
                        <div  class="vertical">
                            <span>风格标签 :</span>
                            <Button class="roomlabel" @click="changeChooseLableFun(1,0)" :class="{choose:styleLableId==0}">全部</Button>
                            <Button class="roomlabel" @click="changeChooseLableFun(1,item.id)" :class="{choose:styleLableId==item.id}" 
                                v-for="(item,index) in roomStyleArr" :key="index">
                                {{item.name||item.style_name}}
                            </Button>
                        </div>
                        <div  class="vertical">
                            <span>品牌标签 :</span>
                            <Button class="roomlabel" @click="changeChooseLableFun(2,0)" :class="{choose:brandLableId==0}">全部</Button>
                            <Button class="roomlabel" @click="changeChooseLableFun(2,item.bid)" :class="{choose:brandLableId==item.bid}" 
                                v-for="(item,index) in brandLabelArr" :key="index">
                                {{item.name}}
                                <div class="brand_lable">
                                    <li v-for="(m,n) in item.series_list" :key="n" :class="{series_choose:seriesId==m.id}" @click.stop="changeChooseSeriesFun(2,item.bid,m.id)">
                                        {{m.series_name}}
                                    </li>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
                <div slot="waterfall-head">
                    <div class="discoverTitle">搜到{{total}}个结果</div>
                </div>
                <div :class="{'scheme-img-info':changeblue==0}" class="img-info" slot-scope="props">
                    <p class="some-info">{{props.value.name}}</p>
                    <p class="some-info">{{props.value.time||'￥'+props.value.price}}</p>
                </div>
                <div slot="waterfall-over">暂无更多数据</div> -->
             </vue-waterfall-easy>
            <!-- <div v-if="!imgsArr.length" class="no-scheme">
                抱歉 没有找到匹配的结果
            </div> -->
        </div>
    </div>
</template>
<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
import { getGoodsType,  getBrandList, getMeals, getGoodsList } from '@/api/data.js'
import { category,getEnumList } from '@/api/material.js'
import { convertTimeStamp } from '@/libs/util.js'
import { mapState } from 'vuex'
import { getStorage } from '@/libs/util.js'

export default {
    name: 'discover',
    components: {
        vueWaterfallEasy
    },
    computed: {
        ...mapState({
            proDetailVal: state =>{
                return state.app.proDetailVal
            },
        })
    },
    data() {
        return {
            msg: '创建精彩设计',
            selectList:[
                {title:"方案",id:"1"},
                {title:"单品",id:"2"},
            ],
            leftIcon: 'iconfont iconxiala-',
            changeblue:0,
            selectDefault:'方案',
            imgsArr: [],
            roomLabelArr:[],
            roomStyleArr:[],
            brandLabelArr:[],
            spaceLabelId:0,// 选择的空间标签id
            styleLableId:0,// 选择的风格标签id
            brandLableId:0,// 选择的品牌标签id
            seriesId:0,// 品牌下面的系列id
            keywords:'',
            page:1,
            total:0
        }
    },
    created() {
        this.getScreenLabels();
        this.handleGetGoodsType();
    },
    methods: {
        selectTrol() {
            var project = document.getElementById('project')
                project.style.display = 'block';
                this.leftIcon = 'iconfont iconxiala'
        },

        selectTrolLeave() {
            var project = document.getElementById('project')
                project.style.display = 'none';
                this.leftIcon = 'iconfont iconxiala-'
        },

        mouseenter(index, item) {
            //this.changeblue = index;                   
        },

        changeSelectFun(index, item){
            this.selectDefault = item.title;
            
            var project = document.getElementById('project')
                project.style.display = 'none';
            this.leftIcon = 'iconfont iconxiala-';
            this.changeblue = index;
            this.spaceLabelId=0;
            this.styleLableId=0;
            this.brandLableId=0;
            this.seriesId=0;
            this.page = 1;
            this.total = 1;
            this.keywords = '';
            if(index==1){
                this.getGoodsLabels();
                this.handleGetGoodsType();
            }else{
                this.getScreenLabels();
                this.handleGetGoodsType();
            }
        },

        // 数据重组
        handleGetGoodsType () {
            if(this.page!=1&&this.page> Math.ceil(this.total/30)){
                this.$refs.waterfall.waterfallOver()
                return
            }  
            this.changeblue==0? this.getMeals():this.getGoods();
        },

        // 获取方案
        getMeals(){
            let params = {
                user_id:'',
                style_type:this.styleLableId,
                space_type:this.spaceLabelId,
                is_personal:0,
                keywords:this.keywords,
                bid:this.brandLableId,
                series_id:this.seriesId,
                page:this.page,
                page_size:30
            }
            getMeals(params).then(res => {
                if(res.data.success){
                    if(this.page==1){
                        this.imgsArr=[];
                    }
                    this.total = res.data.message.total
                    if(!res.data.message.data.length){
                          this.$refs.waterfall.waterfallOver();
                          return
                    }
                    res.data.message.data.map((item,i)=>{
                        var  setDataObj = {
                            src: item.done_img_url,
                            href: item.done_img_url,  
                            name: item.scheme_name,
                            canvas_type:item.canvas_type,
                            time:convertTimeStamp(item.updated_at),                                                   
                            id: item.id,
                            is_personal:item.is_personal,
                            type:1//1是方案 2是单品
                        };
                        this.imgsArr.push(setDataObj);                      
                    })
                    this.page=this.page +1;                 
                }
            }).catch(err => {
                console.log(err)
            })
        },

        // 获取商品
        getGoods(){
            let params = {
                page:this.page,
                style_id:this.styleLableId,
                keywords:this.keywords,
                brand_id:this.brandLableId,
                category_id:this.spaceLabelId,
                series_id:this.seriesId,
            }
            getGoodsList(params).then(res => {
                if(res.data.success){
                    if(this.page==1){
                        this.imgsArr=[];
                    }
                    this.total = res.data.message.total
                    if(!res.data.message.data.length){
                          this.$refs.waterfall.waterfallOver();
                          return
                    }
                    res.data.message.data.map((item,i)=>{
                        var  setDataObj = {
                            src: item.goods_thumb,
                            href: item.goods_thumb,  
                            name: item.goods_name,                                                 
                            id: item.goods_id,
                            price:item.shop_price,
                            type:2,
                        };
                        this.imgsArr.push(setDataObj);                      
                    })
                    this.page = this.page +1;
                }
            })
        },

        linkDetailFun(event, { index, value }) {
            event.preventDefault()
            // 只有当点击到图片时才进行操作
            if (event.target.tagName.toLowerCase() == 'img') {
                if(value.type==2){
                     this.$router.push({path:'proDetail/'+value.id+'/'+value.type})
                     return 
                }
                this.$store.dispatch('updataProDetailVal', value)
                this.$router.push({path:'proDetail/'+value.id+'/'+value.type})
                console.log('img clicked', value)
                console.log(' vuex', this.proDetailVal)
            }
        },

        // 获取方案风格、空间类型
        getScreenLabels () {
             Promise.all([getEnumList(), getBrandList()]).then((resultList) => {
                 if(resultList[0].data.success){
                    this.roomLabelArr = resultList[0].data.message.space_list;
                    this.roomStyleArr = resultList[0].data.message.style_list
                 }
                 if(resultList[1].data.success){
                    this.brandLabelArr = resultList[1].data.message;
                 }
             })
        },

        // 获取商品的筛选标签
        getGoodsLabels () {    
            category().then(res => {
                if(res.data.success){
                    this.roomLabelArr = res.data.message.category;
                    this.roomStyleArr = res.data.message.style;
                    this.brandLabelArr = res.data.message.brand;
                }
            })
        },

        // 筛选表签
        changeChooseLableFun (type,id) {
           switch (type) {
               case 0:
                   this.spaceLabelId=id;
                   this.page = 1;
                   this.handleGetGoodsType();
                   break;          
               case 1:
                    this.styleLableId=id;                   
                    this.page = 1;
                    this.handleGetGoodsType();
                    break;                 
               case 2:
                    this.brandLableId=id;
                    this.seriesId = 0;
                    this.page = 1;
                    this.handleGetGoodsType();
                    break;
               default:
                   break;
           }
       },

       changeChooseSeriesFun (type,id,series_id) {
           this.brandLableId = id;
           this.seriesId = series_id
           this.page = 1;
           this.handleGetGoodsType();
       },

       // input输入
       inputFun (e) {
          this.keywords = e.target.value;
       },

       // 筛选
       search(){
           this.page=1;
           this.handleGetGoodsType();
       }
    }
    
}
</script>
<style scoped>
.discover{
    position:relative;
}
.bg-div{
    position: absolute;
    width: 100%;
    height: 400px;
    top: -60px;
    left: 0;
    opacity:0.6;
    background: black;
    z-index: 8;
}
.discover-img{
    width: 100%;
    height: 400px;
    margin-top: -60px; 
}
.search_box{
    top:10%;
    left: calc(50% - 300px);
    width: 600px;
    height: 200px;
    position: absolute;
    z-index: 99;
}
.search_title{
    font-size: 40px;
    color: white; 
}
.search_div{
    display: flex;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    line-height: 40px;
    background: white;
    color:black;
    border-radius: 20px;
    margin-top: 20px;
}
.search_select{
    width: 15%;
    height: auto;
    position: relative;
    border-right: 1px solid #ddd;
}
.alertBox{
    position: absolute;
    width: 100%;
    left: 20%;
    background: white;
    box-shadow: 5px 0px 10px #161414;
    display: none;
    transition:display 0.5s;
}
.selectLi{
    width: 100%;
    border-bottom: 1px solid #c4bebe;
    cursor: pointer;
    position: relative;
}
.searchBtn{
    width: 15%;
    background: #f90;
    line-height: 40px;
    border-bottom-right-radius: 20px;
    border-top-right-radius: 20px;
    font-size: 20px;
}
.search_input{
    width: 70%;
    font-size: 16px;
    padding: 0 20px;
    border:none;
}
.seachchange{
    background: #f90;
    color: #fff;
}
.vueWaterfallEasy{
    left: 0px;
    z-index: 0;
    background: #f2f2f2;
    border-radius: 8px;
    overflow: hidden;
}
.waterfall{
     /* height:100vh;  */
    /* overflow: hidden; */
    background: #fff;
}
.discoverTitle{
    font-size: 30px;
    color: #5a5656;
    text-align: left;
    margin: 0 9%
}
.discoverLable{
    color: #5a5656;
    text-align: left;
    margin: 10px 9%;
    font-size: 16px;
}
.roomlabel{
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
    z-index: 1;
    display: none;
}
.brand_lable li{
    word-wrap:break-word;
    line-height: 30px;
    width: 100%;
}
.vertical{
    margin: 20px 0;
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
.img-info{
    padding:10px;
    background: #fff;
    border-radius: 8px;
}
.scheme-img-info{
    padding:10px;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 8px;
}
.scheme-img-info .some-info:nth-child(1) {
    flex: 1;
    text-align: left;
    color: #666;
    font-size: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.scheme-img-info .some-info:nth-child(2) {
    flex: 1;
    text-align: right;
    color: #999;
    font-size: 14px;
}
.img-info .some-info{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
    color: #666;
    font-size: 16px;
    background: #fff;
}
.no-scheme{
    width: 100%;
    margin-top: 20px;
    font-size: 24px;
    color: #7e8e98;
    line-height: 400px;
    position: absolute;
    bottom: 0px;
}
.parent { 
    width:80%;
    -moz-column-count: 5;
    -webkit-column-count: 5;
    column-count: 5;
    /* padding:60px 60px 40px 60px; */
    margin-top: 20px;
    margin-left: 10%
}
.child {
    background: #f2f2f2;;
    margin-bottom:20px;	 
    -moz-page-break-inside: avoid;
    -webkit-column-break-inside: avoid;
    break-inside: avoid;
    color:#f2f2f4;
    /* width: 340px; */
    overflow: hidden;
    box-sizing: border-box;
    border-radius: 10px;
    position: relative;
    border:1px solid #ddd;
    /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3); */
}
.waterfall::-webkit-scrollbar{
    display: none;
}
</style>
