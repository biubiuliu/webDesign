<template style="overflow: hidden">
    <div class="mydesignBody">
        <div class="header_select flex" slot="waterfall-head">
            <div class="flex selectCusBox">
                <a class="sort"  href="javascript:;" @mouseenter="selectEnter('sort')" @mouseleave="selectLeave('sort')">
                    {{sortSelectList[sortLi].title}}
                    <span><i class="iconfont iconxiala- iconblock"></i></span>
                    <ul class="sort-ul">
                        <li  v-for="(item, index) in sortSelectList" :key="index"
                            :class="{sortSelect:sortLi==index}" @click="changeSelect(index,item,'sort')">
                            {{item.title}}
                        </li>                       
                    </ul>
                </a>
                <a class="file" v-if="dirSelectList.length>1" href="javascript:;" @mouseenter="selectEnter('dir')" @mouseleave="selectLeave('dir')">
                    {{dirSelectList[dirLi].dir_name}}
                    <span><i class="iconfont iconxiala- iconblock"></i></span>
                    <ul class="dir-ul">
                        <li  v-for="(item, index) in dirSelectList" :key="index" style="text-align:left;position:relative"
                            :class="{dirSelect:dirLi==index}" @click="changeSelect(index,item,'dir')">
                            <span>{{item.dir_name}}</span>
                            <i v-if="item.dir_name!='文件'&&dirLi!=index" class="iconfont iconicon-pencil" style="color:#999;font-size:12px" @click.stop='delDir(item)'></i>
                        </li>                       
                    </ul>
                </a>
            </div>
            <Button type="warning" @click="handleRender" class="add-dir">
                <i  class="iconfont iconjia"></i>
                新建文件夹
            </Button>
        </div>
        <!-- 列表 -->
        <div style="z-index:99;width:100%;margin: 20px auto;">
            <Waterfall id='vueWaterfall' @loadmore="handleGetList" :gutterWidth="layout.gutterWidth" :gutterHeight='layout.gutterHeight' :align='layout.align' :minCol='layout.maxCol' :maxCol='layout.maxCol' class="vueWaterfall">
                 <WaterfallItem  v-for="(item, index) in imgsArr" :key="index" :width='itemWidth'>
                     <div class="item">
                        <div style="background:#fff;padding:15px 15px 0 15px">
                            <img :src='item.src' alt="加载错误">
                        </div>
                        <div  class="scheme-img-info">
                            <p class="some-info" :title="item.name">{{item.name}}</p>
                            <p class="some-info">{{item.time}}</p>
                        </div>
                        <div class="space_div" v-if="item.type==1">
                            <div class="space">{{item.space_name}}</div>
                            <div class="style">{{item.style_name}}</div>
                        </div>
                        <a class="mask">
                            <div style="position:relative">
                                <a class="midify" href="javascript:;" @click.stop="toDetail(item)">
                                    <i class="iconfont iconiconset0137" style="color:#fff"></i>
                                </a>
                                <a href="javascript:;" class="box" @click.stop="del(item.id,item.name)">
                                    <i class="iconfont iconshanchu" style="font-size: 22px;"></i>
                                </a>
                                <a href="javascript:;" class="box" @click.stop="copy(item)">
                                    <i class="iconfont iconfuzhi1" style="font-size: 18px;"></i>
                                </a>                                 
                                <Dropdown trigger="hover" placement="right-start" @on-click="operation" class="dropdown" style="position: absolute;left: 25px;top: 125px;z-index:99;">
                                    <div href="javascript:;" class="more_box">
                                        <i class="iconfont icongengduo" style='color:rgb(134, 142, 150);font-size: 26px;'></i>
                                    </div>
                                    <DropdownMenu slot="list">
                                        <Dropdown placement="right-start"  v-if='moveDirList.length'>
                                            <DropdownItem>
                                                移动到
                                                <i class="iconfont iconyou"></i>
                                            </DropdownItem>
                                            <DropdownMenu slot="list"  style="height:150px;overflow-y:scroll">
                                                <DropdownItem  v-for="(m,n) in moveDirList"  :key="n" :name="`${item.id}`+'_'+`${m.id}`" >
                                                    {{m.dir_name}}
                                                </DropdownItem>                                             
                                            </DropdownMenu>
                                        </Dropdown>
                                        <DropdownItem :name="'download-'+item.id">导出高清图</DropdownItem>
                                        <DropdownItem :name="'modify-'+item.id">修改信息</DropdownItem>
                                        <DropdownItem :name="'checkList-'+item.id">查看清单</DropdownItem>
                                        <DropdownItem :name="'isOpen-'+item.id+'-'+item.is_personal">{{item.is_personal==1?'公开':'取消公开'}}</DropdownItem>
                                    </DropdownMenu>  
                                </Dropdown>                               
                            </div>
                        </a>
                     </div>                   
                 </WaterfallItem>
            </Waterfall>      
            <div class="more"  v-if="imgsArr&&imgsArr.length&&page>total_page">暂无更多数据</div>
            <div class="no-scheme"  v-if="imgsArr&&!imgsArr.length">没有设计哦，快去设计吧~</div>
        </div>
        <!-- 修改方案 -->
        <Modal
            v-model="shemeInfoModal"
            title="修改方案"          
        >
           <Form :model="shemeInfo" ref="shemeInfo" :rules="ruleInline">
                <FormItem prop="scheme_name">
                    <Input v-model="shemeInfo.scheme_name" placeholder="填写方案名称"></Input>
                </FormItem>
                <FormItem>
                    <Row>
                        <Col span="10">
                            <Select v-model="shemeInfo.space_type"  placeholder="#选择空间#">
                                <Option v-for="(item,index) in selectRoomArr" :key="index" :value="item.id" >{{item.name}}</Option>
                            </Select>
                        </Col>
                        <Col span="10" offset="4">
                            <Select v-model="shemeInfo.style_type"  placeholder="#选择风格#">
                                <Option v-for="(item,index) in selectStyleArr" :key="index" :value="item.id" >{{item.name}}</Option>
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem prop="phone">
                    <Input v-model="shemeInfo.phone" placeholder="填写客户手机号"></Input>
                </FormItem>
                <FormItem prop="address">
                    <Input v-model="shemeInfo.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="填写客户楼盘地址"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" style="background:#f90;border-color: #f90"  @click="shemeInfoModalok('shemeInfo')">确定</Button>
                <Button @click="cancel('shemeInfo')">取消</Button>
            </div>
        </Modal>
        <!-- 添加文件夹 -->
        <Modal  v-model="addDirModal" title="添加文件夹" :mask-closable='false'>
             <Form :model="addDir" ref="addDir" :rules="dirRule">
                <FormItem prop="add_dir_name">
                    <Input v-model="addDir.add_dir_name" placeholder="填写文件名称"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button v-if='addDir.id' @click="delDirSure('addDir')">删除文件夹</Button>
                <Button type="primary" style="background:#f90;border-color: #f90"  @click="addDirOk('addDir')">确定</Button>
                <Button @click="cancel('addDir')">取消</Button>
            </div>
        </Modal>  
        <!-- 清单 -->
        <goodsMerchBill :visible='merchBillModal' :data='goodsList' :loading='tableLoading' v-on:visible="changeVisible"/>
        <!-- loading -->
        <Spin fix v-if="isShowSpin"  style='background:rgba(0,0,0,0)'>
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
     </div>   
