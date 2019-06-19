<template>
    <div class="upload_body">
        <div class="upload_div">
            <div class="upload_btn_box">
                <Upload
                    id="upload"
                    class="uploading"
                    multiple
                    :format="['jpg','jpeg','png']"
                    :show-upload-list="true"
                    :before-upload="handleUpload"
                    :on-success="handleSuccess"
                    :max-size="20480"
                    action="https://yy.mingdiao.com.cn/collocationServers/public/index.php/api/v1/upload/img"
                    :headers="headers">
                    <Button  class="uploadingBtn" icon="ios-cloud-upload-outline">上传本地图片</Button>
                </Upload>
                <br/>
                <p>支持上传20M以下png/jpg格式的本地图片,可以选择多个文件。</p>
            </div>
            <ul class="imgBox">
                <!-- @mouseleave="hideIcongengduo" -->
                <li class="imgLi" v-for="(img,index) in uploadSrcArr" :key="img.id"  
                    @mouseenter ="showIcongengduo(img,index)" @mouseleave="hideIcongengduo">
                    <img  :src="img" alt="图片丢失">
                    <div class="imgMore" :class="{moreChange:changehide==index}" >                       
                        <div class="icon_more_box">
                            <Dropdown trigger="click">
                                <i style="margin-left:7px" class="iconfont icongengduo"></i>
                                <DropdownMenu slot="list">  
                                    <Dropdown placement="right-start" @on-click="moveToMaterial">
                                        <DropdownItem>
                                            <Icon type="ios-people" size='20' color='#666'/>
                                            移动到素材库-公共
                                            <Icon type="ios-arrow-forward"></Icon>
                                        </DropdownItem>
                                        <DropdownMenu slot="list">
                                            <DropdownItem name="background">背景</DropdownItem>
                                            <DropdownItem name="material">素材</DropdownItem>
                                            <DropdownItem name="custom">自定义商品</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    <Dropdown placement="right-start"  @on-click="moveToMaterial">
                                        <DropdownItem>
                                            <Icon type="md-person" size='16' color='#666'/>
                                            移动到素材库-个人
                                            <Icon type="ios-arrow-forward"></Icon>
                                        </DropdownItem>
                                        <DropdownMenu slot="list">
                                            <DropdownItem name="background-personal">背景</DropdownItem>
                                            <DropdownItem name="material-personal">素材</DropdownItem>
                                            <DropdownItem name="custom-personal">自定义商品</DropdownItem>
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
import { customGoods,backgroundImg,addMaterial } from '@/api/material.js'
import { getStorage } from '@/libs/util.js'
import md5 from 'js-md5';

export default {
    name: 'uploading',
    data() {
        return {
            msg: '这是上传',
            file: null,
            changehide:0,
            uploadSrcArr:[],
            headers:{

            }
        }
    },
    created() {
        const login_server = '4NR01nHbPT9FTXrFUM1Y3BE1';
        const timestamp = new Date().getTime() / 1000;
        const userInfo = getStorage('userInfo')
        const sessionKey = userInfo&&userInfo.sessionKey?userInfo.sessionKey:'';
        const randNumber =  Math.random();
        if(userInfo){
            this.headers = {
                sessionKey:sessionKey,
                randNumber: randNumber,
                timestamp : timestamp,
                sign : md5(login_server+sessionKey+timestamp+randNumber)
            }
        }    
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
        },

        handleSuccess(file) {
            this.uploadSrcArr.push(file.message);
        },

        // 点击移入素材
        moveToMaterial(name){
            var img = this.uploadSrcArr[this.changehide];
            switch (name) {
                case 'background':
                    this.addBackgroundImg(0,img);
                    break;

                case 'material':
                    this.addMaterialImg(0,img);
                    break;  

                case 'custom':
                    this.$router.push({  
                        path: 'goodsLib',     
                        params: { 
                            is_personal:0,  
                            url: img,                             
                        }            
                    })  
                    break; 

                case 'background-personal':
                    this.addBackgroundImg(1,img);
                    break;

                case 'material-personal':
                    this.addMaterialImg(1,img);
                    break;  

                case 'custom-personal':
                    this.$router.push({  
                        path: 'goodsLib',     
                        params: {  
                            is_personal:1,  
                            url: img,                            
                        }            
                    })  
                    break;  

                default:
                    break;
            }          
        },

        // 添加背景图片
        addBackgroundImg(is_personal,img_url){
            let data = {
                img_url:img_url,
                is_personal:is_personal
            }

            backgroundImg(data).then(res => {
                if(res.data.success){
                        this.$Message.success('移动成功')
                        var index =  this.uploadSrcArr.indexOf(img_url);
                        this.uploadSrcArr.splice(index, 1);
                }else{
                    this.$Message.error(res.data.message);
                }
            })
        },

        // 添加素材
        addMaterialImg(is_personal,img_url){       
            let data = {
                material_img:img_url,
                is_personal:is_personal,
            }

            addMaterial(data).then(res => {
                if(res.data.success){
                    this.$Message.success('移动成功')
                    var index =  this.uploadSrcArr.indexOf(img_url);
                    this.uploadSrcArr.splice(index, 1);
                }else{
                    this.$Message.error(res.data.message);
                }
            })
        },
    }, 
}
</script>
<style scoped>

.upload_body{ 
    padding-top: 60px;
    height: 93%;
    transform:translateZ(0); 
    -webkit-transform:translateZ(0);
}
.upload_div{
    width: 400px;
}
.upload_btn_box{
    /* position: fixed; */
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
    /* padding-top: 70px; */
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
    top: 15px;
    left: 75px;
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
    z-index:1;
}


</style>
