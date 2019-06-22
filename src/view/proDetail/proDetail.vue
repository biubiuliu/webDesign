<template>
    <div class="proDetailBody">
        <div class="waterfall"  v-if="type==1">
            <div slot="waterfall-head" class="fall_head">
                <div class="detailImg">
                    <img class="image_size" :src="scheme_info.done_img_url" alt=""  @error="imgError(scheme_info,1)">
                </div>
                <div class="detail_list">
                    <div class="right_title">#{{scheme_info.scheme_name}}#</div>
                    <div class="right_list">
                        <img class="image_photo" :src="user_info.head_img" alt="" @error="imgError(user_info,0)">
                        <div class="username">{{user_info.name}}</div>
                        <div><h3>{{user_info.post_name}}</h3></div>
                    </div>
                    <div class="right_btn">
                        <Button type="warning" @click="linkMaterialLib"  long :loading="loading">                           
                             <span v-if="!loading">再创作</span>
                             <span v-else>Loading...</span>
                        </Button>
                        <Button type="warning" ghost long  @click="judgeCollect(scheme_info.id,1,scheme_info.is_collect)">{{scheme_info.is_collect?'取消收藏':'收藏'}}</Button>
                    </div>
                </div>
            </div>
            <div class="discoverTitle" v-if="goods_list.length">
                <div>单品列表</div>
                <div class="parent">                         
                    <schemeList :imgsArr='goods_list' :padding='padding' :showCollect='true' :isPro='true'/>
                </div>
            </div>

            <div class="discoverTitle" v-if="recommend_list.length">
                <div>推荐方案</div>
                <div class="parent">
                    <schemeList :imgsArr='recommend_list' :padding='padding' :isPro='true'/>                    
                </div>
            </div>            
        </div>
        
        <div class="waterfall" v-else>
            <div slot="waterfall-head" class="fall_head">
                <div class="detail_swiper">
                   <div class="swiper-container" id='gallery'>                      
                        <div class="swiper-wrapper" >
                            <div class="swiper-slide" v-for="(item,index) in goods_info.item_imgs" :key="index">
                                <img  :src="item" alt="">
                            </div>  
                            <div class="swiper-slide" v-if='goods_info&&goods_info.item_imgs&&goods_info.item_imgs.length==0'>
                                <img  :src="goods_info.goods_thumb" alt="">
                            </div>                       
                        </div>
                        <div class="swiper-pagination"></div>                     
                   </div> 
                </div>
                <div class="detail_list">
                   <P class="right_title">{{goods_info.goods_name}}</P>
                   <div class="info">
                        <div><span>价格</span> <span style="color:#f90;font-weight:600">￥{{goods_info.shop_price}}</span></div>                               
                        <div><span>风格</span> <span>{{goods_info.style_name}}</span></div> 
                        <div><span>品牌</span> <span>{{goods_info.brand_name}}</span></div> 
                        <div><span>描述</span> <span>{{goods_info.goods_brief||'暂无描述'}}</span></div>
                   </div>
                </div>
            </div>
            <div class="desc" v-if="goods_info.goods_desc">
                <p class="desc_title">商品详情</p>
                <div v-html="goods_info.goods_desc"></div>
            </div>            
        </div>
        <Spin fix v-if="isShowSpin">
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script>
import { getSchemeRelated,getGoodsDetail,isCollect,copyScheme } from '@/api/data.js'
import { mapState,mapActions } from 'vuex'
import { convertTimeStamp } from '@/libs/util.js'
import Swiper from 'swiper'; 
import 'swiper/dist/css/swiper.min.css';
import schemeList from '@/components/commons/schemeList/schemeList'