</template>
<script>
import { getMeals, getDirList, addSchemeDir, modifySchemeInfo, getSchemeInfo, getSchemeGoodsList, delScheme, copyScheme } from '@/api/data.js'
import { getEnumList } from  '@/api/material.js'
import { convertTimeStamp,downloadImage } from '@/libs/util.js'
import {Waterfall, WaterfallItem} from 'vue2-waterfall';
import discoverVue from '../discover/discover.vue';
import goodsMerchBill from '@/components/commons/goodsMerchBill/goodsMerchBill'

export default {
    name: 'mydesign',
    components: {
        Waterfall, 
        WaterfallItem,
        goodsMerchBill
    },
    data() {
        const validatePhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('手机号不能为空'));
            } else if (!/^1[34578]\d{9}$/.test(value)) {
                callback('手机号格式不正确');
            } else {
                callback();
            }   
        };
        return {
            msg: '这是我的设计ss',
            layout:{
                gutterWidth:20,
                gutterHeight:20,
                resizable:true,
                align:'left',
                fixWidth:'',
                minCol:5,
                maxCol:5,
                percent:'',
                width:340,
            },
            distance:100,
            sortSelectList:[
                // {title:"排序",id:0},
                {title:"最新修改",id:"updated_at|desc"},
                {title:"最新创建",id:"created_at|desc"},
            ],
            dirSelectList:[{dir_name:"文件",id:''}],      
            moveDirList:[],      
            sortLi:0, // 排序筛选
            dirLi:0, // 文件夹筛选
            modal:false,// 新建文件弹框           
            imgsArr:null,
            page:1, 
            total_page:1,
            shemeInfoModal:false,
            selectRoomArr:[],
            selectStyleArr:[],
            shemeInfo:{
                id: null, // 方案id（编辑方案使用）
                scheme_name: "", // 方案名称1
                space_type: null, // 空间类型
                style_type: null, // 风格类型
                phone: "", // 手机
                address: "", //	地址
            },
            ruleInline: {
                    scheme_name: [
                        { required: true, message: '请输入方案名称', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true,validator:validatePhone,trigger:'blur'},            
                    ],
                    address:[
                         { required: true, message: '请输入地址', trigger: 'blur' },
                    ],
            },
            addDirModal:false,
            addDir:{
                id:0,
                add_dir_name:''
            },
            dirRule: {
                add_dir_name: [
                    { required: true, message: '请输入文件名称', trigger: 'blur' }
                ],
            },
            goodsList:[],          
            merchBillModal:false, // 商品清单的modal  
            isShowSpin:true,
            loading:false,
            tableLoading:true,
            total:0
        }
    },
    created() {
        // 获取文件夹列表
        this.getDir();
        this.handleGetList();
        this.handleGetEnumList();
    },
    computed:{
	      itemWidth(){  
	            return ((document.documentElement.clientWidth-120)/5)  //计算宽度
	      },
    },
    mounted () {
        // 添加滚动事件，检测滚动到页面底部
        window.addEventListener('scroll', this.handleScroll)
    },
    methods: {
        
        changeVisible (event) {
            this.merchBillModal = event
        },

        handleScroll() {
            // 变量scrollTop是滚动条滚动时，距离顶部的距离
       		var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
       		// 变量windowHeight是可视区的高度
       		var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
       		// 变量scrollHeight是滚动条的总高度
       		var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
            // 滚动条到底部的条件
            //console.log(scrollTop+windowHeight,scrollHeight)
            if(scrollTop+windowHeight==scrollHeight){
                // 写后台加载数据的函数
         	   this.handleGetList()
                return
            }   
        },

        imgError(item) {
            item.src = require('../../assets/defalut.png');
        },

        // 排序顺序
        selectEnter (type) {
            var ul = document.getElementsByClassName(type+'-ul');
            ul[0].style.display = 'block';
        },

        // 排序顺序
        selectLeave (type) {
            var ul = document.getElementsByClassName(type+'-ul');
            ul[0].style.display = 'none';
        },

        // 修改排序规则
        changeSelect (index, item,type) {  
            if(type=='sort'){
               this.sortLi = index;              
            }else{
               this.dirLi = index;            
            }        
            this.page = 1;
            this.total_page = 1;
            this.handleGetList();
            var ul = document.getElementsByClassName(type+'-ul');
            ul[0].style.display = 'none';
        },

        // 获取空间
        handleGetEnumList() {
            getEnumList().then(res=>{
                this.selectRoomArr = res.data.message.space_list
                this.selectStyleArr = res.data.message.style_list
            }).catch(err=>{
                console.log( err)
            })
        },

        // 数据重组
        handleGetList () {
            if(this.page!=1&&this.page> this.total_page){                    
                return
            } 
            if(this.loading){
                return;
            } 
            this.loading = true;
            let params = {
                type:1,                            
                page:this.page,
                sorter:this.sortSelectList[this.sortLi].id,
                dir_id:this.dirSelectList[this.dirLi].id,
            }
            getMeals(params).then(res => {
                this.isShowSpin = false;
                this.loading = false;  
                if(res.data.success){                    
                    if(this.page==1){
                        this.imgsArr=[];
                    }
                    
                    this.page = this.page+1;
                    this.total_page = Math.ceil(res.data.message.total/15) ;  
                    if(res.data.message.data.length){
                        
                        res.data.message.data.map((item,i)=>{
                        var  setDataObj = {
                            src: item.done_img_url,
                            href: item.done_img_url,  
                            name: item.scheme_name,
                            is_personal:item.is_personal,
                            time:convertTimeStamp(item.updated_at),                                                   
                            id: item.id,
                            space_name:item.space_name,
                            style_name:item.style_name,
                            type:1// 传详情用
                        };
                        //setDataObj.src = setDataObj.src+"?m="+Math.random()
                        this.imgsArr.push(setDataObj);                   
                    });
                  }                                          
                }                            
            }).catch(err => {
                console.log(err)
                this.isShowSpin = false;
                this.loading = false;  
            })
        },

        // 获取文件列表
        getDir () {
            getDirList().then(res=>{
                if(res.data.success){  
                    console.log();
                    this.dirSelectList = [{dir_name:"文件",id:''}];                         
                    this.dirSelectList = this.dirSelectList.concat(res.data.message.reverse());   
                    this.moveDirList =  res.data.message;                    
                }
            })
        },

        // 添加文件
        addDirFun (name) {
            addSchemeDir(name,this.addDir.id,0).then(res => {
                if(res.data.success){
                    this.$Message.success('操作成功');
                    this.addDir.add_dir_name = '';
                    this.addDirModal = false;
                    this.getDir()
                }else{
                    this.$Message.error(res.data.message); 
                    //this.add_dir_name = ''
                }
            })
        },

        // delDir
        delDir (item) {            
            this.addDirModal = true;
            this.addDir.id = item.id;
            this.addDir.add_dir_name = item.dir_name;
        },

        delDirSure (){   
            let dirInfo  = this.addDir; 
            console.log(dirInfo);       
            this.$Modal.confirm({
                    title: '提示',
                    content: '<p>是否删除该文件夹？</p>',
                    onOk: () => {
                          addSchemeDir(dirInfo.add_dir_name,dirInfo.id,1).then(res => {
                            if(res.data.success){
                                this.$Message.success('删除成功');
                                this.addDir.add_dir_name = '';
                                this.addDir.id = 0;
                                this.addDirModal = false;
                                this.getDir()
                            }else{
                                this.$Message.error(res.data.message); 
                                //this.add_dir_name = ''
                            }
                        })                   
                    },
                    onCancel: () => {

                    }
            });
        },

        // 修改方案
        toDetail (item){
            this.$store.dispatch('updataProDetailVal', item)           
            const {href} = this.$router.resolve({
                path: 'proDetail/'+item.id+'/'+item.type,            
            })
            window.open(href, '_blank')        
        },

        toProDetail(item){
             console.log(item.id)
            this.$store.dispatch("setSchemeId", item.id)
            //this.$router.push({name:'materialLib', query: {id: this.proId} })
            const {href} = this.$router.resolve({
                name: 'materialLib', 
                query: {id: item.id}        
            })
            window.open(href, '_blank')
        },

        // 修改方案信息确定
        shemeInfoModalok (name) {         
             this.$refs[name].validate((valid) => {
                 console.log(valid)
                    if (valid) {
                       let params = {
                            id:this.shemeInfo.id,
                            scheme_name:this.shemeInfo.scheme_name,
                            space_type:this.shemeInfo.space_type,
                            style_type:this.shemeInfo.style_type,
                            phone:this.shemeInfo.phone,
                            address:this.shemeInfo.address
                        } 
                        modifySchemeInfo(params).then(res=>{
                            if(res.data.success){
                                this.$Message.success(res.data.message);
                                this.imgsArr.map((item) => {
                                    item.name = item.id == this.shemeInfo.id? 
                                    this.shemeInfo.scheme_name:item.name;
                                    item.type=1;
                                })                 
                            }else{
                                this.$Message.error(res.data.message);
                            }
                            this.shemeInfoModal = false
                        })    
                    }
                })                
        },

        cancel (name) {
            this.$refs[name].resetFields();
            if(name=='shemeInfo'){
                this.shemeInfoModal = false
            }else{
                this.addDirModal = false
            }
            this.addDir.id=0
        },

        // 删除方案
        del (id,name) {
            this.$Modal.confirm({
                    title: '提示',
                    content: '<p>是否删除'+name+'方案？</p>',
                    onOk: () => {
                        delScheme({ids:id.toString()}).then(res=>{
                            if(res.data.success){                               
                                this.imgsArr =  this.imgsArr.filter((obj) => (obj.id !== id))
                                this.$Message.success(res.data.message);
                            }
                        })                       
                    },
                    onCancel: () => {
                        //this.$Message.info('Clicked cancel');
                    }
            });
        }, 

        // 拷贝
        copy (item) {
             //this.$Message.info('拷贝');
             copyScheme({id:item.id}).then(res=>{
                if(res.data.success){  
                    var data = JSON.parse(JSON.stringify(item)) ;
                    data.name = item.name+'-副本';
                    data.time = '刚刚';  
                    data.id = res.data.message.id;            
                    this.imgsArr.unshift(data);
                    this.$Message.info('已拷贝')
                }else{
                    this.$Message.error('不能操作当前方案')
                }
            })
        },

        // 下载图片
        down (name){          
            this.imgsArr.forEach((item)=>{
                if(item.id==parseInt(name.split("-")[1])){
                    downloadImage(item.src,name);
                }
            })                         
        },

        // 修改信息
        modifyInfo (name) {
            var id = name.split("-")[1];
            getSchemeInfo(id).then(res => {
                if(res.data.success){
                    this.shemeInfoModal = true;
                    this.shemeInfo = res.data.message
                }
            })
        },

        // 获取商品清单
        getGoodsList (name) {
            this.tableLoading = true;
            this.merchBillModal = true;
            var id = name.split("-")[1];
            getSchemeGoodsList(id).then(res => {
                if(res.data.success){ 
                                              
                   this.goodsList = res.data.message;
                }
                   
                this.tableLoading = false
            }).catch(err => {
                console.log(err)
                this.tableLoading = false;
            })
        },

        // 是否公开
        modifyIsOpen(name){
            console.log(name.split("-"))
            let params = {
                id: parseInt(name.split("-")[1]),
                is_personal: parseInt(name.split("-")[2])==1?0:1
            }
            let info = params.is_personal ==1?'取消公开':"公开"
            this.$Modal.confirm({
                    title: '提示',
                    content: '<p>是否'+info+'该方案</p>',
                    onOk: () => {
                        modifySchemeInfo(params).then(res=>{
                            if(res.data.success){
                                this.$Message.success(res.data.message);
                                this.imgsArr.map((item) => {
                                    console.log(item.id)
                                    item.is_personal = item.id == params.id? 
                                    params.is_personal:item.is_personal
                                })                 
                            }else{
                                this.$Message.error(res.data.message);
                            }
                        }) 
                    },
                    onCancel: () => {
                        
                    }
            });            
        },

        operation (name) {
            if(name.indexOf('-')>-1){
                if(name.indexOf('download')>-1){
                    this.down(name);
                }else if(name.indexOf('modify')>-1){
                    this.modifyInfo(name)
                }else if(name.indexOf('checkList')>-1){
                    this.getGoodsList(name)
                }else{
                    this.modifyIsOpen(name)
                }
            }else{
                var reg=/^[\d]+/g;
                var params = {
                    id: parseInt(name.split("_")[0]),
                    dir_id:name.split("_")[1]
                }
                modifySchemeInfo(params).then( res=> {
                    if(res.data.success){
                        this.$Message.info(res.data.message);
                        if(this.dirLi!=0){
                            this.imgsArr = this.imgsArr.filter((obj) =>obj.id !== params.id)
                        }
                    }else{
                        this.$Message.error(res.data.message)
                    }
                })
            }
        },

        // 弹框
        addDirOk(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.addDirFun(this.addDir.add_dir_name)
                }
            })
        },

        handleRender(){
            this.addDirModal = true
        }
    },  
}
</script>
<style scoped>
.mydesignBody{
    height: 93vh;
    background: rgb(237, 240, 242);
    color: black;
    font-size: 14px;
    position: relative;
    padding: 104px 60px 20px 60px;
}
.header_select{
    position: fixed;
    top:60px;
    left: 0;
    right: 0;
    z-index: 1; 
    background: rgb(237, 240, 242);
}
.flex{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    flex-direction: row;
    padding: 20px 50px 20px 20px;
}
.selectCusBox{
    /* width: 150px; */
    /* position: relative; */
}
.add-dir{
    height:40px;
}
.selectCusDiv{
    position: absolute;
    width: 100px;
}
.vueWaterfall{
    width: 100%;
    max-width: 100%!important
}
.waterfall-item img{
    width: 100%;
    display:block; 
    height: auto;
}
.vueWaterfallEasy{
    left: 0px;
    z-index: 0;
    /* padding-top: 100px; */
    box-sizing: border-box;
}
.sort,.file{
    color: #333;
    position: relative; 
    min-width: 70px;
}
.sort{
    margin-right: 40px;
    margin-left: 25px;
}

