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
                <li class="imgLi">
                    <img src="./images.jpg" alt="">
                </li>
                <li class="imgLi">
                    <img src="./images.jpg" alt="">
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
            msg: '这是上传'
        }
    },
    created() {

    },
    methods: {

    },
    
}
</script>
<style scoped>
.upload_body{   
    margin-top: 60px
}
.upload_div{
    width: 400px;
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
    justify-content:left
    
}
.imgLi{
    list-style: none;
    margin-top: 10px;
}
.imgLi>img{
    width: 80%;
    height: 200px;
}
</style>
