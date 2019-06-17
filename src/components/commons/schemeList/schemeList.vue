
<template>
    <Waterfall id='vueWaterfall' :gutterWidth="layout.gutterWidth" :gutterHeight='layout.gutterHeight' :align='layout.align' :minCol='layout.maxCol' :maxCol='layout.maxCol' class="vueWaterfall">
        <WaterfallItem  v-for="(item, index) in imgsArr" :key="index" :width='itemWidth'>
            <a href='javascript:;' class="item"  @click="toDetail(item)">
                <img :src="item.src" alt="加载错误">
                <div  class="scheme-img-info">
                    <p class="some-info" :title="item.name">{{item.name}}</p>
                    <p class="some-info">{{item.info}}</p>
                </div> 
            </a>                   
        </WaterfallItem>
    </Waterfall>      
</template>
<script>
import { Waterfall, WaterfallItem } from 'vue2-waterfall'

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
       imgsArr:Array,
       padding:Number,
       maxCol:Number,
       width:Number,
       type:Number//1方案 2商品
    },
    mounted() {
      //this.imgsArr = this.props.imgsArr
    },
    watch: {

    },
    computed:{
        itemWidth(){  
            var width = this.padding*2||120
            console.log((document.documentElement.clientWidth-width)/5)
            return ((document.documentElement.clientWidth-width)/5)  //计算宽度
        },
    },
    created() {
       
    },
    methods: {
       // 修改方案
        toDetail (item){
            if(item.type==1){
                this.$store.dispatch('updataProDetailVal', item)
            }
            const {href} = this.$router.resolve({
                path: 'proDetail/'+item.id+'/'+item.type,            
            })
            window.open(href, '_blank')     
        },
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
    box-shadow:0 1px 4px rgba(6,31,50,.12)
}
</style>