export default {
    name: 'proDetail',
    computed: {
        ...mapState({
            proDetailVal: state =>{
                return state.app.proDetailVal
            },
            schemeId: state =>{
                return state.app.schemeId
            },
        })
    },
    components: {
        schemeList
    },
    data() {
        return {
            msg: '方案详情页',
            padding:60,
            maxCol:6,
            selectList:[
                {title:"方案",id:"1"},
                {title:"单品",id:"2"},
            ],
            leftIcon: 'iconfont iconxiala-',
            changeblue:0,
            imgsArr: [],
            dataArr:[],
            setDataArr:[],
            iconshoucang1:false,
            goods_list: [],
            recommend_list: [],
            scheme_info: {},
            user_info:{},
            proId: null, // 方案id
            type:1,
            goods_info:{},
            loading:false,
            isShowSpin:true
        }
    },

    created() {
        this.proId = this.$route.params.id;
        this.type = this.$route.params.type;
        if( this.$route.params.type==2){
            this.handleGetGoodsInfo(this.proId)
        }else{
            this.handleGetSchemeInfo(this.proId)
        }
    },

    watch: {
        '$route' (to, from) {
            this.$router.go(0);
        }
    },

    methods: {
        ...mapActions([
            'setSchemeId'
            
        ]),
        imgError(data,type) {
            switch (type) {
                case 0:
                    data.head_img = require('../../assets/defalut.png');
                    break;
                case 1:
                    data.done_img_url = require('../../assets/defalut.png');
                    break;
                case 2:
                    data.goods_img = require('../../assets/defalut.png');
                    break;
                default:
                    break;
            }
            
        },

        //数据重组
        handleGetSchemeInfo (proId) {
            getSchemeRelated (proId).then(res => {
                if(res.data.success){
                    let data =  res.data.message;
                    this.scheme_info = data.scheme_info;
                    data.goods_list.map((item)=>{
                         item.id = item.goods_id
                         item.type = 2
                         item.name = item.goods_name
                         item.src = item.goods_img
                         item.price = item.shop_price
                    })
                    this.goods_list = data.goods_list;
                    data.recommend_list.map((item)=>{
                        item.time = convertTimeStamp(item.updated_at)
                        item.type = 1
                        item.src = item.done_img_url
                        item.name = item.scheme_name
                    })
                    this.recommend_list = data.recommend_list;
                    this.scheme_info = data.scheme_info;
                    this.user_info = data.user_info;
                }
                this.isShowSpin = false
            }).catch(err => {
                console.log(err)
                this.isShowSpin = false
            })
        },

        handleGetGoodsInfo (proId) {
            getGoodsDetail (proId).then(res=>{
                if(res.data.success){
                    this.goods_info = res.data.message;
                    this.$nextTick(() => {
                       new Swiper('.swiper-container', {
                            navigation: {
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            },
                            pagination: {
                                el: '.swiper-pagination',
                            },
                        });
                    })
                    this.isShowSpin = false;
                }else{
                    this.$Message.error(res.data.message)
                    this.isShowSpin = false
                }
            })
        },

        linkDetailFun (value) {
            if(value.type==2){
                this.$router.push({name:'proDetail',params: {id:value.goods_id,type:value.type}})
                return
            }
            this.$store.dispatch('updataProDetailVal', value)
            this.$router.push({name:'proDetail',params: {id:value.id,type:value.type}})   
        },


        linkMaterialLib () {
            this.$store.dispatch("setSchemeId", this.proId)
            this.$router.push({name:'materialLib', query: {id: this.proId} })
            // if(this.scheme_info.is_self){
            //     this.$store.dispatch("setSchemeId", this.proId)
            //     this.$router.push({name:'materialLib', query: {id: this.proId} })
            // }else{
            //     this.loading= true;
            //     this.copy();
            // }
        },

        // 复制方案
        copy () {
            copyScheme({id:this.proId}).then(res=>{
                if(res.data.success){
                    this.$store.dispatch("setSchemeId", res.data.message.id);
                    this.$router.push({name:'materialLib', query: {id: res.data.message.id} })
                }else{
                    this.$Message.error('不能操作当前方案')
                }
                 this.loading= false;
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
                    if(type==1){
                        this.scheme_info.is_collect = isCollected==0?1:0;
                    }else{
                        this.goods_list[i].is_collect = isCollected==0?1:0;
                    }
                    this.$Message.info(res.data.message);
                }
            })
        }  
    },
}
</script>
<style scoped>
.proDetailBody{
    background: #edf0f2
}
.discoverTitle{
    font-size: 20px;
    color: #666;
    text-align: left;
    margin: 0 60px;
}
.fall_head{
    display: flex;
    justify-content: center;
    padding: 60px;
}
.detailImg{
    width: 60%;
    height: 546px;
    text-align: center;
    background: white;
    padding:24px 126px;
    overflow: hidden;
    border-radius: 6px;
}
.detail_swiper{
    height: 546px;
    width: 60%;
    text-align: center;
    background: white;
    padding:24px 126px;
    overflow: hidden;
    border-radius: 6px;
}
.detail_list{
    margin-left: 20px;
    width: 20%;
    background: white;
    color:rgb(158, 155, 155);
    padding: 20px;
    border-radius: 6px;
}
.image_size{
    height:100%;
}
.image_photo{
    width: 100px;
    height: 100px;
    border-radius: 100px; 
    border: 1px solid black;  
}
.right_title{
    color: #000;
    padding-bottom: 10px;
    width: 100%;
    font-size: 16px;
    text-align: left;
    border-bottom: 1px solid #c0c0c0;
}
.right_list{
    padding: 60px;
    border-bottom: 1px solid #c0c0c0;
}
h1{
    color: black
}
.right_btn>button{
margin-top: 20px;;
}
.item_list{
    display: flex;
    justify-content:space-around;
    flex-direction:row;
    flex-wrap: wrap;
}
.item_list_li{
    background: white;
    margin-top: 20px;
    padding: 20px;
    font-size: 14px;
    position: relative;
}
.item_list_li>img{
    width: 200px;
    height: 200px;
}
.flexLayout{
    position: absolute;
    top: 10px;
    right: 10px;
}
.iconBox{
    color: #f90
}
.username{
    font-size: 22px;
    font-weight: 400;
    color: rgb(0, 0, 0);
}
.parent { 
    width:100%;
    /* -moz-column-count: 5;
    -webkit-column-count: 5;
    column-count: 5; */
    padding:10px 0 40px 0;
    margin-top: 20px;
}
.child {
    background: #f5f7f9;
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
.child img{
    width: 100%;
    display:block; 
}
.scheme-img-info{
    padding:14px 25px;
    display: flex;
    align-items: center;
    background: #fff;
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
}
.img-info {
    padding:14px 25px;
    background: #fff;
}
.collect_box{
    display: none;
    position: absolute;
    right: 10px;
    top: 10px;
    background: #fff;
    width: 40px;
    height: 40px;
    border-radius: 3px;
}
.iconshoucang{
    font-size: 20px;
    color: #999;
}
.collected{
    color: #f90;
}
.child:hover .collect_box{
    display: flex;
    justify-content: center;
    align-items: center;
}
.info{
    padding-top: 20px;
    text-align: left;
    font-size: 16px;
}
.info div {
    line-height: 30px;
}
.info div span:first-child{
    font-size: 14px;
    color: rgb(134, 142, 150);
    margin-right: 10px;
}
.info div span:last-child{
    font-size: 14px;
    color: #333;
}
.desc{
    background: #fff;
    margin:0 12%;
    border-radius: 6px;
    padding: 0 30px 30px 30px;
    color: #333
}
.desc_title{
    text-align: center;
    font-size: 30px;
    line-height: 90px;
    color: #333;
}
.swiper-container{
    height: 100%;
}
.swiper-slide img{
    height: 100%
}
.swiper-slide{
    background: #fff;
}
#thumbs{
    margin-top: 20px;
}
</style>
