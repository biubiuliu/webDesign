<template style="overflow: hidden">
    <div class="mydesignBody">
        <div class="header_select flex" slot="waterfall-head">
            <div class="flex selectCusBox">
                <a class="sort"  href="javascript:;" @mouseenter="selectEnter('sort')" @mouseleave="selectLeave('sort')">
                    {{sortSelectList[sortLi].title}}
                    <i class="iconfont iconxiala-"></i>
                    <ul class="sort-ul">
                        <li  v-for="(item, index) in sortSelectList" :key="index"
                            :class="{sortSelect:sortLi==index}" @click="changeSelect(index,item,'sort')">
                            {{item.title}}
                        </li>                       
                    </ul>
                </a>
                <a class="file"  href="javascript:;" @mouseenter="selectEnter('dir')" @mouseleave="selectLeave('dir')">
                    {{dirSelectList[dirLi].dir_name}}
                    <i class="iconfont iconxiala-"></i>
                    <ul class="dir-ul">
                        <li  v-for="(item, index) in dirSelectList" :key="index"
                            :class="{dirSelect:dirLi==index}" @click="changeSelect(index,item,'dir')">
                            {{item.dir_name}}
                        </li>                       
                    </ul>
                </a>
            </div>
            <Button type="warning" @click="handleRender" class="add-dir">
                <i  class="iconfont iconjia"></i>
                新建文件
            </Button>
        </div>
        <div style="z-index:99;padding-top: 0px;">
            <div class="parent"  v-if="imgsArr.length">
                <div  class="child" v-for="(item, index) in imgsArr" :key="index">
                    <!-- <div class="img"> -->
                        <img :src="item.src" alt="" onerror="this.src='https://run.mockplus.cn/assets/logo.png'">
                    <!-- </div>                         -->
                    <div  class="scheme-img-info">
                        <p class="some-info">{{item.name}}</p>
                        <p class="some-info">{{item.updated_at}}</p>
                    </div>
                    <div class="mask">
                        <div style="position:relative">
                            <a class="midify" href="javascript:;" @click="toDetail(item.id)">
                                <i class="iconfont iconiconset0137"></i>
                            </a>
                            <a href="javascript:;"  @click="del(item.id)">
                                <i class="iconfont iconshanchu"></i>
                            </a>
                            <a href="javascript:;" @click="copy(item.id)">
                                <i class="iconfont iconfuzhi1"></i>
                            </a>                                 
                            <Dropdown trigger="click"  @on-click="operation" style=" position: absolute;right: 63px;top: 100px;z-index:99">
                                <a href="javascript:;">
                                    <i class="iconfont icongengduo"></i>
                                </a>
                                <DropdownMenu slot="list">
                                    <Dropdown placement="left-start"  v-if='moveDirList.length'>
                                        <DropdownItem>
                                            <i class="iconfont iconzuo"></i>
                                            移动到
                                        </DropdownItem>
                                        <DropdownMenu slot="list">
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
                    </div>   
                </div> 
            </div>            
            <div v-else class="no-scheme">
                抱歉 没有找到匹配的结果
            </div>
            <a class="more" href="javascript:;" v-if="page<total_page||page==total_page&&page!=1" @click="handleGetList">更多</a>
        </div>
        <Modal
            v-model="shemeInfoModal"
            title="修改方案"
            @on-ok="shemeInfoModalok">
           <Form :model="shemeInfo" >
                <FormItem>
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
                <FormItem>
                    <Input v-model="shemeInfo.phone" placeholder="填写客户手机号"></Input>
                </FormItem>
                <FormItem>
                    <Input v-model="shemeInfo.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="填写客户楼盘地址"></Input>
                </FormItem>
            </Form>
        </Modal>
     </div>
</template>
<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
import { getMeals, getDirList, addSchemeDir, modifySchemeInfo, getSchemeInfo, getSchemeGoodsList } from '@/api/data.js'
import { getEnumList } from  '@/api/material.js'
import { convertTimeStamp } from '@/libs/util.js'

