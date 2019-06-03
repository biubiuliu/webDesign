<template>
<div class="action_body">
    <div  class="actionBar">
        <Tooltip class="aliIcon" content="上移一层"><i class="iconfont iconshangyiyiceng"></i></Tooltip>
        <Tooltip class="aliIcon" content="下移一层"><i class="iconfont iconxiayiyiceng"></i></Tooltip>
        <Tooltip class="aliIcon" content="上移顶层"><i class="iconfont icondingceng"></i></Tooltip>
        <Tooltip class="aliIcon" content="下移底层"><i class="iconfont icondiceng"></i></Tooltip>
        <Tooltip class="aliIcon" content="水平翻转"><i class="iconfont iconjingxiang1"></i></Tooltip>
        <Tooltip class="aliIcon" content="垂直翻转"><i class="iconfont iconjingxiang2"></i></Tooltip>
        <Tooltip class="aliIcon" content="裁剪"><i class="iconfont iconjianqie"></i></Tooltip>
        <Tooltip class="aliIcon" content="复制图层"><i class="iconfont iconfuzhi"></i></Tooltip>
        <Tooltip class="aliIcon" content="旋转30°"><i @click="rotateObject" class="iconfont iconxuanzhuan"></i></Tooltip>
        <Tooltip class="aliIcon" content="锁定"><i @click="lockObject" class="iconfont iconsuoding1"></i></Tooltip>
        <Tooltip class="aliIcon" content="删除"><i @click="removeObject" class="iconfont iconshanchu"></i></Tooltip>

    </div>
</div>
    
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
export default {
    name: 'actionBar',
    data() {
        return {
            msg: '操作'
        }
    },
    computed: {
        ...mapGetters([
            'card',
            'selectedObj',
        ])
    },
    methods: {
        ...mapActions([
            'saveState',
        ]),
        // 90°旋转
        rotateObject() {
            this.selectedObj.rotate(this.selectedObj.angle === 360 ? 90 : this.selectedObj.angle + 90)
            // console.log('this.selectobj',this.selectedObj)
            this.card.renderAll()
            this.card.setWidth(200)
            this.saveState()
        },
        // 移除Object
        removeObject() {
            if (!this.selectedObj) return
            console.log(this.selectedObj);
            this.card.remove(this.selectedObj)
            this.card.renderAll()
            this.$store.dispatch('setSelectedObj', null)
        },
        lockObject() {
            if (!this.selectedObj) return
            // this.selectedObj.selectable=false
            this.card.renderAll()
            this.saveState()
            // this.$store.dispatch('setSelectedObj', null)
            console.log("锁定");
        }
    },
    
}
</script>
<style scoped>
*{
    -webkit-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
.aliIcon{
    text-align: center;
    margin-left: 20px;
}
.aliIcon i{
    font-size: 30px;
    z-index: -1;
    cursor: pointer;
}
.action_body{
    width: 100%;
    background: white;
}
.actionBar{
    text-align: center;
    width: 80%;
    height: 50px;
    line-height: 50px;
    background: white;
    margin-top: 60px;
    color: rgba(0, 0, 0, 0.561);
}
</style>
