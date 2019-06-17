<template>
    <div class="leftBar">
        <ul class="leftBar_box">
            <li>
                <router-link to="/designHome/materialLib" tag="div">
                    <i  class="iconfont iconsucaiku"></i>
                    素材库
                </router-link>
            </li>
            <li>
                <router-link to="/designHome/goodsLib" tag="div">
                    <i  class="iconfont iconshangpin"></i>
                    商品库
                </router-link>
            </li>
            <li>
                <router-link to="/designHome/favorite" tag="div">
                        <i  class="iconfont iconshoucang1"></i>
                        收藏
                </router-link>
            </li>
            <li>
                <router-link to="/designHome/uploading" tag="div">
                        <i  class="iconfont iconupload"></i>
                        上传
                </router-link>
            </li>
            <li class="leftBar_bottom">快捷键</li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'leftBar',
    data() {
        return {
            msg: '这是内容侧边导航'
        }
    },
    
}
</script>
<style scoped>
    .leftBar{
        position: fixed;
        z-index: 9;
        top: 60px;
        width: 60px;
        height: 100%;;
        background:  #515A6E;
        font-size: 14px;
    }

    .leftBar_box{
        display: block;
        margin: 50px 0;
        cursor: pointer;
        height: 100%;
        /* display: flex; */
        flex-direction: column;
        font-size: 14px;
        color:rgba(255,255,255,.7)
    }
    .leftBar_box>li{
        list-style: none;
        margin-top: 50px;
    }
    .leftBar_box>li>div{
        display: flex;
        flex-direction: column;
       

    }
    .leftBar_box>li:hover{
        color: white;
    }
    .leftBar_bottom{
        margin-bottom: auto;
    }
</style>
