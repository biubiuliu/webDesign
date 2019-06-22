<template>
    <div class="assistor">
        <div class="parent" v-if="showList" id='parent'>
            <div class="header">
                <div class="favoriteSearch">
                    <Input search size="large" v-model="kwd" placeholder="搜索你喜欢的" @on-search="searchGoodsList" />
                </div>
                <div class="favoriteNav">
                    <div v-for="(item,index) in favoriteListArr" :key=index class="goodsTabs" @click="changeGoodsNav(item.id)" :class="{goodsNavActive:favoriteNav==item.id}">{{item.title}}</div>
                </div>
                <div  v-if='goodsCollectArr&&goodsCollectArr.length&&favoriteNav==2' class="filtrate_collection">
                       <a href="javascript:;" @click="filtrateFun">
                            筛选 <Icon type="md-arrow-dropup" v-if="mycollectModel"/>
                            <Icon type="md-arrow-dropdown" v-else/>
                       </a>
                </div>
            </div>        
            <div class="comm_body">
                <ul class="reuseUl" v-if="favoriteNav==2">                  
                    <li class="reuseLi" v-for="item in goodsCollectArr"  :key="item.id">
                        <a href="javascript:;" @click="goodsImgDownFun(item)">
                            <img :src="item.img_url" alt="图片丢失" :id="item.id">
                            <div class="info">
                                <p :title='item.name'>{{item.name}}</p>
                                <p>￥{{item.shop_price}}</p>
                            </div>
                        </a>
                    </li>
                </ul>
                <ul v-else style="padding-top:10px">
                   <Waterfall id='vueWaterfall' :resizable='layout.resizable' :gutterWidth="layout.gutterWidth" :gutterHeight='layout.gutterHeight' :align='layout.align' :minCol='layout.maxCol' :maxCol='layout.maxCol' class="vueWaterfall">
                        <WaterfallItem  v-for="(item, index) in goodsCollectArr" :key="index" :width='itemWidth'>
                            <a class="item" href="javascript:;" @click="handleGetSchemeInfo(item.id)" :style="'width:'+(itemWidth-8)+'px'">
                                <div style="padding:5px 5px 0 5px;background:#fff">
                                    <img :src='item.img_url' alt="加载错误">
                                </div>
                                <div  class="scheme-img-info">
                                    <p class="some-info" :title="item.name">{{item.name}}</p>
                                    <p class="some-info">{{item.time}}</p>
                                </div>                               
                            </a>                   
                        </WaterfallItem>
                    </Waterfall>   
                </ul>
                <div class="no-data" v-if="goodsCollectArr&&!goodsCollectArr.length">
                    暂无匹配的数据
                </div>
            </div>            
        </div>
        <!-- 方案详情 -->
        <div class="scheme_parent" v-else>
            <a href="javascript:;" class="close_scheme" @click="closeDetail"><Icon type="ios-close" /></a>
            <img class='scheme_img' :src="scheme_info.done_img_url" alt="">
            <p style="text-align:left;margin-top:24px">单品列表</p>
            <ul>
                <li v-for="(item,index) in goods_list" :key="index">
                    <a href="javascript:;" @click="goodsImgDownFun(item)" style="display:block;position:relative">
                        <img :src="item.goods_img" alt="">                        
                    </a> 
                    <div class='hover_div'>
                            <a class="collect" href="javascript:;"  @click.stop="judgeCollect(item.goods_id,2,item.is_collect,index)">
                                    <i v-if="item.is_collect == 1"  class="iconfont iconshoucang1 collectActive"></i>
                                    <i v-else class="iconfont iconshoucang1"></i>
                            </a>
                            <a class="down" href="javascript:;"  @click.stop="downImg(item)"> 
                                <i  class="iconfont iconxiazai"/>
                            </a>
                    </div>                                     
                </li> 
            </ul>
        </div>
        <Modal
            v-model="mycollectModel"
            @on-ok="sureChoose"
            @on-cancel="exitChoose"
            :closable="false"
            :mask-closable="false"
            :styles="{top: '206px',marginLeft:'96px',width:'314px'}">
            <div class="filtrate_model flexLayout">
                <a class="styles" :class="{'isSelectChoose':type==1}" @click="changeChoose(1)">风格</a>
                <a class="classify" :class="{'isSelectChoose':type==2}" @click="changeChoose(2)">分类</a>
            </div>
            <ul class="col_checkbox">
                <div  v-if="type==1">
                    <li v-for="(item,index) in selectStyleArr" :key="index" >
                        <Checkbox  size='large' @on-change="changeSelectStyle(index,item.checked)" v-model="item.checked">
                            {{item.style_name}}({{item.count}})
                        </Checkbox>
                    </li>
                </div>
                <div v-else>
                    <li  v-for="(item,index) in selectCatArr" :key="index">
                        <Checkbox  size='large' @on-change="changeSelectRoom(index,item.checked)" v-model="item.checked">
                            {{item.cat_name}}({{item.count}})
                        </Checkbox>
                    </li>
                </div>
            </ul>
        </Modal>
