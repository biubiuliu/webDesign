<template>
    <div class="mycollect">
        <vue-waterfall-easy ref="waterfall"
            style="width:100%; height:90vh; overflow: hidden"
            :imgWidth="290" :imgsArr="imgsArr"
            :enablePullDownEvent="false"
            @click="linkDetailFun"
            class="vueWaterfallEasy">
            <div slot="waterfall-head">
                <div class="collectTitle">
                    <a class="Item_collection collecttion" :class="{'isSelect':isSelect==2}" href="javascript:;" @click="changeSelect(2)">
                        商品收藏
                    </a>
                    <a class="scheme_collection collecttion" :class="{'isSelect':isSelect==1}" href="javascript:;"  @click="changeSelect(1)">
                        方案收藏
                    </a>
                    <a @click="filtrateFun" v-if='isSelect==2' class="filtrate_collection collecttion">
                        筛选<i class="iconfont iconxiala-"></i>
                    </a>
                    <div>
                        <Modal
                            v-model="mycollectModel"
                            :closable="false"
                            :styles="{top: '120px',marginRight:'5%',width:'240px'}">
                            <div class="filtrate_model flexLayout">
                                <a class="styles" :class="{'isSelectChoose':type=='style'}" @click="changeChoose('style')">风格</a>
                                <a class="classify" :class="{'isSelectChoose':type=='classify'}" @click="changeChoose('classify')">分类</a>
                            </div>
                            <ul class="col_checkbox">
                                <CheckboxGroup v-model="selectStyle" v-if="type=='style'" @on-change="changeSelectStyle">
                                    <Checkbox  size='large' v-for="(item,index) in selectStyleArr" :key="index" :label="item.id">
                                        {{item.style_name}}
                                    </Checkbox>
                                </CheckboxGroup>
                                <CheckboxGroup v-model="selectRoom" v-else  @on-change="changeSelectRoom">
                                    <Checkbox  size='large' v-for="(item,index) in selectRoomArr" :key="index" :label="item.cat_id">
                                        {{item.cat_name}}
                                    </Checkbox>
                                </CheckboxGroup>                                   
                            </ul>
                        </Modal>
                    </div>
                </div>
            </div>
            <div class="img-info" slot-scope="props">              
                <p class="some-info">{{props.value.name}}</p>
            </div>
            <div slot="waterfall-over">暂无更多数据</div>
        </vue-waterfall-easy>
        <!-- <div v-if="!imgsArr.length" class="no-scheme">
                抱歉 没有找到匹配的结果
        </div> -->
    </div>
</template>
<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
import { getCollectList } from '@/api/data.js'
import { getEnumList,category } from  '@/api/material.js'

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
            isSelect:2,
            single:false,
            imgsArr: [],
            dataArr:[],
            setDataArr:[],
            mycollectModel:false,
            selectRoomArr:[],
            selectStyleArr:[],
            selectStyle:[],
            selectRoom:[],
            type:'style'
        }
    },
    created() {
        this.handleGetGoodsType()
        this.handleGetEnumList()
    },
    methods: {
        changeSelectStyle(data){
            console.log(data)//拿到的就是选中的数组。。默认是label的值，可以自定义
            this.selectStyle = data;
        },

        changeSelectRoom(data){
            console.log(data)//拿到的就是选中的数组。。默认是label的值，可以自定义
            this.selectRoom = data;
        },

        changeSelect(id){
            this.isSelect = id;
            this.page=1;
            this.handleGetGoodsType();
        },

        changeChoose(type){
            this.type = type;
        },

        // 获取分类风格
        handleGetEnumList() {
              category().then(res => {
                if(res.data.success){
                    this.selectRoomArr = res.data.message.category;
                    this.selectStyleArr = res.data.message.style;
                    this.brandLabelArr = res.data.message.brand;
                }
            })
        },

        // 数据重组
        handleGetGoodsType () {           
            getCollectList(this.isSelect).then(res => {                           
                    this.imgsArr=[];  
                    if(res.data.message.length){                             
                        res.data.message.map((item,i)=>{
                            var  setDataObj = {
                                src: item.img_url,
                                href: item.img_url,  
                                name: item.name,                                                  
                                id: item.id,
                            };
                            this.imgsArr.push(setDataObj);                      
                        });
                    }

                    this.$refs.waterfall.waterfallOver();
                    
                    
            }).catch(err => {
                console.log(err)
            })
        },

        linkDetailFun(event, { index, value }) {
            event.preventDefault()
                // 只有当点击到图片时才进行操作
            if (event.target.tagName.toLowerCase() == 'img') {
                this.$store.dispatch('updataProDetailVal', value)
                this.$router.push({name:'proDetail',query: {data:value}})
                console.log('img clicked', value)
                console.log(' vuex', this.proDetailVal)
                }
        },

        // 筛选
        filtrateFun(){
            this.mycollectModel = !this.mycollectModel;
            //this.selectStyle = [];
            //this.selectRoom = [];
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
    background: #fff;
}
.collecttion{
    width: 80px;
    color: #666;
    margin-right: 90px;
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
    width: 50%;
    color: #666;
}
.styles{
    width: 50%;
    color: #666;
}
.col_checkbox{ 
    margin-top: 10px;
}
.col_checkbox label{ 
    margin-right: 10px;
}
.isSelect{
    color: #f90;
    border-bottom: 3px solid #f90;
    width: 80px
}
.isSelectChoose{
    color: #f90;
}
.no-scheme{
    width: 100%;
    margin-top: 20px;
    font-size: 24px;
    color: #7e8e98;
    line-height: 400px;
    position: absolute;
    top: 120px;
}
.img-info{
    padding:14px 25px;
    font-size: 16px;
    color: #666;
    text-align: left
}
</style>
