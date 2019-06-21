<template>
    <div class="mycollect">
        <div class="header">
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
                        @on-ok="sureChoose"
                        @on-cancel="exitChoose"
                        :closable="false"
                        :mask-closable="false"
                        :styles="{top: '120px',marginRight:'5%',width:'240px'}">
                        <div class="filtrate_model flexLayout">
                            <a class="styles" :class="{'isSelectChoose':type==1}" @click="changeChoose(1)">风格</a>
                            <a class="classify" :class="{'isSelectChoose':type==2}" @click="changeChoose(2)">分类</a>
                        </div>
                        <ul class="col_checkbox">
                            <div  v-if="type==1">
                                <li v-for="(item,index) in selectStyleArr" :key="index" >
                                    <Checkbox  size='large' @on-change="changeSelectStyle(index,item.checked)" v-model="item.checked">
                                        {{item.style_name}}({{item.count}})
                                    </Checkbox>
                                </li>
                            </div>
                            <div v-else>
                                <li  v-for="(item,index) in selectCatArr" :key="index">
                                    <Checkbox  size='large' @on-change="changeSelectRoom(index,item.checked)" v-model="item.checked">
                                        {{item.cat_name}}({{item.count}})
                                    </Checkbox>
                                </li>
                            </div>
                        </ul>
                    </Modal>
                </div>
            </div>
        </div>
        <div class="parent">
            <schemeList :imgsArr = 'goodsArr' v-if="isSelect==2"/> 
            <schemeList :imgsArr = 'schemeArr' v-else/>  
            <Spin fix v-if="isShowSpin" style="top:120px">
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
        </div>    
        <div v-if="!goodsArr.length&&isSelect==2" class="no-scheme">
                还没有收藏的商品哦~
        </div> 
        <div v-if="!schemeArr.length&&isSelect==1" class="no-scheme">
                还没有收藏的方案哦~
        </div>
         
    </div>
</template>
<script>
import { getCollectList , getCollectScreen } from '@/api/data.js'
import { convertTimeStamp } from '@/libs/util.js'
import { mapState } from 'vuex'
import schemeList from '@/components/commons/schemeList/schemeList'

export default {
    name: 'mycollect',
    components: {
        schemeList
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
            goodsArr:[],
            schemeArr:[],
            mycollectModel:false,
            selectCatArr:[],
            selectStyleArr:[],   
            beforeSelectCat:[],
            beforeSelectStyle:[],     
            type:1,
            isShowSpin:true,
            loading:false,
        }
    },
    created() {
        this.handleGetGoodsType()
        this.handleGetEnumList()
    },
    methods: {
        imgError(item) {
            item.src = require('../../assets/defalut.png');
        },
        
        changeSelectStyle(i,data){          
            this.selectStyleArr[i].checked = data;
        },

        changeSelectRoom(i,data){
            this.selectCatArr[i].checked = data;;
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
              getCollectScreen().then(res => {
                if(res.data.success){
                     res.data.message.cat_group.map((item)=>{
                         item.checked = false;
                     })
                     res.data.message.style_group.map((item)=>{
                         item.checked = false;
                     })
                    this.selectCatArr = res.data.message.cat_group;
                    this.selectStyleArr = res.data.message.style_group;
                    this.beforeSelectCat = JSON.parse(JSON.stringify(this.selectCatArr));
                    this.beforeSelectStyle = JSON.parse(JSON.stringify(this.selectStyleArr));
                }
            })
        },

        // 数据重组
        handleGetGoodsType (cat_ids,style_type) {
            this.isShowSpin = true;
            var getData = this.isSelect == 1 ? getCollectList(this.isSelect):getCollectList(this.isSelect,style_type,cat_ids);
            getData.then(res => {   
                if(res.data.success){ 
                    this.isSelect == 1 ?this.schemeArr=[]:this.goodsArr=[];                                            
                    if(res.data.message.length){                                                
                        res.data.message.map((item,i)=>{                      
                            var  setDataObj = {
                                src: item.img_url,
                                href: item.img_url,  
                                name: item.name,                                                  
                                id: item.id,
                                price:item.shop_price,
                                time:convertTimeStamp(item.created_at),
                                type:this.isSelect,
                                // style_name:item.style_name,
                                // space_name:item.space_name,
                            };
                           this.isSelect == 1 ?this.schemeArr.push(setDataObj):this.goodsArr.push(setDataObj);                                          
                        });
                    }  
                }   
                this.isShowSpin =false;                                             
            }).catch(err => {
                console.log(err)
                this.isShowSpin = false;
            })
        },

        // 确定筛选
        sureChoose () {
            this.beforeSelectCat = JSON.parse(JSON.stringify(this.selectCatArr));
            this.beforeSelectStyle = JSON.parse(JSON.stringify(this.selectStyleArr));
            var cat_ids = [];
            var style_type = [];
            this.selectCatArr.map((item)=>{
                if(item.checked){
                    cat_ids.push(item.cat_id)
                }
            })
            this.selectStyleArr.map((item)=>{
                if(item.checked){
                    style_type.push(item.style_id.toString())
                }
            })

            this.handleGetGoodsType (cat_ids.length?cat_ids.join(','):'',style_type.length?style_type.join(','):'')
        },

        // 取消筛选 
        exitChoose () {
            this.selectCatArr = JSON.parse(JSON.stringify(this.beforeSelectCat));
            this.selectStyleArr = JSON.parse(JSON.stringify(this.beforeSelectStyle));
        },

        linkDetailFun (value) {
            console.log(value)
            this.$store.dispatch('updataProDetailVal', value)
            //this.$router.push({name:'proDetail',query: {data:value}})
            this.$router.push({path:'proDetail/'+value.id+'/'+value.type})
        },

        // 筛选
        filtrateFun(){
            this.mycollectModel = !this.mycollectModel;         
        }
    }  
}
</script>
<style scoped>
.mycollect{
    color: black;
}
.header{
    position: fixed;
    width: 100%;
    z-index: 1;
    top: 60px;
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
    padding-top: 10px;
    max-height: 400px;
    overflow-y: scroll;
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
}
.img-info{
    padding:14px 25px;
    font-size: 16px;
    color: #666;
    background: #fff;
    text-align: left
}
.parent { 
    width:100%;
    padding:60px 60px 40px 60px;
    margin-top: 20px;
}
.child {
    background: #f2f2f2;;
    margin-bottom:20px;	 
    -moz-page-break-inside: avoid;
    -webkit-column-break-inside: avoid;
    break-inside: avoid;
    color:#f2f2f4;
    /* width: 340px; */
    overflow: hidden;
    box-sizing: border-box;
    border-radius: 10px;
    position: relative;
    border:1px solid #ddd;
    /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3); */
}
.child img{
    width: 100%;
    display:block; 
}
.goods-img{
    /* height: 320px;
    overflow: hidden; */
}
.goods-img img{
    width: 100%;   
}
.scheme-img-info{
    padding:14px 25px;
    display: flex;
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
    text-align: right;
    color: #999;
    font-size: 14px;
}
.img-info .some-info{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
    color: #666;
    font-size: 16px;
}

</style>
