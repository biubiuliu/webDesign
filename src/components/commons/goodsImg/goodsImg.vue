<template>
    <div class="goods_body" >
        <div class="goodsImgBtn"  v-show="this.goodsItem !== null && this.goodsItem.imgs.length !== 0">
            <Button type='warning' size="small" ghost @click="preImg"  title="上一张"><i  class="iconfont iconzuo"></i></Button>
            <Button type='warning' size="small" ghost @click="nextImg"  title="下一张"><i  class="iconfont iconyou"></i></Button>
            <Button type='warning' size="small" ghost @click="clearGoodsItem"  title="关闭"><i class="iconfont iconguanbi"></i></Button>
        </div>
        <div class="goodsImgBtn">
            <Button v-if="closeGoodsBool" type='warning' size="small" ghost @click="clearGoodsItem"><i class="iconfont iconguanbi"></i></Button>
        </div>
        <div class="goodsimg" v-if=" this.goodsItem !== null && this.goodsItem.imgs.length !== 0">
            <img :src="goodsImgArr_img[this.imgIndex].pic_image" class="pic" :id="this.goodsItem.goods_id" :name="goodsImgArr_img[this.imgIndex].id" @click="selectDecorateGoods"  crossorigin="anonymous"  alt="图片不存在">
        </div>
        <div class="goodsimg" v-else>
            <h1>抱歉,暂无相关商品图片</h1>
        </div>
    </div>
</template>
<script>
import {mapState, mapGetters, mapActions} from 'vuex'
export default {
    name: 'goodsImg',
    data() {
        return {
            msg: '这是goodsImg',
            getGoods:{ page : null, style_id : null, keywords : null, brand_id : null, category_id : null},
            goodsImgArr_img:null,
            index: 0,
            closeGoodsBool:false,
        }
    },
    watch: {
        goodsItem: function() { 
            this.index = 0
            console.log("watch",this.goodsItem)
            if( this.goodsItem !== null && this.goodsItem.imgs.length !== 0) {
                this.goodsImgArr_img = this.goodsItem.imgs
                this.closeGoodsBool = false
            }else{
                this.closeGoodsBool = true
            }
        },
        $route(to) {
            this.$store.dispatch("setGoodsItem", null)
        },
    },
    computed: {
        ...mapState({
                goodsItem: state =>{
                        return state.app.goodsItem
                },
                imgIndex: state =>{
                        return state.app.imgIndex
                },
            }),
            ...mapGetters([
                'card',
                'selectedObj',
            ]),
    },
    mounted() {

        console.log("mounted",this.goodsItem)
        if(this.goodsItem == null ) return;
        if( this.goodsItem.imgs.length == 0) return;
        this.goodsImgArr_img = this.goodsItem.imgs

        // if(this.goodsItem.imgs.length == 0) return;
        // this.goodsImgArr_img = this.goodsItem.imgs
        
    },
    updated() {
        // console.log("updata",typeof(this.goodsItem.imgs.length))
        if( this.goodsItem == null) return;
        if( this.goodsItem.imgs.length == 0) return;
        this.goodsImgArr_img = this.goodsItem.imgs
    },
    methods: {
        ...mapActions([
            'saveState',
            'setGoodsItem',
            'setImgIndex',
        ]),
        nextImg(){
            this.index++;
            this.$store.dispatch("setImgIndex", this.index)
            if( this.index == this.goodsImgArr_img.length){
                this.index = 0;
                this.$store.dispatch("setImgIndex", this.index)
            }
            console.log("nextImg-index--------------",this.index)
            console.log("nextImg--------------",this.imgIndex)
            document.getElementsByClassName('pic').src = this.goodsImgArr_img[this.index];
        },
        preImg(){
            this.index--;
            this.$store.dispatch("setImgIndex", this.index)
            if(this.index < 0){
                this.index = this.goodsImgArr_img.length-1;
                this.$store.dispatch("setImgIndex", this.index)
            }
            console.log("preImg-index--------------",this.index)
            console.log("preImg--------------",this.imgIndex)
            document.getElementsByClassName('pic').src = this.goodsImgArr_img[this.index];
        },
        clearGoodsItem(){
            this.$store.dispatch("setGoodsItem", null)
        },
        // 将自定义商品图片渲染到canvas
        selectDecorateGoods(e) {
            this.index = 0
            console.log("e.target",e.target)
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
                left: Math.random().toFixed(2)*200+100,
                top: Math.random().toFixed(2)*200+100,
                scaleX: 200/img.width, 
                scaleY: 200/img.height,
                src:e.target.src,
                imgType:2,
                goods_id: e.target.id,
                goodsImg_id: e.target.name,
                material_id: null,
                // backgroundImgId:e.target.id
            }); 
            card.add(img).setActiveObject(img)
            // img.crossOrigin = 'Anonymous';   
            this.clearGoodsItem()
            this.saveState()
            },{crossOrigin: 'anonymous'})
        },
    },
}
</script>
<style scoped>
.goodsimg{
    width: 530px;
    height:530px;
    margin: 0 auto;
    line-height: 530px;
    background: white;
}
.goodsImgBtn{
    display: flex;
    justify-content: flex-end
}
.goodsImgBtn button{
    margin-right: 10px;
}
img{
    cursor: pointer;
    width: 100%;
    height: auto;

}
</style>
