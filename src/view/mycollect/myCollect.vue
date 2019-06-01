<template>
    <div class="mycollect">
        <vue-waterfall-easy ref="waterfall"
                                style="width:100%; height:90vh; overflow: hidden"
                                :imgWidth="290" :imgsArr="imgsArr"
                                :enablePullDownEvent="true"
                                @scrollReachBottom="handleGetGoodsType"
                                @click="linkDetailFun"
                                class="vueWaterfallEasy">
                <div slot="waterfall-head">
                    <div class="collectTitle">
                        <div class="Item_collection collecttion">单品收藏</div>
                        <div class="scheme_collection collecttion">方案收藏</div>
                        <div @click="filtrateFun" class="filtrate_collection collecttion">筛选<i class="iconfont iconxiala-"></i></div>
                        <div>
                            <Modal
                                v-model="mycollectModel"
                                :closable="false"
                                :styles="{top: '120px',marginRight:'5%',width:'240px'}">
                                <div class="filtrate_model flexLayout">
                                    <div class="styles">风格</div>
                                    <div class="classify">分类</div>
                                </div>
                                <ul class="col_checkbox">
                                    <li><Checkbox v-model="single">椅子</Checkbox></li>
                                    <li><Checkbox v-model="single">桌子</Checkbox></li>
                                    <li><Checkbox v-model="single">沙发</Checkbox></li>
                                </ul>
                            </Modal>
                        </div>
                    </div>
                </div>
                <div class="img-info" slot-scope="props">
                    <p class="some-info">第{{props.index+1}}张图片</p>
                    <p class="some-info">{{props.value.info}}</p>
                </div>
                <div slot="waterfall-over">waterfall-over</div>
        </vue-waterfall-easy>
    </div>
</template>
<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
import { getGoodsType } from '@/api/data.js'

import { mapState } from 'vuex'
export default {
    name: 'mycollect',
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
            msg: '这是收藏',
            single:false,
            imgsArr: [],
            dataArr:[],
            setDataArr:[],
            mycollectModel:false
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
        },
        //筛选
        filtrateFun(){
            this.mycollectModel = !this.mycollectModel
        }

    }
    
}
</script>
<style scoped>
.mycollect{
    color: black
}
.collectTitle{
    display: flex;
    justify-content: center;
    width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    padding: 0 60px;
    position: relative;
}
.collecttion{
    width: 200px;
}
.scheme_collection{
    /* margin-left: auto; */
}
.Item_collection{
    /* margin-left: auto; */
}
.filtrate_collection{
    position: absolute;
    right: 0
    /* margin-left: auto; */
}
.flexLayout{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
}
.goodsLi{
    position: relative;
}
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;    
}
.ivu-modal{
    top: 0;
    right:0;
    margin:0;
    width:0;
}
.filtrate_model{
    text-align: center;
    font-size: 16px;
    height: 40px;
    border-bottom: 1px solid #c0c0c0;
}
.classify{
    width: 50%
}
.styles{
    width: 50%
}
.col_checkbox >li{
    padding: 0 20px;
    margin-top: 10px;
}
</style>
