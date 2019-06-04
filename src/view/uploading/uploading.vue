<template>
    <div class="upload_body">
        <div class="upload_div">
            <Upload
                id="upload"
                class="uploading"
                multiple
                :show-upload-list="false"
                :before-upload="handleUpload"
                :on-success="handleSuccess"
                action="https://yy.mingdiao.com.cn/collocationServers/public/index.php/api/v1/upload/img">
                <Button  class="uploadingBtn" icon="ios-cloud-upload-outline">上传本地图片</Button>
            </Upload>
            <br/>
            <p>支持上传2M以下png/jpg格式的本地图片,可以选择多个文件。</p>
            <ul class="imgBox">
                <!-- @mouseleave="hideIcongengduo" -->
                <li class="imgLi" v-for="(img,index) in uploadSrcArr" :key="img.id"  @mouseenter ="showIcongengduo(img,index)" @mouseleave="hideIcongengduo" >
                    <img  :src="img.message" alt="图片丢失">
                    <div class="imgMore" :class="{moreChange:changehide==index}" >
                        
                        <div class="icon_more_box">
                                <Dropdown trigger="click">
                                    <i style="margin-left: 8px"  class="iconfont icongengduo"></i>
                                    <DropdownMenu slot="list">  
                                        <Dropdown placement="right-start" @click="moveCommon">
                                            <DropdownItem>
                                                <i class="iconfont iconjia1"></i>
                                                移动到素材库-公共
                                                <Icon type="ios-arrow-forward"></Icon>
                                            </DropdownItem>
                                            <DropdownMenu slot="list">
                                                <DropdownItem>背景</DropdownItem>
                                                <DropdownItem>素材</DropdownItem>
                                                <DropdownItem>自定义</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                        <Dropdown placement="right-start"  @click="movePrivate">
                                            <DropdownItem>
                                                <i class="iconfont iconjia1"></i>
                                                移动到素材库-个人
                                                <Icon type="ios-arrow-forward"></Icon>
                                            </DropdownItem>
                                            <DropdownMenu slot="list">
                                                <DropdownItem>背景</DropdownItem>
                                                <DropdownItem>素材</DropdownItem>
                                                <DropdownItem>自定义</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </DropdownMenu>
                                </Dropdown>
                        </div>
                    </div>
                </li>
            </ul>
            
        </div>
        
    </div>
</template>
<script>
import { customGoods } from '@/api/material.js'
export default {
    name: 'uploading',
    data() {
        return {
            msg: '这是上传',
            file: null,
            changehide:0,
            fileName:null,
            uploadSrcArr:[
                // {'message':'https://mdzs.oss-cn-shenzhen.aliyuncs.com/collocation/2019/06/04/a74ba52ac4093fdfbd9b0ca868a0f0ff956.jpg'},
                // {'message':'https://mdzs.oss-cn-shenzhen.aliyuncs.com/collocation/2019/06/04/a74ba52ac4093fdfbd9b0ca868a0f0ff956.jpg'}
            ],
            customGoodsDataobj:{
                goods_id:0,
                goods_img:null,
                is_personal:null,
            }
            
        }
    },
    created() {
        // this.handlecustomGoods()
    },
    methods: {
        // mouseenter:鼠标移入元素范围内触发，该事件不冒泡，即鼠标移到其后代元素上时不会触发。
        // mouseleave:鼠标移出元素范围时触发，该事件不冒泡，即鼠标移到其后代元素时不会触发。
        //showIcongengduo 显示更多
        showIcongengduo(img,index){
            this.changehide = index;
        },
        //hideIcongengduo 隐藏更多
        hideIcongengduo() {
            this.changehide = 0
        },
        handleUpload (file) {
            this.file = file;
            console.log(this)
        },
        handleSuccess(file) {
            this.uploadSrcArr.push(file);
            console.log("成功",this.uploadSrcArr)
        },
        //点击移入素材公共
        moveCommon(){
            this.customGoodsDataobj.goods_id = 1
        },
        //点击移入素材个人
        movePrivate(){
            this.customGoodsDataobj.goods_id = 0
        },
        //添加自定义商品图片
        handlecustomGoods (data) {
            customGoods(data).then(res => {
                console.log(res)
                
            }).catch(err => {
                console.log(err)
            })
        },

    },
    
}
</script>
<style scoped>

.upload_body{   
    margin-top: 60px
}
.upload_div{
    width: 400px;
    min-height: 100vh;
}
.uploadingBtn{
    width: 300px;
    background: #FF9B03;
    border:1px solid #FF9B03;
    color: rgba(255,255,255,.7);
}
.uploadingBtn:hover{
    color:white
}
.imgBox{
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content:left;
    
}
.imgBox::-webkit-scrollbar {
    display: none;
}
.imgLi{
    list-style: none;
    margin-top: 10px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
}
.imgLi>img{
    width: 80%;
    height: 200px;
}
.imgMore{
    display: none;
    position: absolute;
    width: 30px;
    height: 15px;
    line-height: 15px;
    z-index: 999;
    top: 10px;
    right: 50px;
    border-radius: 10px;
    background: #FF9B03;
    text-align: center;
    color: white;
    

}
.moreChange{
    display: block;
}
a{
    color: white
}
.div::-webkit-scrollbar { width: 0 !important }
.icon_more_box{
    position: fixed;
    text-align: center;
    z-index: 1;
}
</style>
