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
                <Button type="warning" @click="handleRender">
                    <i  class="iconfont iconjia"></i>
                    新建文件
                </Button>
            </div>
            <div>
            <vue-waterfall-easy                   
                    ref="waterfall"
                    style="width:100%;height:93vh"
                    :imgWidth="340" :imgsArr="imgsArr"
                    :enablePullDownEvent="true"
                    @scrollReachBottom="handleGetList"
                    @click="linkDetailFun"
                    class="vueWaterfallEasy">
            
            <div class="scheme-img-info" slot-scope="props">
                <p class="some-info">{{props.value.name}}</p>
                <p class="some-info">{{props.value.updated_at}}</p>
            </div>
            <div slot="waterfall-over">暂无更多数据</div>
        </vue-waterfall-easy>
        <!-- <div v-else class="no-scheme">
            抱歉 没有找到匹配的结果
        </div> -->
        </div>
        
    </div>
</template>
<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
import { getMeals,getDirList,addSchemeDir } from '@/api/data.js'
export default {
    name: 'mydesign',
    components: {
        vueWaterfallEasy
    },
    data() {
        return {
            msg: '这是我的设计ss',
            sortSelectList:[
                {title:"排序",id:""},
                {title:"最新修改",id:"updated_at|desc"},
                {title:"最新创建",id:"created_at|desc"},
            ],
            dirSelectList:[{dir_name:"文件",id:""}],            
            sortLi:0, // 排序筛选
            dirLi:0, // 文件夹筛选
            modal:false,// 新建文件弹框
            add_dir_name:'',
            imgsArr: [],
            page:1, 
            total:0         
        }
    },
    created() {
        // 获取文件夹列表
        this.getDir();
        this.handleGetList();
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
            this.total = 1;
            this.handleGetList();
            var ul = document.getElementsByClassName(type+'-ul');
            ul[0].style.display = 'none';
        },

        //数据重组
        handleGetList () {
            if(this.page!=1&&this.page> Math.ceil(this.total/30)){
                this.$refs.waterfall.waterfallOver()
                return
            }  
            let params = {
                user_id:'',                
                is_personal:1,              
                page:this.page,
                sorter:this.sortSelectList[this.sortLi].id,
                dir_id:this.dirSelectList[this.dirLi].id,
                page_size:30,
            }
            getMeals(params).then(res => {
                if(res.data.success){
                    if(this.page==1){
                        this.imgsArr=[];
                    }
                    this.total = res.data.message.total;                 
                    res.data.message.data.map((item,i)=>{
                        var  setDataObj = {
                            src: item.done_img_url,
                            href: item.done_img_url,  
                            name: item.scheme_name,
                            canvas_type:item.canvas_type,
                            updated_at:item.updated_at,                                                   
                            id: item.id,
                        };
                        this.imgsArr.push(setDataObj);                      
                    });
                    this.page=this.page +1;                
                }
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

        // 获取文件列表
        getDir () {
            getDirList().then(res=>{
                if(res.data.success){  
                    this.dirSelectList = [{dir_name:"文件",id:""}],                         
                    this.dirSelectList =this.dirSelectList.concat(res.data.message);                                   
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
    background: #fff;
    color: black;
    /* padding: 40px; */
    /* height: 93vh;  */
    font-size: 14px;
    position: relative;
}
.header_select{
    /* margin: 0 10%; */
    margin-top:40px;
    position: fixed;
    left: 0;
    right: 0;
    z-index: 1;
}
.flex{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    flex-direction: row;
    padding:0 50px 0 20px;
}
.selectCusBox{
    /* width: 150px; */
    /* position: relative; */
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
    min-width: 80px;
    background: #fff; 
    margin-top: 10px;
    position: absolute;
    box-shadow:0 0 1px #000 inset;
    z-index: 1;
    display: none;
}
.sort-ul{
    left: 10px;
}
.dir-ul{
    left: -6px;
}
.sort-ul li,.dir-ul li{
    line-height: 28px;
    font-size: 14px;
    padding: 0 10px;
    color: #666;
}
.sort-ul li:hover,.dir-ul li:hover{
    background: #f2f2f2;
    color: #666!important;
}
.sortSelect,.dirSelect{
    background: #ff9a00;
    color: #fff!important;
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
    padding:10px;
    display: flex;
    align-items: center;
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
</style>
