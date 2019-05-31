<template>
    <div class="mydesignBody">
        <div class="header_select flex">
            <div class="flex selectCusBox">
                <div class="sort">
                    排序
                    <i class="iconfont iconxiala-"></i>
                </div>
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
import { getGoodsType } from '@/api/data.js'
export default {
    name: 'mydesign',
    components: {
        vueWaterfallEasy
    },
    data() {
        return {
            msg: '这是我的设计ss',
            imgsArr: [],
            dataArr:[],
            setDataArr:[]
            
        }
    },
    created() {
        this.handleGetGoodsType()
    },
    methods: {
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
    },
    
}
</script>
<style scoped>
.mydesignBody{
    /* background: white !important; */
    color: black;
    padding: 40px;
    min-height: 93vh;
    font-size: 16px;
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
</style>
