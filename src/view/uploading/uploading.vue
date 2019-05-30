<template>
    <div class="upload_body">
        <div class="upload_div">
            <Upload
                id="upload"
                class="uploading"
                multiple
                action="//jsonplaceholder.typicode.com/posts/">
                <Button  class="uploadingBtn" icon="ios-cloud-upload-outline">上传本地图片</Button>
            </Upload>
            <p>支持上传2M以下png/jpg格式的本地图片,可以选择多个文件。</p>
            <ul class="imgBox">
                <!-- @mouseleave="hideIcongengduo" -->
                <li class="imgLi" v-for="img in uploadSrcArr" :key="img.id"  @mouseenter = "showIcongengduo" @mouseleave="hideIcongengduo" >
                    <img  :src="img.src" alt="图片丢失">
                    <div class="imgMore" v-if="isShowMore">
                        <Dropdown trigger="click">
                            <a href="javascript:void(0)">
                                <i  class="iconfont icongengduo"></i>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem>驴打滚</DropdownItem>
                                <Dropdown placement="right-start">
                                    <DropdownItem>
                                        北京烤鸭
                                        <Icon type="ios-arrow-forward"></Icon>
                                    </DropdownItem>
                                    <DropdownMenu slot="list">
                                        <DropdownItem>挂炉烤鸭</DropdownItem>
                                        <DropdownItem>焖炉烤鸭</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </li>
            </ul>
            
        </div>
        
    </div>
</template>
<script>
export default {
    name: 'uploading',
    data() {
        return {
            msg: '这是上传',
            isShowMore: false,
            uploadSrcArr:[
                {src:require('./images.jpg'),id:'001'},
                {src:require('./images.jpg'),id:'002'},
                {src:require('./images.jpg'),id:'003'},
                {src:require('./images.jpg'),id:'004'},
                {src:require('./images.jpg'),id:'005'},
                {src:require('./images.jpg'),id:'006'},
                {src:require('./images.jpg'),id:'007'},
            ]
        }
    },
    created() {

    },
    methods: {
        // mouseenter:鼠标移入元素范围内触发，该事件不冒泡，即鼠标移到其后代元素上时不会触发。
        // mouseleave:鼠标移出元素范围时触发，该事件不冒泡，即鼠标移到其后代元素时不会触发。
        //showIcongengduo 显示更多
        showIcongengduo(){
            this.isShowMore = true;
        },
        //hideIcongengduo 隐藏更多
        hideIcongengduo() {
             this.isShowMore = false;
        }
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
}
.imgLi>img{
    width: 80%;
    height: 200px;
}
.imgMore{
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
a{
    color: white
}
.div::-webkit-scrollbar { width: 0 !important }
</style>
