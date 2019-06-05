<template>
    <div class="mydesignBody">
        <div class="header_select flex">
            <div class="flex selectCusBox">
                <a class="sort"  href="javascript:;" @mouseenter="selectSortEnter" @mouseleave="selectSortLeave">
                    {{sortSelectList[sortLi].title}}
                    <i class="iconfont iconxiala-"></i>
                    <ul class="sort-ul">
                        <li  v-for="(item, index) in sortSelectList" :key="index"
                             :class="{sortSelect:sortLi==index}" @click="changeSortSelect(index,item)">
                            {{item.title}}
                        </li>                       
                    </ul>
                </a>
                <div class="file">
                    文件
                    <i class="iconfont iconxiala-"></i>
                </div>
            </div>
            <Button type="warning">
                <i  class="iconfont iconjia"></i>
                新建文件
            </Button>
        </div>
        
        <div>
            <vue-waterfall-easy ref="waterfall" style="position:absolute;width:100%; height:85vh" :imgWidth="290" :imgsArr="imgsArr"  :enablePullDownEvent="true" @scrollReachBottom="handleGetGoodsType" class="vueWaterfallEasy">
                <div class="img-info" slot-scope="props">
                    <p class="some-info">第{{props.index+1}}张图片</p>
                    <p class="some-info">{{props.value.info}}</p>
                </div>
                <!-- <div slot="waterfall-over">waterfall-over</div> -->
            </vue-waterfall-easy>
        </div>
    </div>
</template>
<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
import { getMeals,getDirList } from '@/api/data.js'
export default {
    name: 'mydesign',
    components: {
        vueWaterfallEasy
    },
    data() {
        return {
            sortSelectList:[
                {title:"排序",id:"1"},
                {title:"最近修改",id:"created_at|desc"},
                {title:"最新修改",id:"created_at|desc"},
            ],
            dirSelectList:[{}],
            sortLi:0,
            msg: '这是我的设计ss',
            imgsArr: [],
            dataArr:[],
            setDataArr:[]
            
        }
    },
    created() {
        this.handleGetGoodsType();
        // 获取文件夹列表
        this.getDir();
    },
    methods: {
        // 排序顺序
        selectSortEnter(){
            var ul = document.getElementsByClassName('sort-ul');
            ul[0].style.display = 'block';
        },

        // 排序顺序
        selectSortLeave(){
            var ul = document.getElementsByClassName('sort-ul');
            ul[0].style.display = 'none';
        },

        // 修改排序规则
        changeSortSelect(index, item){
            this.sortLi = index;
            var ul = document.getElementsByClassName('sort-ul');
            ul[0].style.display = 'none';
        },

        //数据重组
        handleGetGoodsType () {
            let params = {
                user_id:'',
                style_type:0,
                space_type:0,
                is_personal:1,
                series:0,
                bid:0,
                page:1,
                sorter:'created_at|desc'
            }
            getMeals(params).then(res => {
                console.log(res)
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

        getDir(){
            getDirList().then(res=>{
                console.log(res)
            })
        },
    },
    
}
</script>
<style scoped>
.mydesignBody{
    background: #fff;
    color: black;
    padding: 40px;
    min-height: 93vh;
    font-size: 14px;
}
.header_select{
    margin: 0 10%;
}
.flex{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    flex-direction: row;
}
.selectCusBox{
    width: 150px;
    /* position: relative; */
}
.selectCusDiv{
    position: absolute;
    width: 100px;
}
.vueWaterfallEasy{
    left: 0px;
    z-index: 0;
}
.sort{
    color: #333;
    position: relative;
}

.on{
    display: block;
}
.sort:hover .sort-ul{
    display: block;
}
.sort:hover .iconfont{
    transform:rotate(180deg)
}
.sort-ul{
    width: 80px;
    background: #fff; 
    margin-top: 10px;
    position: absolute;
    box-shadow:0 0 1px #000 inset;
    left: -20px;
    z-index: 1;
    display: none;
}
.sort-ul li{
    line-height: 28px;
    font-size: 14px;
    padding: 0 10px;
    color: #666;
}
.sortSelect{
    background: #ff9a00;
    color: #fff!important;
}
</style>
