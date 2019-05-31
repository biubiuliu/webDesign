<template>
    <div class="proDetailBody">
        <div class="waterfall">
            <vue-waterfall-easy ref="waterfall"
                                style="width:100%; height:90vh; overflow: hidden"
                                :imgWidth="290" :imgsArr="imgsArr"
                                :enablePullDownEvent="true"
                                @click="linkDetailFun"
                                class="vueWaterfallEasy">
                <div slot="waterfall-head" class="fall_head">
                    <div class="detailImg">
                        <img class="image_size" :src="proDetailVal.src" alt="">
                    </div>
                    <div class="detail_list">
                        <div class="right_title">#北欧家居#</div>
                        <div class="right_list">
                            <img class="image_photo" :src="proDetailVal.src" alt="">
                            <div><h1>MUZI</h1></div>
                            <div><h3>设计师</h3></div>
                        </div>
                        <div class="right_btn">
                            <Button type="warning"  long>在创作</Button>
                            <Button type="warning" ghost long>收藏</Button>
                        </div>
                    </div>
                </div>
                <div slot="waterfall-head">
                    <div class="discoverTitle">
                        <div>单品列表</div>
                        <ul class="item_list">
                            <li class="item_list_li" v-for="(item,index) in imgsArr" :key="index">
                                <img :src="item.src" alt="">
                                <p>这是第{{index}}张单品</p>
                                <p><Icon type="logo-yen" />500</p>
                                <div class="iconBox flexLayout">
                                    <i  class="iconfont iconshoucang1"></i>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div slot="waterfall-head">
                    <div class="discoverTitle">推荐方案</div>
                </div>
                <div class="img-info" slot-scope="props">
                    <p class="some-info">第{{props.index+1}}张图片</p>
                    <p class="some-info">{{props.value.info}}</p>
                </div>
                <div slot="waterfall-over">waterfall-over</div>
            </vue-waterfall-easy>
        </div>
    </div>
</template>
<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
import { getGoodsType } from '@/api/data.js'
import { mapState } from 'vuex'
export default {
    name: 'proDetail',
    computed: {
        ...mapState({
            proDetailVal: state =>{
                return state.app.proDetailVal
            },
        })
    },
    components: {
        vueWaterfallEasy
    },
    data() {
        return {
            msg: '方案详情页',
            selectList:[
                {title:"方案",id:"1"},
                {title:"单品",id:"2"},
            ],
            leftIcon: 'iconfont iconxiala-',
            changeblue:0,
            imgsArr: [],
            dataArr:[],
            setDataArr:[],
        }
    },
    created() {
        this.handleGetGoodsType()
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
            this.changeblue = index;
            
        },
        changeSelectFun(index, item){
            console.log('index',index)
            this.selectDefault = item.title
            var project = document.getElementById('project')
                project.style.display = 'none';
                this.leftIcon = 'iconfont iconxiala-'
        },
        //数据重组
        handleGetGoodsType () {
            getGoodsType().then(res => {
                this.indoor_list = res.data.message
                this.dataArr = this.indoor_list.category[1].goods;
                var _this = this;
                for (let i = 0; i < _this.dataArr.length; i++) {
                var   setDataObj = {src: "",href: "",info: "",id: ""};
                    setDataObj.src = _this.dataArr[i]["goods_thumb"];
                    setDataObj.href = _this.dataArr[i]["goods_thumb"];
                    setDataObj.info = _this.dataArr[i]["goods_name"];
                    setDataObj.id = _this.dataArr[i]["goods_id"];
                    _this.setDataArr.push(setDataObj)
                }
                this.imgsArr = this.setDataArr
                console.log("详情",this.imgsArr)
            }).catch(err => {
                console.log(err)
            })
        },
        linkDetailFun(event, { index, value }) {
            event.preventDefault()
                // 只有当点击到图片时才进行操作
            if (event.target.tagName.toLowerCase() == 'img') {
                this.$store.dispatch('updataProDetailVal', value)
                this.$router.push({name:'proDetail'})
                console.log('img clicked', value)
                console.log(' vuex', this.proDetailVal)
                }
        },
        

    },
    
}
</script>
<style scoped>
.proDetailBody{
    background: #EDF0F2
}
.discoverTitle{
    font-size: 25px;
    color: #5a5656;
    text-align: left;
    margin: 0 9%
}
.fall_head{
    display: flex;
    justify-content: center;
    padding: 60px;
}
.detailImg{
    width: 60%;
    text-align: center;
    background: white;
}
.detail_list{
    margin-left: 20px;
    width: 20%;
    background: white;
    color:rgb(158, 155, 155);
    padding: 20px;
}
.image_size{
    width:780px;
    height: 546px;
}
.image_photo{
    width: 100px;
    height: 100px;
    border-radius: 100px; 
    border: 1px solid black;  
}
.right_title{
    padding-bottom: 10px;
    width: 100%;
    font-size: 20px;
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
</style>
