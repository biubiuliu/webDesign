<template>
    <div class="goods_info_container">
        <img :src="goods_info.goods_thumb" alt="">
        <div class="goods_info">
            <p class="title">{{id}}{{goods_info.goods_name}}</p>
            <div class="info">
                <div><span>价格</span> <span style="color:#f90;font-weight:600">￥{{goods_info.shop_price}}</span></div>                               
                <div><span>风格</span> <span>{{goods_info.style_name||'无'}}</span></div> 
                <div><span>品牌</span> <span>{{goods_info.brand_name||'无'}}</span></div> 
                <div><span>描述</span> <span>{{goods_info.goods_brief||'暂无描述'}}</span></div>
            </div>
        </div>
        <Spin fix v-if="isShowSpin">
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script>
import { getGoodsDetail } from '@/api/data.js'

export default {
    name: 'goodsInfo',
    data(){
        return{
            msg:'商品信息',
            goods_info:{
                goods_thumb:'',
                goods_name:'',
                shop_price:0,
                style_name:'',
                brand_name:'',
                goods_brief:''
            },
            isShowSpin:false
        }
    },

    props:{
      id:Number
    },

    watch:{
        id(val){ 
           this.id = val;
           this.getDetail(val);
        },
    },

    mounted() {
       this.getDetail(this.id);
    },

    methods: {
        getDetail(id){
            //this.isShowSpin=true;
            getGoodsDetail(id).then(res=>{
                if(res.data.success){
                    this.goods_info = res.data.message;
                }
                //this.isShowSpin=false;
            })
        }
    }
}

</script>
<style scope>
.goods_info_container{
    position: relative;
    height: 94vh;
    background: #293039;
    padding:20px;
    width: 320px;
}
.goods_info_container img{
    width: 280px;
    height: 280px;
    border-radius: 4px;
    background: #fff;
}
.goods_info{
    width: 100%;
    height: 63%;
    background: #fff;
    margin-top:20px;
    border-radius:4px;
}
.title{
    padding:20px;
    color: #000;
    padding-bottom: 10px;
    width: 100%;
    font-size: 16px;
    text-align: left;
    border-bottom: 1px solid #eee;
}
.info{
    padding:20px;
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
</style>