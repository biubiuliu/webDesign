<template>
    <div class="login_body">
        <div class="bgImg_div">
            <!-- <img src="./loginBg.jpg" alt=""> -->
            <div class="login_product">
                <div class="login_list">
                    <div class="login_text">
                       <h1>专业版新功能上线,即刻开启创作设计</h1> 
                       <ul>
                            <li>查看1000+高佣金品牌</li>
                            <li>享受最低3.2这采购特权</li>
                            <li>画布编辑与模板功能</li>
                            <li>无限再创作功能</li>
                            <li>无限拼图容量</li>
                            <li>无限项目容量</li>
                            <li>自动抠图功能</li>
                            <li>普通图片下载</li>
                            <li>高清大图下载</li>
                            <li>导出图文PDF</li>
                            <li>我的单品智能筛选</li>
                        </ul>
                    </div>
                    
                </div>
                <div class="login_input_box"> 
                    <div class="input_title">
                        <img class="login_log" src="./bg.jpg" alt="">
                        <div>欢迎登入</div>
                    </div>
                    <hr/>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
export default {
    name: 'login',
    data() {
        return {
            msg: '登入'
        }
    },
    
}
</script>
<style scoped>
.login_body{
    color: black;
    height:100%;

    width:100%;
    overflow: hidden;
    background-image: url(./bg.jpg);
    background-size:cover
}
.bgImg_div{
    width: 100%;
    min-width: 1920px;
    height: 100vh;
    overflow: hidden;
    position: relative;
}
.bgImg_div>img{
    width: 100%;
    height: 100%;
    
}
.login_product{
    position: absolute;
    /* top: calc(100%-25%); */
    top: 20%;
    left: 40%;
    width: 50%;
    min-width: 800px;
    height: 70%;
}
.login_list{
    width: 80%;
    height: 100%;
    color: white;
    border-radius: 2%;
    background: pink;
    background: linear-gradient(135deg, #3A9B90, #6FAF99, #ADC7A4)
}
.login_input_box{
    top:5%;
    right: 0;
    width: 40%;
    height: 90%;
    box-shadow: -10px 0 10px #6FAF99;
    border-radius: 2%;
    background: white;
    position: absolute;
}
h1{
    padding: 5%;
    border-bottom: 1px solid whitesmoke;
}
hr{
      border-bottom: 1px solid whitesmoke;
}
ul{
    padding: 5%;
}
ul>li{
    margin-top: 10px;
    font-size: 16px;
    list-style: disc;
}
.login_text{
    text-align: left;
    margin-left:5%;
    

}
.input_title{
    display: flex;
    justify-content: space-around;
    height: 30px;
    line-height: 30px;
}
.login_log{
    width: 90px;
    height: 30px;
}

</style>