<<<<<<< HEAD
        <Modal
            title="下载的商品"
            v-model="goodsLibModal"
            @on-ok="goodsLibModalOk" 
            @on-cancel="goodsLibModalCancel"
            ok-text="下载"
            :styles="{left: '80px',top: '180px',margin:'0',width:'350px'}">
            <ul class="flexLayout" v-if="goodsImgSonArr.length">
                <li class="goodsLiM" v-for="(item,index) in goodsImgSonArr" :key="index">
                    <Checkbox  @on-change="CheckboxFun(index,item.checked)" v-model="item.checked" class="checkBoxLeftTop">                      
                    </Checkbox>                   
                    <img class="goodsImg" :src="item.pic_image" alt="图片丢失">                   
                </li>
            </ul>
            <div v-else>
                <h4>抱歉! 暂无相关图片</h4>
            </div>
        </Modal>
        <Spin class="spin" fix  v-if="this.$store.state.app.isShowSpin">
            <div class="balls" >
                <div></div>
                <div></div>
                <div></div>
            </div>
        </Spin>
    </div>
</template>
<script>
import { getCollectList,getCollectScreen,getCollectRelated,isCollect } from '@/api/data.js'
import { mapState, mapGetters, mapActions } from 'vuex'
import { convertTimeStamp,downloadImage } from '@/libs/util.js'
import { Waterfall, WaterfallItem } from 'vue2-waterfall';
import "@/assets/css/loading.css"
export default {
    name: 'favorite',
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
        itemWidth(){  
	        return (340/2)  //计算宽度
	    },
    },
    components: {
        Waterfall, 
        WaterfallItem,
    },
    data() {
        return {
            msg: '这是收藏',
            favoriteNav:2,
            favoriteListArr:[
                {title:'商品收藏',id:'2'},
                {title:'方案收藏',id:'1'},
            ],
            collectListData:{
                type: 2,//	1：方案图片列表 2：商品图片列表
                cat_ids: null,	//商品分类id字符串（多个id用英文逗号隔开）
                style_ids: null ,	//	商品风格id字符串（多个id用英文逗号隔开）
            },
            goodsCollectArr:null,
            layout:{
                gutterWidth:8,
                gutterHeight:8,
                resizable:false,
                align:'left',
                minCol:2,
                maxCol:2,
                percent:'',
            },
            type:1,
            mycollectModel:false,
            selectCatArr:[],
            selectStyleArr:[],   
            beforeSelectCat:[],
            beforeSelectStyle:[], 
            scheme_info: {},
            goods_list: [], 
            showList:true,
            kwd:'' ,
            goodsImgSonArr:[], // 待下载的图片数组
            goodsLibModal: false, // 待下载的图片选择弹框
            loading:false,
            totalPages: null, // 总页数    
            page: 1 ,   // 当前页  
            cat_ids:'',
            style_ids:'',   
        }
    },
    mounted() {
        this.handelgetCollectList()
        this.handleGetEnumList()
        var box = document.getElementById('parent')
         // 添加滚动事件，检测滚动到页面底部
        box.addEventListener('scroll', this.handleScroll)
    },
    methods: {

        ...mapActions([
            'saveState',
        ]),

        handleScroll() {
             var box = document.getElementById('parent')
            // 变量scrollTop是滚动条滚动时，距离顶部的距离
       		var scrollTop = box.scrollTop;
       		// 变量windowHeight是可视区的高度
       		var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
       		// 变量scrollHeight是滚动条的总高度
       		var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
            // 滚动条到底部的条件
            //console.log(scrollTop,windowHeight,scrollHeight)
            if(scrollTop>scrollHeight){
                // 写后台加载数据的函数
         	   this.onReachBottom()
               return
            }   
        },

        // 模糊查询
        searchGoodsList(){
            this.page = 1;
            this.cat_ids = '';
            this.style_ids = '';  
            this.handelgetCollectList();
        },

        //改变nav
        changeGoodsNav(id){
            this.favoriteNav = id
            this.collectListData.type = id
            this.kwd = ''
            this.goodsCollectArr = null;
            this.page=1;
            this.handleGetEnumList();
            this.handelgetCollectList()
        },
        // 将商品收藏图片渲染到canvas
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

        goodsImgDownFun(item) {
            console.log(item)
            this.modal9 = true;
            this.$store.dispatch("setGoodsItem", item)
            this.$store.dispatch("setImgIndex", 0)
        },

        // 数据重组
        handelgetCollectList () {
            if(this.page!=1&&this.page> this.totalPages){                    
                return
            } 
             if(this.loading){
                return;
            } 
            this.loading = true;

            var getData = this.favoriteNav == 1 ? getCollectList(this.page,1,0,0,this.kwd,16):
            getCollectList(this.page,2,this.style_type,this.cat_ids,this.kwd,16);
            getData.then(res => {
                this.loading = false;   
                if(res.data.success){
                    if(this.page==1){ this.goodsCollectArr = [];}
                    this.totalPages = res.data.message.last_page 
                    if(this.favoriteNav==1&& res.data.message.data.length){
                        res.data.message.data.map((item) => {
                            item.time=convertTimeStamp(item.create_at) 
                        })
                    }
                    if(this.favoriteNav == 2 && res.data.message.data.length){
                        res.data.message.data.map((item) => {
                            item.goods_id = item.id;
                            var imgs = [];
                            item.img_list.map((x)=>{
                                var one = {
                                    goods_id: x.img_id,
                                    pic_image: x.img_url
                                }                       
                            imgs.push(one);
                            })
                            item.imgs = imgs;
                        })
                    }
                    this.goodsCollectArr = this.goodsCollectArr.concat(res.data.message.data)
                }  
                                           
            }).catch(err => {
                console.log(err)
                this.loading = false;
            })
        },

        // 滑动到底部
        onReachBottom(){
            if (this.page!=1&&this.page>this.totalPages) return;  
            console.log(111111);
            this.page++
            this.handelgetCollectList()
        },

        // 确定筛选
        sureChoose () {
            this.beforeSelectCat = JSON.parse(JSON.stringify(this.selectCatArr));
            this.beforeSelectStyle = JSON.parse(JSON.stringify(this.selectStyleArr));
            var cat_ids = [];
            var style_type = [];
            this.selectCatArr.map((item)=>{
                if(item.checked){
                    cat_ids.push(item.cat_id)
                }
            })
            this.selectStyleArr.map((item)=>{
                if(item.checked){
                    style_type.push(item.style_id.toString())
                }
            })
            this.page = 1;
            this.goodsCollectArr = null;
            this.cat_ids = cat_ids.length?cat_ids.join(','):'';
            this.style_type =  style_type.length?style_type.join(','):''
            this.handelgetCollectList (cat_ids.length?cat_ids.join(','):'',style_type.length?style_type.join(','):'')
        },

        // 取消筛选 
        exitChoose () {
            this.selectCatArr = JSON.parse(JSON.stringify(this.beforeSelectCat));
            this.selectStyleArr = JSON.parse(JSON.stringify(this.beforeSelectStyle));
        },

        // 获取分类风格
        handleGetEnumList() {
              getCollectScreen().then(res => {
                if(res.data.success){
                     res.data.message.cat_group.map((item)=>{
                         item.checked = false;
                     })
                     res.data.message.style_group.map((item)=>{
                         item.checked = false;
                     })
                    this.selectCatArr = res.data.message.cat_group;
                    this.selectStyleArr = res.data.message.style_group;
                    this.beforeSelectCat = JSON.parse(JSON.stringify(this.selectCatArr));
                    this.beforeSelectStyle = JSON.parse(JSON.stringify(this.selectStyleArr));
                }
            })
        },

        // 筛选
        filtrateFun(){
            this.mycollectModel = !this.mycollectModel;         
        },

        changeSelectStyle(i,data){          
            this.selectStyleArr[i].checked = data;
        },

        changeSelectRoom(i,data){
            this.selectCatArr[i].checked = data;
        },

        changeSelect(id){
            this.favoriteNav = id;
            this.page=1;
            this.handelgetCollectList();
        },

        changeChoose(type){
            this.type = type;
        },

        // 获取方案详情
        handleGetSchemeInfo (id) {
            this.showList=false;
            getCollectRelated (id).then(res => {
                if(res.data.success){
                    let data =  res.data.message;
                    this.scheme_info = data.scheme_info;                   
                    data.goods_info.map((item)=>{
                        var imgs = [];
                         item.img_list.map((x)=>{
                                var one = {
                                    goods_id: x.img_id,
                                    pic_image: x.img_url
                                }                       
                            imgs.push(one);
                        })
                     item.imgs = imgs;
                    })
                    this.goods_list = data.goods_info;
                    this.scheme_info = data.scheme_info;
                }
            }).catch(err => {
                console.log(err)
            })
        },

         // 判断收藏
        judgeCollect (id,type,isCollected,i) {
            if(isCollected){
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定要取消收藏吗</p>',
                    onOk: () => {
                        this.toCollect(id,type,isCollected,i);
                    },               
                });
            }else{
                 this.toCollect(id,type,isCollected,i);
            }   
        },

        // 收藏
        toCollect (id,type,isCollected,i) {
            let params = {
                id:id,
                type:type,
                is_cancel:isCollected
            }
            isCollect (params).then( res=> {
                if(res.data.success){  
                    console.log( this.goods_list[i]);                
                    this.goods_list[i].is_collect = isCollected==0?1:0;                  
                    this.$Message.info(res.data.message);
                }
            })
        },
        
        downImg (item){
            item.imgs.map((item)=>{
                item.checked = false
            })
            this.goodsImgSonArr = item.imgs
            this.goodsLibModal = true;   
            //downloadImage(href,name)         
        },

        goodsLibModalOk (){
            var num = 0
             this.goodsImgSonArr.map(item => {
                 if(item.checked){
                     num++
                     downloadImage(item.pic_image,'商品图')
                 }
             })
            if(num==0){
                this.$Message.info('请选择下载的图片')
            }else{
                this.goodsLibModal = false; 
            }
        },

        goodsLibModalCancel (){
            this.goodsLibModal = false; 
        },

        CheckboxFun (index,checked){
            this.goodsImgSonArr[index].checked = checked;
        },

        // 关闭详情
        closeDetail () {
            this.showList = true;
        },
        /**api-end */

    },    
}
</script>
<style scoped>
.spin{
    background-color:rgba(0, 0, 0, 0) !important;
}
.assistor {
    position: relative;  
}
.parent,.scheme_parent{
    overflow: auto; /*关键点*/
    height:94% 
}
.comm_body{
    padding: 120px 30px 20px 30px ;
    width: 400px;
}
.header{
    position: absolute; /*关键点*/;
    left: 0;
    top: 0;
    right: 17px;
    cursor: pointer;
    background: #293039; 
    z-index: 1;
}
.favoriteSearch{
    width: 100%;
    height: auto;
    padding: 20px  30px 0;
}
.favoriteNav{
    display:flex;
    justify-content:space-around;
    width: 100%;
    /* border-bottom: 1px solid #666; */
    padding: 10px 0 0 10px;
    cursor: pointer;
}
.goodsTabs{
    font-size: 14px;
    height: 50px;
    line-height: 50px;

}
.goodsNavActive{
    color: #f90;
    border-bottom: 2px solid #f90;
}
.reuseUl{
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: start;
    flex-wrap: wrap;
    padding-top: 20px;
    position: relative;
}
.reuseLi{
    width: 150px;
    background: white;
    list-style: none;
    margin:10px 0 0 10px;
    border-radius:3px;
    overflow: hidden;
}
.reuseLi img{
    width: 150px;
    height: 150px;
}
.info{
    text-align: left;
    padding:5px 10px;
    font-size: 12px;
    color: #666;
}
.info p{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.item{
    display: block;
    border-radius: 3px;
    overflow: hidden;
}
.item img{
    width: 100%;
    height: auto;
    display: block;
}
.scheme-img-info{
    padding: 10px;
    display: flex;
    align-items: center;
    background: #fff;
}
.scheme-img-info .some-info:nth-child(1) {
    flex: 1;
    text-align: left;
    color: #666;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.scheme-img-info .some-info:nth-child(2) {
    flex: 1;
    text-align: right;
    color: #999;
    font-size: 10px;
}
.no-data{
    text-align: center;
    width: 100%;
    color: rgba(255,255,255,.5);
    line-height: 50px;
}
.filtrate_collection{
    background: #293039;
    position: absolute;
    width: 100%;
    left: 0;
    text-align: left;
    padding-left: 40px;
    padding-top: 10px;
}
.filtrate_collection a {
    color: rgba(255,255,255,.5);
}
.isSelectChoose{
    color: #f90!important;
}
.filtrate_model{
    text-align: center;
    font-size: 16px;
    height: 30px;
    border-bottom: 1px solid #c0c0c0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
}
.col_checkbox{
    padding-top: 10px;
    max-height: 400px;
    overflow-y: scroll;
}
.classify{
    width: 50%;
    color: #666;
}
.styles{
    width: 50%;
    color: #666;
}
/* 方案信息 */
.scheme_parent{
    text-align: left;
    padding:34px;
}
.scheme_parent .close_scheme{
    color: rgba(255,255,255,.5);
    display: block;
    top: 4px;
    right: 25px;
    line-height: 30px;
    font-size: 30px;
    position: absolute
}
.scheme_parent .scheme_img{
    width: 100%;
    border-radius: 3px;
    
}
.scheme_parent ul{
    height: 56%;;
    margin-top: 10px;
    padding-bottom: 10px;
    /* display: flex;
    flex-wrap: wrap;
    justify-content: space-between */
}
.scheme_parent ul li{
    display: inline-block;
    margin-right: 5px;
    position: relative;
}
.scheme_parent ul li img{
    width: 100px;
    height: 100px;
}
.hover_div a {
    color: #fff
}
.hover_div{
    display: none;
    position: absolute;
    left: 6px;
    right: 6px;
    top: 6px;
    /* background: #fff; */
} 
li:hover .hover_div{
    display: flex;
    justify-content: space-between
}
.scheme_parent ul li .collect{
    width: 16px;
    height: 16px;
    line-height: 16px;
    background: rgba(0, 0, 0, .5);
    border-radius: 2px;
    text-align: center;
}
.scheme_parent ul li .down{
    width: 16px;
    height: 16px;
    line-height: 16px;
    background: rgba(0, 0, 0, .5);
    border-radius: 2px;
    text-align: center;
}
.scheme_parent ul li .iconfont{
    font-size: 10px;
}
.collectActive{
    color: #f90;
}
.spin{
    background-color:rgba(0, 0, 0, 0) !important;
}
.goodsLiM{
    position: relative;
    margin-top: 10px;
    background:#F8F8F8;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
}
.flexLayout{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
}
.flexLayout li{
   margin-right: 5px
}
.goodsImg{
    width: 100px;
    height: 100px;
}
.checkBoxLeftTop{
    position: absolute;
    right: -3px;
    top: 3px;
}
</style>
