<template>
<div class="action_body">
    <div  class="actionBar">
        <div  v-if="this.selectedObj">
            <Tooltip class="aliIcon" content="上移一层"><i @click="frontObject" class="iconfont iconshangyiyiceng"></i></Tooltip>
            <Tooltip class="aliIcon" content="下移一层"><i @click="behindObject" class="iconfont iconxiayiyiceng"></i></Tooltip>
            <Tooltip class="aliIcon" content="上移顶层"><i @click="frontObjectTop" class="iconfont icondingceng"></i></Tooltip>
            <Tooltip class="aliIcon" content="下移底层"><i @click="behindObjectBottom" class="iconfont icondiceng"></i></Tooltip>
            <Tooltip class="aliIcon" content="水平翻转"><i @click="flipXObject" class="iconfont iconjingxiang1"></i></Tooltip>
            <Tooltip class="aliIcon" content="垂直翻转"><i @click="flipYObject" class="iconfont iconjingxiang2"></i></Tooltip>
            <Tooltip class="aliIcon" content="等比例缩放"><i @click="zoomObject" class="iconfont iconsuofang1"></i></Tooltip>
            <Tooltip class="aliIcon" content="裁剪"><i @click="cutObject" class="iconfont iconjianqie"></i></Tooltip>
            <Tooltip class="aliIcon" content="变形"><i @click="skewControl" class="iconfont iconbianxing"></i></Tooltip>
            <Tooltip class="aliIcon" content="复制图层"><i @click="copy" class="iconfont iconfuzhi"></i></Tooltip>
            <Tooltip class="aliIcon" content="旋转30°"><i @click="rotateObject" class="iconfont iconxuanzhuan"></i></Tooltip>
            <Tooltip class="aliIcon" content="锁定" v-if="isLocking"><i @click="lockObject" class="iconfont iconsuoding1"></i></Tooltip>
            <Tooltip class="aliIcon" content="取消锁定" v-else><i @click="cancellockObject" class="iconfont iconjiesuo1"></i></Tooltip>
            <Tooltip class="aliIcon" content="删除"><i @click="removeObject" class="iconfont iconshanchu"></i></Tooltip>
            <!-- <canvas style="visibility: hidden;" id="canvas_crop"></canvas> -->
        </div>
        
    </div>
    <Modal
        v-model="skewModel"
        title="偏移"
        draggable
        width="300"
        :closable="false"
        slot="footer">
        <Slider v-model="skewXModelValue" input-size='small' @on-change="skewXControl" @on-input="skewXControl" :min='-100' :max='200' show-input></Slider>
        <Slider v-model="skewYModelValue" input-size='small' @on-change="skewYControl" @on-input="skewYControl" :min='-100' :max='200' show-input></Slider>
        <div slot="footer">
            <Button type="primary" @click="skewModelOk">确定</Button>
        </div>
    </Modal>
</div>
    
