<template style="overflow: hidden">
    <div>
        <div class="waterfall">
            <vue-waterfall-easy ref="waterfall"
                                style="width:100%; height:90vh; overflow: hidden"
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
                                    <input class="search_input" placeholder="这是一个搜索" type="text">
                                    <div class="searchBtn">
                                        <i class=" iconfont iconsousuo" style="font-size:30px;color:white;"></i>
                                    </div>
                                    
                                </div>
                            </div>
                    </Content>
                </div>
                <div slot="waterfall-head">
                    <div class="discoverLable">
                        <Button  >
                            Forward
                            <Icon type="md-close" />
                        </Button>
                        <div class="vertical">
                            <span>空间标签 :</span>
                            <Button>全部</Button>
                            <Button class="roomlabel" v-for="(item,index) in roomLabelArr" :key="index">{{item.room}}</Button>
                        </div>
                        <div  class="vertical">
                            <span>风格标签 :</span>
                            <Button>全部</Button>
                            <Button class="roomlabel" v-for="(item,index) in roomStyleArr" :key="index">{{item.room}}</Button>
                            </div>
                        <div  class="vertical">
                            <span>品牌标签 :</span>
                            <Button>全部</Button>
                            <Button class="roomlabel" v-for="(item,index) in roomLabelArr" :key="index">{{item.room}}</Button>
                            </div>
                    </div>
                </div>
                <div slot="waterfall-head">
                    <div class="discoverTitle">方案精选</div>
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
            dataArr:[],
            setDataArr:[],
            roomLabelArr:[
                {"room":"客厅",id:"1"},
                {"room":"主卧",id:"2"},
                {"room":"次卧",id:"3"},
                {"room":"阳台",id:"4"},
                {"room":"多功能房",id:"5"},
                {"room":"老人房",id:"6"},
                {"room":"儿童房",id:"7"},
                {"room":"卫生间",id:"8"},
            ],
            roomStyleArr:[
                {"room":"日式",id:"1"},
                {"room":"前卫",id:"2"},
                {"room":"美式",id:"3"},
                {"room":"简欧",id:"4"},
                {"room":"法式",id:"5"},
                {"room":"北欧风",id:"6"},
                {"room":"工业风",id:"7"},
                {"room":"新中式",id:"8"},
                {"room":"地中海",id:"9"},
                {"room":"东南亚",id:"10"},
                {"room":"Art Deco",id:"11"},
                {"room":"欧式古典",id:"12"},
                {"room":"传统中式",id:"13"},
            ]
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
    
}.search_box{
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
}
.seachchange{
    background: #f90;
}
.vueWaterfallEasy{
    left: 0px;
    z-index: 0;
}
.waterfall{
    /* height: 100vh; */
    /* overflow: hidden; */
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
}
.vertical{
    margin: 20px 0;
}
</style>
