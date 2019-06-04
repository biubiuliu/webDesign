<template>
    <div>
        <h1>{{msg}}</h1>
    </div>
</template>
<script>
export default {
    name: 'templete',
    // 定义变量 
    data() {
        return {
            msg: '这是内容'
        }
    },
    // 参考链接 vue 生命周期
    // https://juejin.im/entry/5aee8fbb518825671952308c
    //Vue组件实例刚被创建
    beforeCreate() {},
    //Vue组件实例创建完成,但是DOM还没有生成
    created() {},
    //模板编译之前/挂载之前
    beforeMount() {},
    //模板编译完成/挂载完成
    mounted() {},
    //当vue发现data中的数据发生了改变，会触发对应组件的重新渲染，先后调用beforeUpdate和updated钩子函数
    beforeUpdate() {},
    // 钩子函数在实例销毁之前调用。在这一步，实例仍然完全可用。
    updated() {},
    beforeDestroy() {},
    //Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。
    destroyed() {},
    //事件,方法 处理
    methods: {},
}
</script>
<style scoped>

</style>
