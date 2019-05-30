<template>
    <div class="materialLib">
        <!-- <h1 style="color:red">{{msg}}</h1> -->
        <div class="tag">
            <div id="commonsId" class="commons_room active" @click="commonsRFun">
                公共库
            </div>
            <div id="privateId" class="private_room" @click="privateRFun">私人库</div>
        </div>
        <div v-if="isRoow">
            <div class="comm_body">
                <div class="materialBg_title">
                    <span>背景</span>
                    <span>全部 <i class="iconfont iconyou"></i> </span>
                </div>
                <ul class="reuseUl">
                    <li class="reuseLi" v-for="bgImg in backgroundImgArr" :key="bgImg.id">
                        <img :src="bgImg.src" alt="图片丢失">
                    </li>
                </ul>
            </div>
            <div class="comm_body">
                <div class="materialBg_title">
                    <span>素材</span>
                    <span>全部 <i class="iconfont iconyou"></i> </span>
                </div>
                <ul class="reuseUl">
                    <li class="reuseLi" v-for="bgImg in backgroundImgArr" :key="bgImg.id">
                        <img :src="bgImg.src" alt="图片丢失">
                    </li>
                </ul>
            </div>
            <div class="comm_body">
                <div class="materialBg_title">
                    <span>自定义商品</span>
                    <span>全部 <i class="iconfont iconyou"></i> </span>
                </div>
                <ul class="reuseUl">
                    <li class="reuseLi" v-for="bgImg in backgroundImgArr" :key="bgImg.id">
                        <img :src="bgImg.src" alt="图片丢失">
                    </li>
                </ul>
            </div>
        </div>
        <div v-else>
            <h1>私人库</h1>
        </div>
    </div>
</template>
<script>
export default {
    name: 'materialLib',
    data() {
        return {
            msg: '这是素材库',
            isRoow: true,
            backgroundImgArr:[
                {src:require('./images.jpg'),id:'1'},
                {src:require('./images.jpg'),id:'2'},
                {src:require('./images.jpg'),id:'3'},
                {src:require('./images.jpg'),id:'4'},
                {src:require('./images.jpg'),id:'5'},
                {src:require('./images.jpg'),id:'6'}
            ]
        }
    },
    methods: {
        // 判断有class是否存在
        hasClass(obj, cls) {  
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
        },
        // 添加class
        addClass(obj, cls) {  
            if (!this.hasClass(obj, cls)) obj.className += " " + cls;  
        }, 
        // 删除css
        removeClass(obj, cls) {  
            if (this.hasClass(obj, cls)) {  
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
                obj.className = obj.className.replace(reg, ' ');  
            }  
        },
        privateRFun(){  
            this.isRoow = false
            var commonsId = document.getElementById("commonsId")  
            let privateId = document.getElementById("privateId")
            this.addClass(privateId,"active");  
            this.removeClass(commonsId,"active");  
        },
        commonsRFun() {
            this.isRoow = true
            var commonsId = document.getElementById("commonsId")  
            let privateId = document.getElementById("privateId")
            this.removeClass(privateId,"active");  
            this.addClass(commonsId,"active"); 
    },

    },
    
}
</script>
<style scoped>
.materialLib{

}
.tag{
    width: 400px;
    height: auto;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    font-size: 16px;
    margin: 20px 0px;
    cursor: pointer;
}
.commons_room{
    width: 100px
}
.private_room{
    width: 100px
}
.active{
    color: #FF9A00;
    border-bottom: 1px solid #FF9A00;

}
.comm_body{
    padding: 20px 40px;
    width: 400px;
}
.materialBg_title{
    display: flex;
    justify-content: space-between;
}
.reuseUl{
    width: 100%;
    height: 200px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap
}
.reuseLi{
    list-style: none;
    flex: 1

}
.reuseLi>img{
    width: 100px;
    height: 100px;
}
</style>
