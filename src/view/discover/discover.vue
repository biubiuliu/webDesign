<template>
    <div>
        <Content  class="discover">
                <div class="bg-div"></div>
                <img class="discover-img" src="../../../src/assets/bg.png" alt="丢失图片">
        </Content>
        <h1>{{msg}}</h1>
    </div>
</template>
<script>
export default {
    name: 'discover',
    data() {
        return {
            msg: '这是发现'
        }
    },
    
}
</script>
<style scoped>
    .bg-div{
        position: absolute;
        width: 100%;
        height: 400px;
        top: -60px;
        left: 0;
        opacity:0.6;
        background: black;
        z-index: 8;
    }
    .discover-img{
        width: 100%;
        height: 400px;
        margin-top: -60px;
        
    }
</style>
