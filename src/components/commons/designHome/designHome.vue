<template>
    <div>
        <design-bar></design-bar>
        <h1>{{msg}}</h1>
    </div>
</template>
<script>
import designBar from '@/components/commons/designBar/designBar'
export default {
    name: 'designHome',
    components: {
      designBar,
    },
    data() {
        return {
            msg: '这是内容创建设计'
        }
    },
    
}
</script>
<style scoped>

</style>
