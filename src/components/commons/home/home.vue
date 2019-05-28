<template>
    <div class="layout">
        <Layout >
            <nav-bar class="nvabar"></nav-bar>
            
            <Content :style="{marginTop:'60px', background: '#ccc', minHeight: '769px',minWidth:'800px'}" class="Content">
                <router-view/>
            </Content>
            <Footer class="layout-footer-center">2019-5-27 &copy; biubiuliu</Footer>
        </Layout>
    </div>
</template>
<script>
import navBar from '@/components/commons/navBar/navBar'
import discover from '@/view/discover/discover'
import mydesign from '@/view/mydesign/mydesign'
import mycollect from '@/view/mycollect/mycollect'
export default {
    name: 'home',
    components: {
      navBar,
      discover,
      mydesign,
      mycollect
    },
    data(){
       return{
           aa: 'd'
       }
    }
}
</script>
<style scope>
    .nvabar{
        z-index: 9;
    }
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        
    }
    .layout-footer-center{
        min-width: 800px;
        text-align: center;
    }
    .discover{
        position: relative;
        top: 0;
        left: 0;
        z-index: 1;
    }

</style>

