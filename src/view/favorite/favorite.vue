<template>
    <div>
        <div class="favoriteSearch">
            <Input search size="large" v-model="keyworldVal" placeholder="搜索你喜欢的" @on-search="searchGoodsList" />
        </div>
        <div class="favoriteNav">
            <div v-for="(item,index) in favoriteListArr" :key=index class="goodsTabs" @click="changeGoodsNav(item.id)" :class="{goodsNavActive:favoriteNav==item.id}">{{item.title}}</div>
        </div>
        <div class="comm_body">
            <ul class="reuseUl">
                <li class="reuseLi" v-for="item in goodsCollectArr"  :key="item.id" >
                    <img :src="item.img_url" alt="图片丢失" :id="item.id"  @click="selectDecorateGoods"  crossorigin="anonymous">
                </li>
            </ul>
        </div>
        <Spin fix v-if="this.$store.state.app.isShowSpin">
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script>
import { getCollectList } from '@/api/material.js'
import {mapState, mapGetters, mapActions} from 'vuex'
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
    },
    data() {
        return {
            msg: '这是收藏',
            keyworldVal:'',
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
            goodsCollectArr:[]
        }
    },
    mounted() {
        this.handelgetCollectList(this.collectListData)
    },
    methods: {
        ...mapActions([
            'saveState',
        ]),
        //模糊查询
        searchGoodsList(){

        },
        //改变nav
        changeGoodsNav(id){
            this.favoriteNav = id
            this.collectListData.type = id
            this.handelgetCollectList(this.collectListData)
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
        /**api-start */
        handelgetCollectList(data){
            getCollectList(data).then( res =>{
                this.goodsCollectArr = res.data.message
            }).catch( err =>{
                console.log(err)
            })
        }
        /**api-end */

    },    
}
</script>
<style scoped>
.comm_body{
    padding: 20px 30px;
    width: 400px;
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
    border-bottom: 1px solid #666;
    padding: 10px 0 0 10px;
    cursor: pointer;
}
.goodsTabs{
    font-size: 18px;
    height: 50px;
    line-height: 50px;

}
.goodsNavActive{
    color: #f90;
    border-bottom: 1px solid #f90;
}
.reuseUl{
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: start;
    flex-wrap: wrap;
}
.reuseLi{
    width: 70px;
    height: 70px;
    background: white;
    list-style: none;
    margin:10px 0 0 10px

}
.reuseLi>img{
    width: 70px;
    height: 70px;  
}
</style>