export default {
    name: 'mydesign',
    components: {
        vueWaterfallEasy
    },
    data() {
        return {
            msg: '这是我的设计ss',
            sortSelectList:[
                {title:"排序",id:0},
                {title:"最新修改",id:"updated_at|desc"},
                {title:"最新创建",id:"created_at|desc"},
            ],
            dirSelectList:[{dir_name:"文件",id:''}],      
            moveDirList:[],      
            sortLi:0, // 排序筛选
            dirLi:0, // 文件夹筛选
            modal:false,// 新建文件弹框
            add_dir_name:'',
            imgsArr: [],
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
            }       
        }
    },
    created() {
        // 获取文件夹列表
        this.getDir();
        this.handleGetList();
        this.handleGetEnumList();
    },
    methods: {
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
                this.$refs.waterfall.waterfallOver()
                return
            }  
            let params = {
                user_id:'111',                            
                page:this.page,
                sorter:this.sortSelectList[this.sortLi].id,
                dir_id:this.dirSelectList[this.dirLi].id,
                page_size:10,
            }
            getMeals(params).then(res => {
                if(res.data.success){
                    if(this.page==1){
                        this.imgsArr=[];
                    }
                    this.page = this.page+1;
                    this.total_page = Math.ceil(res.data.message.total/10) ;  
                    if(res.data.message.data.length){
                        res.data.message.data.map((item,i)=>{
                        var  setDataObj = {
                            src: item.done_img_url,
                            href: item.done_img_url,  
                            name: item.scheme_name,
                            is_personal:item.is_personal,
                            updated_at:convertTimeStamp(item.updated_at),                                                   
                            id: item.id,
                        };
                        this.imgsArr.push(setDataObj);                      
                    });
                    }                                          
                }
            }).catch(err => {
                console.log(err)
            })
        },

        // 获取文件列表
        getDir () {
            getDirList().then(res=>{
                if(res.data.success){  
                    this.dirSelectList = [{dir_name:"文件",id:''}],                         
                    this.dirSelectList = this.dirSelectList.concat(res.data.message);   
                    this.moveDirList =  res.data.message                      
                }
            })
        },

        // 添加文件
        addDir (name) {
            addSchemeDir(name).then(res => {
                if(res.data.success){
                    this.$Message.success('添加成功');
                    this.add_dir_name = '';
                    this.getDir()
                }else{
                    this.$Message.error(res.data.message); 
                    this.add_dir_name = ''
                }
            })
        },

        // 修改方案
        toDetail (id){
            this.$Message.info('修改'+id);
            this.$router.push({name:'proDetail'})
        },

        // 修改方案信息确定
        shemeInfoModalok () {         
            console.log(this.shemeInfo) 
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
                        this.shemeInfo.scheme_name:item.name
                    })                 
                }else{
                    this.$Message.error(res.data.message);
                }
                this.shemeInfoModal = false
            })         
        },

        // 删除方案
        del (id) {
            this.$Modal.confirm({
                    title: '提示',
                    content: '<p>是否删除该方案'+id+'</p>',
                    onOk: () => {
                        this.$Message.info('Clicked ok');
                    },
                    onCancel: () => {
                        this.$Message.info('Clicked cancel');
                    }
            });
        },

        // 拷贝
        copy (id) {
             this.$Message.info('拷贝');
        },

        // 移动到文件夹
        moveToDir (name) {
            console.log(name)
        },

        // 下载图片
        down (name){
            var a = document.createElement('a')
            var event = new MouseEvent('click') 
            a.download = name || '下载图片名称'  
            this.imgsArr.forEach((item)=>{
                if(item.id==parseInt(name.split("-")[1])){
                    a.href=item.src
                }
            })                 
            a.dispatchEvent(event)            
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
            var id = name.split("-")[1];
            getSchemeGoodsList(id).then(res => {
                if(res.data.success){                  
                   
                }
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
        handleRender () {
            this.$Modal.confirm({
                render: (h) => {
                    return h('Input', {
                        props: {
                            value: this.add_dir_name,
                            autofocus: true,
                            placeholder: '请输入文件夹名称'
                        },
                        on: {
                            input: (val) => {
                                this.add_dir_name = val;
                            }
                        }
                    })
                },
                onOk: () =>{
                   this.addDir(this.add_dir_name)
                },
                onCancel: () =>{
                   this.add_dir_name = ""
                }
            })
        },
    },  
}
</script>
<style scoped>
.mydesignBody{
    background: #f2f2f4;
    color: black;
    height: 93vh; 
    font-size: 14px;
    position: relative;
}
.header_select{
    /* position: fixed;
    left: 0;
    right: 0;
    z-index: 1; */
    background: #f2f2f4;
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
.vueWaterfallEasy{
    left: 0px;
    z-index: 0;
    padding-top: 100px;
    box-sizing: border-box;
}
.sort,.file{
    color: #333;
    position: relative; 
    min-width: 70px;
}
.sort{
    margin-right: 40px;
}

.on{
    display: block;
}
.sort:hover .sort-ul,.file:hover .dir-ul{
    display: block;
}
.sort:hover .iconfont{
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
.sort-ul li:hover,.dir-ul li:hover{
    background: #f2f2f2!important;
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
.no-scheme{
    width: 100%;
    margin-top: 20px;
    font-size: 24px;
    color: #7e8e98;
    line-height: 400px;
}
.parent { 
    width:100%;
    -moz-column-count: 5;
    -webkit-column-count: 5;
    column-count: 5;
    padding:0 60px;
    margin-top: 20px;
}
.child {
    background: #fff;
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
.mask{
    display:none;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0,0,0,0.2)
}
.child:hover .mask{
   display:block;
}
.midify{
    background: #ff9a00;
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    text-align: center;
    position: absolute;
    left: 10px;
    top: 10px;
}
.iconshanchu{
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 20px;
}
.mask a i{
    color: #fff;
}
.iconfuzhi1{
    position: absolute;
    right: 10px;
    top: 60px;
    font-size: 17px;
}
.icongengduo{  
    font-size: 22px;
    position: absolute;
    right: -54px;
    top: -1px;
}
.more{
    display: block;
    text-align: center;
    margin: 100px auto;
    line-height: 40px;
    width: 150px;
    border-radius: 20px;
    border:1px solid #ddd;
    color: #666;
}

</style>
