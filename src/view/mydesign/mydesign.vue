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
            <vue-waterfall-easy ref="waterfall" style="position:absolute;width:100%; height:85vh" :imgWidth="290" :imgsArr="imgsArr"  :enablePullDownEvent="true" @scrollReachBottom="getData" class="vueWaterfallEasy">
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
import axios from 'axios'
export default {
    name: 'mydesign',
    components: {
        vueWaterfallEasy
    },
    data() {
        return {
            msg: '这是我的设计ss',
            imgsArr: [],
            group: 0, // request param
        }
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
        axios.get('../../../static/data-json.json?group=' + this.group) // 真实环境中，后端会根据参数group返回新的图片数组，这里我用一个惊呆json文件模拟
            .then(res => {
            if (this.group === 5) { // 模拟已经无新数据，显示 slot="waterfall-over"
                this.$refs.waterfall.waterfallOver()
                return
            }
            this.imgsArr = this.imgsArr.concat(res.data)
            this.group++
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
