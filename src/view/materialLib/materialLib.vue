<template>
    <div class="materialLib">
        <!-- <h1 style="color:red">{{msg}}</h1> -->
        <div class="tag">
            <Tabs value="name1" class="Tabs">
                <TabPane label="公共库" name="name1">公共库1</TabPane>
                <TabPane label="私人库" name="name2">私人库2</TabPane>
            </Tabs>
        </div>
    </div>
</template>
<script>
export default {
    name: 'materialLib',
    data() {
        return {
            msg: '这是素材库'
        }
    },
    
}
</script>
<style scoped>
.materialLib{

}
.tag{
    width: 400px;
   text-align: center;
    height: auto;
}

.Tabs {
    display: inline-block
}

</style>
