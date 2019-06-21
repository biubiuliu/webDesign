
<template>
    <Waterfall id='vueWaterfall' :gutterWidth="layout.gutterWidth" :gutterHeight='layout.gutterHeight' :align='layout.align' :minCol='layout.maxCol' :maxCol='maxCol||5' class="vueWaterfall">
        <WaterfallItem  v-for="(item, index) in imgsArr" :key="index" :width='itemWidth'>
            <a href='javascript:;' class="item"  @click="toDetail(item)">
                <div style="background:#fff;padding:15px 15px 0 15px;position:relative">
                    <img :src="item.src" :lazy-src='item.src' alt="加载错误">                                       
                </div>
                <div  class="scheme-img-info" :class="{imginfo:item.type==1}">
                    <p class="some-info" :title="item.name">{{item.name}}</p>
                    <p class="some-info">{{item.price?"￥"+item.price:item.time}}</p>
                </div>
                <div class="space_div" v-if="item.type==1">
                        <div class="space">{{item.space_name}}</div>
                        <div class="style">{{item.style_name}}</div>
                </div>
                <a v-if="showCollect" href="javascript:;" class="collect_box" @click.stop="judgeCollect(item.id,2,item.is_collect,index)">
                    <i class="iconfont iconshoucang" :class="{collected:item.is_collect}"></i>
                </a>  
            </a>                   
        </WaterfallItem>
    </Waterfall>      
</template>
<script>
import { Waterfall, WaterfallItem } from 'vue2-waterfall'
import { isCollect } from '@/api/data.js'

export default {
    name: 'schemeList',
    components: {
        Waterfall, 
        WaterfallItem
    },
    data(){
        return{
            layout:{
                gutterWidth:20,
                gutterHeight:20,
                resizable:true,
                align:'left',
                fixWidth:'',
                minCol:5,
                maxCol:5,
                percent:'',
                width:340,
            },
        }
    },
    props:{
       imgsArr:Array, // 数据
       padding:Number,// 窗口padding 窗口的宽度-padding 即为实际列表的宽度
       maxCol:Number,//最大列数
       type:Number,//1方案 2商品
       showCollect:Boolean,// 是否显示收藏
       isPro:Boolean//是否为详情页
    },
    mounted() {
      //this.imgsArr = this.props.imgsArr
    },
    watch: {

    },
    computed:{
        itemWidth(){  
            var width = this.padding*2||120;
            var num = this.maxCol? this.maxCol:5;
            return ((document.documentElement.clientWidth-width)/num)  //计算宽度
        },
    },
    created() {
       
    },
    methods: {
       // 修改方案
        toDetail (item){
            if(this.isPro){
                if(item.type==2){
                    this.$router.push({name:'proDetail',params: {id:item.goods_id,type:item.type}})
                    return
                }
                this.$store.dispatch('updataProDetailVal', item)
                this.$router.push({name:'proDetail',params: {id:item.id,type:item.type}})
                return
            }else{
                if(item.type==1){
                    this.$store.dispatch('updataProDetailVal', item)
                }
                const {href} = this.$router.resolve({
                    path: 'proDetail/'+item.id+'/'+item.type,            
                })
                window.open(href, '_blank')   
            }     
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
                    this.imgsArr[i].is_collect = isCollected==0?1:0;                  
                    this.$Message.info(res.data.message);
                }
            })
        }  
    },
}
</script>
<style scope>
.imginfo{
    padding:10px 15px;
    background: #fff;
    display: flex;
    align-items: center;
}
.scheme-img-info{
    padding:10px 15px; 
    background: #fff;
}
.imginfo .some-info:nth-child(1), .scheme-img-info .some-info:nth-child(1) {
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
    text-align: left;
    color: #999;
    font-size: 14px;
}
.imginfo .some-info:nth-child(2){
    text-align: right;
}
.item img{
    width: 100%;
    display:block; 
    height: auto;
}
.item{
    display: block;
    position: relative;
    border-radius:4px;
    overflow: hidden;
    background: #f6f6f6;
    box-shadow:0 1px 4px rgba(6,31,50,.2)
}
.item:hover{
    box-shadow: 1px 2px 8px rgba(6, 31, 50, .5);
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
.item:hover .collect_box{
    display: flex;
    justify-content: center;
    align-items: center;
}
.space,.style{
    padding:2px 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
    font-size: 14px;
    font-style: normal;
    color: #999;
    text-align: center;
    line-height: 20px;
    margin-right: 10px;
}
.space_div{
    display: flex;
    justify-content: flex-start;
    background: #fff;
    padding:0 10px 10px 10px;
}
</style>