.on{
    display: block;
}
.sort:hover .sort-ul,.file:hover .dir-ul{
    display: block;
}
.iconblock{
    display: inline-block;
}
.sort:hover .iconblock,.file:hover .iconblock{
    transform-origin:center center;
    transition: transform .2s ease-in-out;
    transform:rotate(180deg)
}
.sort-ul,.dir-ul{
    min-width: 100px;
    background: #fff; 
    /* margin-top: 10px; */
    position: absolute;
    box-shadow:0 0 1px #000 inset;
    z-index: 1;
    display: none;
}
.sort-ul{
    left: -10px;
}
.dir-ul{
    left: -24px;
}
.sort-ul li,.dir-ul li{
    line-height: 28px;
    font-size: 14px;
    padding: 0 10px;
    color: #666;
}
.dir-ul li{
    display: flex;
    justify-content: space-between
}
.dir-ul li i{
   display: none
}
.dir-ul li:hover i{
    display: block;
}
.sort-ul li:hover,.dir-ul li:hover{
    background: #f5f7f9!important;
    color: #666!important;
}
.sortSelect,.dirSelect{
    background: #ff9a00;
    color: #f2f2f4!important;
}
.add-dir-input{
    width: 300px;
    height: 40px;
    border:1px solid rgb(255, 154, 0);
    background-color: rgb(242, 242, 242);
    border-radius: 2px; 
    padding:0 10px;
}
.scheme-img-info{
    padding:10px 15px;
    display: flex;
    align-items: center;
    background: #fff;
}
.scheme-img-info .some-info:nth-child(1) {
    flex: 1;
    text-align: left;
    color: #333;
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
.no-scheme{
    width: 100%;
    margin-top: 20px;
    font-size: 24px;
    color: #7e8e98;
    line-height: 400px;
}
.item{
    position: relative;
    border-radius:4px;
    overflow: hidden;
    box-shadow:0 1px 4px rgba(6,31,50,.2);
    border: 1px none #444;
}
.item:hover{
    box-shadow:  0 2px 10px rgba(6, 31, 50, .3);
}
.mask{
    display:none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    /* bottom:0; */
    /* background: rgb(0,0,0,0.12) */
}
.item:hover .mask{
   display:block;
}
.mask .box,.more_box{
    width: 40px;
    height: 40px;
    text-align: center;
    background: #fff;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items:center
}
.dropdown{
    position: absolute;
    left: 25px;
    top: 125px;
    z-index:99
}
.mask .box i,.more a i{
    color:rgb(134, 142, 150)!important
}
.midify{
    background: #ff9a00;
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    text-align: center;
    position: absolute;
    right:25px;
    top: 25px;
}
.mask .box:nth-child(2){
    position: absolute;
    left: 25px;
    top:25px;
    font-size: 20px;
}
.mask .box:nth-child(3){
    position: absolute;
    left: 25px;
    top: 75px;
    font-size: 17px;
}
.mask .box:nth-child(1){  
    font-size: 22px;
    position: absolute;
    left: -54px;
    top: -1px;
}
.more{
    display: block;
    text-align: center;
    margin: 10px auto;
    line-height: 40px;
    width: 150px;
    color: #666;
}

.img-box{
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.waterfall-item{
    box-sizing: content-box!important
}
.space,.style{
    padding:2px 10px;
    background-color: #b2c0c8;
    border-radius: 4px;
    font-size: 14px;
    font-style: normal;
    color: rgba(255,255,255,0.9);
    text-align: center;
    line-height: 20px;
    margin-right: 10px;
}
.space_div{
    display: flex;
    justify-content: flex-start;
    background: #fff;
    padding:0 10px 10px 10px;
}
</style>
