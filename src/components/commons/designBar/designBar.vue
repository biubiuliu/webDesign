<template>
    <div :style="{position: 'fixed', width: '100%', minWidth:'800px'}">
        <Menu mode="horizontal" theme="dark" id="dark" active-name="1">
            <div class="layout-nav">
                <MenuItem name="首页"  to="/home/discover">
                    <Icon type="ios-navigate"></Icon>
                    首页
                </MenuItem>
                <MenuItem name="画布尺寸">
                    画布尺寸
                </MenuItem>
            
                <MenuItem name="我的收藏">
                    保存方案
                </MenuItem>
                <MenuItem name="撤销" class="layout-user">
                    <Icon type="ios-navigate"></Icon>
                    撤销 
                </MenuItem>
                <MenuItem name="重置" >
                    <Icon type="ios-navigate"></Icon>
                    重置
                </MenuItem>
                <MenuItem name="导出清单" class="layout-user">
                    <Icon type="ios-navigate"></Icon>
                    导出清单 
                </MenuItem>
            </div>
        </Menu>
    </div>
</template>
<script>
export default {
    name: 'designBar',
    data() {
        return {
            msg: '这是我的设计bar'
        }
    },
    
}
</script>
<style scoped>
    .layout-user{
        margin-left: auto;
    }
</style>
