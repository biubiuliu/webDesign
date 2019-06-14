<template>
    <div :style="{position: 'fixed', width: '100%', minWidth:'800px'}">
        <Menu mode="horizontal" theme="dark" id="dark" active-name="1">
            <div class="layout-logo">
                <img src="./logo.png" class="logo-img">
            </div>
            <div class="layout-nav">
                <MenuItem name="我的设计" to="/home/mydesign">
                    我的设计
                </MenuItem>
                <MenuItem name="发现"  to="/home/discover">
                    发现
                </MenuItem>
            
                <!-- <MenuItem name="我的收藏" to="/home/mycollect">
                    我的收藏 
                </MenuItem> -->
                <MenuItem name="6" class="layout-user">
                    <Button shape="circle" icon="ios-search"></Button>
                </MenuItem>
                <MenuItem name="创建设计"  @click.native="clearSchemeId" >
                    <Button type="warning" shape="circle">
                        <i  class="iconfont iconiconset0137"></i>
                        创建设计
                    </Button>  
                </MenuItem>
                <MenuItem name="用户名" v-if="username=='请登录'">
                    <a href="javascript:;" @click="toLogin" style="color:#fff">{{username}}</a>
                </MenuItem>
                <Submenu name="用户名" v-else>
                    <template slot="title">
                        {{username}}
                    </template>
                    <MenuItem name="logout">
                        <a href="javascript:;" @click="logout">退出登录</a>
                    </MenuItem>
                </Submenu>
            </div>
        </Menu>
    </div>
</template>
<script>
import { getStorage,delStorage,mobilePhoneMask } from '@/libs/util.js'
import { mapState,mapActions } from 'vuex'
export default {
    name: 'navBar',
    data(){
        return{
            username:''
        }
    },
    computed: {
        ...mapState({
            schemeId: state =>{
                return state.app.schemeId
            },
        })
    },
    created() {
       this.getUserName();
    },
    methods: {
        ...mapActions([
            'setSchemeId',
        ]),
        getUserName(){
            let userInfo = getStorage('userInfo');
            this.username = userInfo&&userInfo.mobile?mobilePhoneMask(userInfo.mobile):"请登录"
            if(!userInfo){
                this.$router.push({name:'login'})
            }
        },
        clearSchemeId(){
            this.$store.dispatch("setSchemeId", null)
            this.$router.push('/designHome/materialLib')
        },

        toLogin() {
            this.$router.push({name:'login'})
        },

        logout(){
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确定退出登录吗？</p>',
                onOk: () => {
                    delStorage('userInfo');
                    this.$router.push({name:'login'})
                },
            });
        }
    },
}
</script>
<style scope>
    .layout-logo{
        width: 100px;
        /* height: 30px;
        background: #5b6270; */
        margin-right: 50px;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 10px;
        left: 20px;
        
    }
    .layout-nav{
        margin-right: 50px;
        display: flex;
    }
    .layout-user{
        margin-left: auto;
    }
    .ivu-menu-item-selected{
        color:#f90!important
    }
    .ivu-menu-dark{
        background: #2e2f34
    }
    .logo-img{
        width: 100%
    }
</style>

