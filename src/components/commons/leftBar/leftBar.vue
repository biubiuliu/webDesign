<template>
    <div class="leftBar">
        <ul class="leftBar_box">
            <li v-for="(item, index) in nav" :key="index" @click="routerLink(index, item.path)" :class=" navIndex === index ? 'router_active' : ''" >
                <router-link :to="item.path" tag="div">
                    <i  :class="item.icon"></i>
                    {{item.title}}
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
            msg: '这是内容侧边导航',
            nav: [
                    {title: '素材库', icon: 'iconfont iconsucaiku', path: '/designHome/materialLib'},
                    {title: '商品库', icon: 'iconfont iconshangpin', path: '/designHome/goodsLib'},
                    {title: '收藏', icon: 'iconfont iconshoucang1', path: '/designHome/favorite'},
                    {title: '上传', icon: 'iconfont iconcaozuo-shangchuan-upload', path: '/designHome/uploading'},
                ],
            navIndex: 0,
        }
    },
    watch: {
        "$route"() {
            // 获取当前路径
            let path = this.$route.path;
            // 检索当前路径
            this.checkRouterLocal(path);
        }
    },
    methods: {
    /**
     * 路由跳转
     * @param index
     * @param link
    */
        routerLink(index, path) {
            // 点击哪个路由就赋值给自定义的下下标
            this.navIndex = index;
            // 路由跳转
            this.$router.push(path)
        },

    /**
     * 检索当前路径
     * @param path
    */
        checkRouterLocal(path) {
        // 查找当前路由下标高亮
            this.navIndex = this.nav.findIndex(item => item.path === path);
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
        background:  #33373c;
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
    .leftBar_bottom{
        margin-bottom: auto;
    }
    .router_active{
        color: #f90;

    }
</style>
