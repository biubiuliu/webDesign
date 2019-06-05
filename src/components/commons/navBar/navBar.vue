<template>
    <div :style="{position: 'fixed', width: '100%', minWidth:'800px'}">
        <Menu mode="horizontal" theme="dark" id="dark" active-name="1">
            <div class="layout-logo"></div>
            <div class="layout-nav">
                <MenuItem name="我的设计" to="/home/mydesign">
                    我的设计
                </MenuItem>
                <MenuItem name="发现"  to="/home/discover">
                    发现
                </MenuItem>
            
                <MenuItem name="我的收藏" to="/home/mycollect">
                    我的收藏
                </MenuItem>
                <MenuItem name="6" class="layout-user">
                    <Button shape="circle" icon="ios-search"></Button>
                </MenuItem>
                <MenuItem name="创建设计"  to="/designHome/materialLib">
                    <Button type="warning" shape="circle">
                        <i  class="iconfont iconiconset0137"></i>
                        创建设计
                    </Button>  
                </MenuItem>
                <MenuItem name="用户名" >
                    用户名
                </MenuItem>
            </div>
        </Menu>
    </div>
</template>
<script>
export default {
    name: 'navBar',
    data(){
        return{
            aa: 'd'
        }
    },
    methods: {
    },
}
</script>
<style scope>
    .layout-logo{
        width: 100px;
        height: 30px;
        background: #5b6270;
        margin-right: 50px;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-nav{
        margin-right: 50px;
        display: flex;
    }
    .layout-user{
        margin-left: auto;
    }
</style>