</template>
<script>
import {mapState, mapGetters, mapActions} from 'vuex'
export default {
    name: 'actionBar',
    data() {
        return {
            msg: '操作',
            isLock:true,
            skewXModelValue: 0,
            skewYModelValue: 0,
            skewModel:false,
            test:null,
        }
    },
    created() {
        console.log("0.0",this.selectedObj)
    },
    updated() {
        if(this.selectedObj == null){
            this.skewModel = false;
            return
        }
        this.skewXModelValue = this.selectedObj.skewX,
        this.skewYModelValue = this.selectedObj.skewY
    },
    computed: {
        ...mapState({
            isLocking: state =>{
            return state.app.isLocking
            },
            objJSON: state =>{
                return state.app.objJSON
            },
        }),
        ...mapGetters([
            'card',
            'selectedObj',
        ])
    },
    methods: {
        ...mapActions([
            'saveState',
        ]),
        //导出json格式
        // toJson(){
        //     console.log(JSON.stringify(this.card.toJSON()));
        // },
        // 上移一层
        frontObject() {
            this.selectedObj.bringForward()
            this.saveState()
        },
        // 下移一层
        behindObject() {
            this.selectedObj.sendBackwards()
            this.saveState()
        },
         // 上移顶层
        frontObjectTop() {
            this.selectedObj.bringToFront()
            this.saveState()
        },
        // 下移底层
        behindObjectBottom() {
            this.selectedObj.sendToBack()
            this.saveState()
        },
        // 水平翻转
        flipXObject() {
            this.selectedObj.set({
                scaleX: -this.selectedObj.scaleX,
            })
            this.card.renderAll()
            this.saveState()
        },
        // 垂直翻转
        flipYObject() {
            this.selectedObj.set({
                scaleY: -this.selectedObj.scaleY,
            })
            this.card.renderAll()
            this.saveState()
        },
        //裁剪
        cutObject(){
            // this.selectedObj
             //生成一个和待裁剪元素相同大小的矩形用于框选裁剪区域
            console.log("nidaye")
        },
        //变形
        skewControl (){
            if(this.selectedObj == null){
                this.skewModel = false;
                return
            }
            this.skewModel = true
            // this.card.requestRenderAll();
            console.log("selectedObj",this.selectedObj)
        },
        //变形modal
        skewModelOk(){
            this.skewXControl();
            this.skewYControl();
            this.skewModel = false;
        },
        skewModelCancel(){
            
        },
        skewXControl(){
            this.selectedObj.set({
                skewX: this.skewXModelValue
            })
            this.card.renderAll()
            this.saveState()
        },
        skewYControl(){
            this.selectedObj.set({
                skewY: this.skewYModelValue
            })
            this.saveState()
            this.card.renderAll()
        },

        // 90°旋转
        rotateObject() {
            this.selectedObj.rotate(this.selectedObj.angle === 360 ? 90 : this.selectedObj.angle + 90)
            // console.log('this.selectobj',this.selectedObj)
            this.card.renderAll()
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
        //等比例缩放
        zoomObject() {
            if(this.selectedObj.scaleX < 0.02 || this.selectedObj.scaleY < 0.03){
                this.$Message.error({
                    content: '图片已到最小,自动删除,如需要,请重新添加',
                    duration: 10,
                    closable: true
                });
                this.removeObject()
                return;
            }
            this.selectedObj.scaleX -= 50/this.selectedObj.width, 
            this.selectedObj.scaleY -= 50/this.selectedObj.height
            this.card.renderAll()
            this.saveState()
        },
        //锁定
        lockObject() {
            if (!this.selectedObj) return
            this.selectedObj.hasControls = false;
            this.selectedObj.lockScalingX = this.card.item(0).lockScalingY = true;
            this.selectedObj.lockMovementX = true;
            this.selectedObj.lockMovementY = true;
            this.card.renderAll()
            this.saveState()
            this.$store.state.app.isLocking = this.selectedObj.hasControls
            console.log("锁定",this.selectedObj);
        },
        //取消锁定
        cancellockObject() {
            if (!this.selectedObj) return
            this.selectedObj.hasControls = true;
            this.selectedObj.lockScalingX = this.selectedObj.lockScalingY = false;
            this.selectedObj.lockMovementX = false;
            this.selectedObj.lockMovementY = false;
            this.$store.state.app.isLocking = this.selectedObj.hasControls
            this.card.renderAll()
            this.saveState()
            // this.$store.dispatch('setSelectedObj', null)
            console.log("取消锁定",this.selectedObj);
        },
        //复制粘贴
        paste(_clipboard){
            // clone again, so you can do multiple copies.
            let card = this.card;
            
            _clipboard.clone((clonedObj) => {
                console.log("clonedObj",clonedObj)
                console.log("this.selectedObj",this.selectedObj)
                var  imgType_s = this.selectedObj.imgType
                var  goods_id_s = this.selectedObj.goods_id
                var  goodsImg_id_s = this.selectedObj.goodsImg_id
                var  material_id_s = this.selectedObj.material_id
                card.discardActiveObject();
                clonedObj.set({
                    borderColor: '#f90',
                    cornerColor: '#f90',
                    cornerSize: 10,
                    transparentCorners: false,
                    cornerStyle: 'circle',
                    borderDashArray: [3,3],
                    angle: 0,
                    left: clonedObj.left + 20,
                    top: clonedObj.top + 20,
                    evented: true,
                    imgType: imgType_s, // imgType:0背景,1素材 2自定义商品
                    goods_id: goods_id_s,
                    goodsImg_id: goodsImg_id_s,
                    material_id: material_id_s,
                    
                });
                
                if (clonedObj.type === 'activeSelection') {
                    // active selection needs a reference to the canvas.
                    clonedObj.card = card;
                    clonedObj.forEachObject(function(obj) {
                        card.add(obj);
                    });
                    // this should solve the unselectability
                    clonedObj.setCoords();
                } else {
                    card.add(clonedObj);
                }
                console.log("_clipboard",_clipboard)
                _clipboard.top += 20;
                _clipboard.left += 20;
                _clipboard.imgType = clonedObj.imgType, // imgType:0背景,1素材 2自定义商品
                _clipboard.goods_id = clonedObj.goods_id,
                _clipboard.goodsImg_id = clonedObj.goodsImg_id,
                _clipboard.material_id = clonedObj.material_id,
                card.setActiveObject(clonedObj);
                // canvas.requestRenderAll();
            });
        },
        copy(){
        let card = this.card;
        var _self = this;
        // this.$store.state.app.objJSON = card._objects
        console.log("objJSON",this.objJSON)
            card.getActiveObject().clone((cloned) => {
                
                // let _clipboard = cloned;
                console.log("cloned",cloned)
                _self.paste(cloned);
                
            })
            this.card.renderAll()
            this.saveState()

        },
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
    position: relative;
}
</style>
