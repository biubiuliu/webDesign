<template>
    <div class="layout">
        <Layout >
            <nav-bar class="nvabar" :on='on'></nav-bar>
            <Content :style="{marginTop:'60px'}" class="Content">
                <router-view/>
            </Content>
        </Layout>
    </div>
</template>
<script>
import navBar from '@/components/commons/navBar/navBar'
import discover from '@/view/discover/discover'
import mydesign from '@/view/mydesign/mydesign'
import mycollect from '@/view/mycollect/mycollect'
import proDetail from '@/view/proDetail/proDetail'
export default {
name: 'home',
    components: {
        navBar,
        discover,
        mydesign,
        mycollect,
        proDetail
    },
    data(){
        return{
            aa: 'd',
            on: ''
        }
    },
    watch: {
        '$route' (to, from) {
            this.on = to.name
        }
    },
    created() {
        this.on =  this.$route.path.slice(6, this.$route.path.length);
    },
}
</script>
<style scope>
    .nvabar{
        z-index: 9;
    }
    .layout{
        /* border: 1px solid #d7dde4; */
        background: #f5f7f9; 
        position: relative;
        border-radius: 4px;
        /* overflow: hidden; */
        height: 100vh;
    }
    .discover{
        position: relative;
        top: 0;
        left: 0;
        z-index: 1;
    }
    .Content{
        overflow-x: hidden
    }

</style>

