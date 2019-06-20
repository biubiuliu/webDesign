<template>
    <div class="upload_body">
        <div class="upload_div">
            <div class="upload_btn_box">
                <Upload
                    id="upload"
                    class="uploading"
                    multiple
                    ref="upload"
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
                <p>支持上传2M以下png/jpg格式的本地图片,可以选择多个文件。</p>
            </div>
            <!-- :class="{moreChange:changehide==index}" -->
            <!-- <div class="imgMore">     -->                   
                <div class="icon_more_box">
                    <Dropdown trigger="click">
                        <Button class="icon_moreBtn" type="warning" @click ="moveFun">移动</Button>
                        <DropdownMenu slot="list">  
                            <Dropdown placement="bottom-end" @on-click="moveToMaterial">
                                <DropdownItem>
                                    <Icon type="ios-people" size='16' color='#666'/>
                                    移动到素材库-公共
                                    <Icon type="ios-arrow-forward"></Icon>
                                </DropdownItem>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="background">背景</DropdownItem>
                                    <DropdownItem name="material1">素材_图形</DropdownItem>
                                    <DropdownItem name="material2">素材_色卡</DropdownItem>
                                    <DropdownItem name="material3">素材_灯光</DropdownItem>
                                    <DropdownItem name="material4">素材_阴影</DropdownItem>
                                    <DropdownItem name="material5">素材_透视</DropdownItem>
                                    <DropdownItem name="custom">自定义商品</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown placement="bottom-end"  @on-click="moveToMaterial">
                                <DropdownItem>
                                    <Icon type="md-person" size='16' color='#666'/>
                                    移动到素材库-个人
                                    <Icon type="ios-arrow-forward"></Icon>
                                </DropdownItem>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="background-personal">背景</DropdownItem>
                                    <DropdownItem name="material-personal1">素材_图形</DropdownItem>
                                    <DropdownItem name="material-personal2">素材_色卡</DropdownItem>
                                    <DropdownItem name="material-personal3">素材_灯光</DropdownItem>
                                    <DropdownItem name="material-personal4">素材_阴影</DropdownItem>
                                    <DropdownItem name="material-personal5">素材_透视</DropdownItem>
                                    <DropdownItem name="custom-personal">自定义商品</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </DropdownMenu>
                    </Dropdown>
               </div>
            <!-- </div>  -->
            <ul class="imgBox">
                <li class="imgLi" v-for="(img,index) in uploadSrcArr" :key="img.id"  
                    @mouseenter ="showIcongengduo(img,index)" @mouseleave="hideIcongengduo">
                    <img  :src="img" alt="图片丢失">

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
            headers:{},
            background_Obj:{
                background_json:null
            },
            background_json:{
                is_personal: null,
                img_list:[]
            },
            material_Obj:{
                material_json:null
            },
            material_json:{
                material_type:null,
                is_personal: null,
                img_list:[]
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
    updated() {
        
    },
    methods: {
        // mouseenter:鼠标移入元素范围内触发，该事件不冒泡，即鼠标移到其后代元素上时不会触发。
        // mouseleave:鼠标移出元素范围时触发，该事件不冒泡，即鼠标移到其后代元素时不会触发。
        //showIcongengduo 显示更多
        showIcongengduo(img,index){
            this.changehide = index;
            
        },
        moveFun(){
            console.log("显示更多", this.uploadSrcArr)
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
            console.log(file)
        },
        //switch 公共方法
        materialCommonSwitchFun(){
            this.material_json.is_personal = 0;
            this.material_json.img_list = this.uploadSrcArr;
            this.material_Obj.material_json =JSON.stringify(this.material_json )
        },
        //switch 私人方法
        materialpersonalSwitchFun(){
            this.material_json.is_personal = 1;
            this.material_json.img_list = this.uploadSrcArr;
            this.material_Obj.material_json =JSON.stringify(this.material_json )
        },
        // 点击移入素材
        moveToMaterial(name){
            var img = this.uploadSrcArr[this.changehide];
            console.log("点击移入素材",name)
            switch (name) {
                case 'background':
                    this.background_json.is_personal = 0;
                    this.background_json.img_list = this.uploadSrcArr;
                    this.background_Obj.background_json =JSON.stringify(this.background_json )
                    this.addBackgroundImg(this.background_Obj);
                    break;

                case 'material1':
                    this.material_json.material_type = 1;
                    this.materialCommonSwitchFun()
                    this.addMaterialImg(this.material_Obj);
                    break;  
                case 'material2':
                    this.material_json.material_type = 2;
                    this.materialCommonSwitchFun()
                    this.addMaterialImg(this.material_Obj);
                    break;  
                case 'material3':
                    this.material_json.material_type = 3;
                    this.materialCommonSwitchFun()
                    this.addMaterialImg(this.material_Obj);
                    break;  
                case 'material4':
                    this.material_json.material_type = 4;
                    this.materialCommonSwitchFun()
                    this.addMaterialImg(this.material_Obj);
                    break;  
                case 'material5':
                    this.material_json.material_type = 5;
                    this.materialCommonSwitchFun()
                    this.addMaterialImg(this.material_Obj);
                    break;  

                case 'custom':
                    this.$router.push({  
                        path: 'goodsLib',     
                        query: { 
                            is_personal:0,  
                            imgarr: this.uploadSrcArr,                             
                        }            
                    })  
                    break; 

                case 'background-personal':
                    this.background_json.is_personal = 1;
                    this.background_json.img_list = this.uploadSrcArr;
                    this.background_Obj.background_json =JSON.stringify(this.background_json )
                    this.addBackgroundImg(this.background_Obj);
                    break;

                case 'material-personal1':
                    this.material_json.material_type = 1;
                    this.materialpersonalSwitchFun()
                    this.addMaterialImg(this.material_Obj);
                    break;  
                case 'material-personal2':
                    this.material_json.material_type = 2;
                    this.materialpersonalSwitchFun()
                    this.addMaterialImg(this.material_Obj);
                    break;  
                case 'material-personal3':
                    this.material_json.material_type = 3;
                    this.materialpersonalSwitchFun()
                    this.addMaterialImg(this.material_Obj);
                    break;  
                case 'material-personal4':
                    this.material_json.material_type = 4;
                    this.materialpersonalSwitchFun()
                    this.addMaterialImg(this.material_Obj);
                    break;  
                case 'material-personal5':
                    this.material_json.material_type = 5;
                    this.materialpersonalSwitchFun()
                    this.addMaterialImg(this.material_Obj);
                    break;  

                case 'custom-personal':
                    this.$router.push({  
                        path: 'goodsLib',     
                        query: {  
                            is_personal:1,  
                            imgarr: this.uploadSrcArr,                            
                        }            
                    })  
                    break;  

                default:
                    break;
            }          
        },
        // 添加背景图片
        addBackgroundImg(background_Obj){
            backgroundImg(background_Obj).then(res => {
                if(res.data.success){
                    this.$Message.success('移动成功')
                    this.uploadSrcArr = []
                }else{
                    this.$Message.error(res.data.message);
                }
            })
        },

        // 添加素材
        addMaterialImg(material_Obj){       
            addMaterial(material_Obj).then(res => {
                if(res.data.success){
                    this.$Message.success('移动成功')
                    this.uploadSrcArr = []
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
    text-align: center;
    color: white;
}
.icon_moreBtn{
    margin-left: 0px
}
.moreChange{
    display: block;
}
a{
    color: white
}
.div::-webkit-scrollbar { width: 0 !important }
.icon_more_box{
    width: 50%;
    text-align: center;
    z-index:1;
}
.icon_more_box /deep/ .ivu-select-dropdown{
    width: 50% !important;

}


</style>
