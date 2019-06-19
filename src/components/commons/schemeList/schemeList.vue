
<template>
    <Waterfall id='vueWaterfall' :gutterWidth="layout.gutterWidth" :gutterHeight='layout.gutterHeight' :align='layout.align' :minCol='layout.maxCol' :maxCol='maxCol||5' class="vueWaterfall">
        <WaterfallItem  v-for="(item, index) in imgsArr" :key="index" :width='itemWidth'>
            <a href='javascript:;' class="item"  @click="toDetail(item)">
                <div style="background:#f2f2f2">
                    <img :src="item.src" :lazy-src='item.src' alt="加载错误">
                </div>
                <div  class="scheme-img-info">
                    <p class="some-info" :title="item.name">{{item.name}}</p>
                    <p class="some-info">{{item.price?"￥"+item.price:item.time}}</p>
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
            var width = this.padding*2||120
            return ((document.documentElement.clientWidth-width)/5)  //计算宽度
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
.scheme-img-info{
    padding:10px 25px;
    /* display: flex; */
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
    text-align: left;
    color: #999;
    font-size: 14px;
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
    box-shadow: 0 1px 5px rgba(6, 31, 50, .3);
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
</style>


