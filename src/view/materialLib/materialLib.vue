<template>
    <div class="materialLib">
        <!-- <h1 style="color:red">{{msg}}</h1> -->
        <div class="tag">
            <div id="commonsId" class="commons_room active" @click="commonsRFun">
                公共库
            </div>
            <div id="privateId" class="private_room" @click="privateRFun">私人库</div>
        </div>
        <div v-if="isRoow">
            <h1>公共库</h1>
        </div>
        <div v-else>
            <h1>私人库</h1>
        </div>
    </div>
</template>
<script>
export default {
    name: 'materialLib',
    data() {
        return {
            msg: '这是素材库',
            isRoow: true,
        }
    },
    methods: {
        commonsRFun() {
            this.isRoow = true
            //激活acitve 
            let commonsId = document.getElementById("commonsId").getAttribute("class");
            let newClass = commonsId.concat("  active");
            document.getElementById("commonsId").setAttribute("class",newClass);
            //删除acitve
            let privateId = document.getElementById("privateId").getAttribute("class");
            let oldClass = privateId.replace("active","");
            document.getElementById("privateId").setAttribute("class",oldClass);
        },
        privateRFun() {
            this.isRoow = false
            //激活acitve
            let privateId = document.getElementById("privateId").getAttribute("class");
            let newClass = privateId.concat("  active");
            document.getElementById("privateId").setAttribute("class",newClass);
            //删除acitve
            let commonsId = document.getElementById("commonsId").getAttribute("class");
            let oldClass = commonsId.replace("active","");
            document.getElementById("commonsId").setAttribute("class",oldClass);

        }
    },
    
}
</script>
<style scoped>
.materialLib{

}
.tag{
    width: 400px;
    height: auto;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    font-size: 16px;
    margin: 20px 0px;
    cursor: pointer;
}
.commons_room{
    width: 100px
}
.private_room{
    width: 100px
}
.active{
    color: #FF9A00;
    border-bottom: 1px solid #FF9A00;

}

</style>
