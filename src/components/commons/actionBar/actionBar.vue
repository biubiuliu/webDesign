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
            <Tooltip class="aliIcon" content="裁剪" v-if="cutModel"><i @click="cutObject" class="iconfont iconjianqie"></i></Tooltip>
            <Tooltip class="aliIcon" content="确定" v-else><i  @click="cutModelOk" class="iconfont iconai50"></i></Tooltip>
            <Tooltip class="aliIcon" content="变形"><i @click="skewControl" class="iconfont iconbianxing"></i></Tooltip>
            <Tooltip class="aliIcon" content="复制图层"><i @click="copy" class="iconfont iconfuzhi"></i></Tooltip>
            <Tooltip class="aliIcon" content="旋转30°"><i @click="rotateObject" class="iconfont iconxuanzhuan"></i></Tooltip>
            <Tooltip class="aliIcon" content="透明度"><i @click="alphaObject" class="iconfont icondiaojiekongzhi2"></i></Tooltip>
            <Tooltip class="aliIcon" content="锁定" v-if="isLocking"><i @click="lockObject" class="iconfont iconsuoding1"></i></Tooltip>
            <Tooltip class="aliIcon" content="取消锁定" v-else><i @click="cancellockObject" class="iconfont iconjiesuo1"></i></Tooltip>
            <Tooltip class="aliIcon" content="删除"><i @click="removeObject" class="iconfont iconshanchu"></i></Tooltip>
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
        <canvas class="canvasCut" style="visibility: hidden; background:red" id="canvas_crop"></canvas>
    </Modal>
    <Modal
        v-model="alphaModel"
        title="透明度"
        draggable
        width="300"
        :closable="false"
        slot="footer">
        <Slider v-model="alphaModelValue" input-size='small' @on-change="alphaControl" @on-input="alphaControl" :min='1' :max='10' show-input></Slider>
        <div slot="footer">
            <Button type="primary" @click="alphaModelOk">确定</Button>
        </div>
        <canvas class="canvasCut" style="visibility: hidden; background:red" id="canvas_crop"></canvas>
    </Modal>
    
    <!-- <Modal
        v-model="cutModel"
        title="裁剪"
        draggable
        width="300"
        :closable="false"
        slot="footer">
        <canvas class="canvasCut" style="visibility: hidden;" id="canvas_crop"></canvas>
        <div slot="footer">
            
            <Button type="primary" @click="cutModelOk">确定</Button>
        </div>
    </Modal> -->
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
            alphaModelValue: 10,
            skewModel:false,
            alphaModel:false,
            cutModel:true,
            test:null,
            //裁剪
            controlsVisibility:null,  //图片裁剪后显示的位置
            el: null,
            object: null,
            lastActive: null,
            selection_object_left : 0,
            selection_object_top : 0,
            isCropping : false,
            oCoords:{},
            aCoords:{},
        }
    },
    created() {
        // console.log("0.0",this.selectedObj)
    },
    updated() {
        this.object = this.selectedObj
        // console.log("0.0",this.selectedObj)
        if(this.selectedObj == null){
            this.skewModel = false;
            this.alphaModel = false;
            return
        }
        this.skewXModelValue = this.selectedObj.skewX,
        this.skewYModelValue = this.selectedObj.skewY
        this.alphaModelValue = this.selectedObj.opacity*10
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
            this.cutModel = false
            var card = this.card
            //生成一个和待裁剪元素相同大小的矩形用于框选裁剪区域
            var el = this.el
            el = new fabric.Rect({
                fill: 'rgba(0,0,0,0)',
                originX: 'left',
                originY: 'top',
                // stroke: '#ccc',
                //strokeDashArray: [2, 2],
                strokWidth: 5,
                //opacity: 1,
                width: .5,
                height: .5,
                borderColor: '#36fd00',
                cornerColor: 'green',
                hasRotatingPoint: false,
                selectable: true
            });
            
            el.left = card.getActiveObject().left;
            this.selection_object_left = card.getActiveObject().left;
            this.selection_object_top = card.getActiveObject().top;
            el.top = card.getActiveObject().top;
            el.width = card.getActiveObject().width * card.getActiveObject().scaleX;
            el.height = card.getActiveObject().height * card.getActiveObject().scaleY;
            card.add(el);
            card.setActiveObject(el);
            card.renderAll()
            
            // this.$store.dispatch('setSelectedObj', null)
                this.isCropping = true;
                console.log("card.getActiveObject()",card.getActiveObject(el))
        },
        
        cropImage(png, left, top, height, width) {
            var card = this.card

        //将图片放进一个新的canvas中，经裁剪后导出一个新的图片。
        //如果用户选框大于原图片，则将选框缩至原图片大小
        // console.log("top",top)
        this.oCoords = png.oCoords
        this.aCoords = png.aCoords
        // console.log("png.top.oCoords", png.oCoords)
        // console.log("png.top.aCoords", png.aCoords)
            if (top < png.top) {
                height = height - (png.top - top);
                top = png.top;
            }
            if (left < png.left) {
                width = width - (png.left - left);
                left = png.left;
            }
            if (top + height > png.top + png.height * png.scaleY)
                height = png.top + png.height * png.scaleY - top;
            if (left + width > png.left + png.width * png.scaleX)
                width = png.left + png.width * png.scaleX - left;

            var canvas_crop = new fabric.Canvas("canvas_crop");
            
            fabric.Image.fromURL(card.toDataURL('png'), (img) => {
                var _this =  this
                img.set('left', -left);
                img.set('top', -top);
                // console.log("img",img)
                canvas_crop.add(img)
                canvas_crop.setHeight(height);
                canvas_crop.setWidth(width);
                canvas_crop.renderAll();

                console.log("img",img)
                fabric.Image.fromURL(canvas_crop.toDataURL('png'), (croppedImg)=> {
                    
                    croppedImg.set({
                        borderColor: '#f90',
                        cornerColor: '#f90',
                        cornerSize: 10,
                        transparentCorners: false,
                        cornerStyle: 'circle',
                        borderDashArray: [3,3],
                        angle: 0,
                        // // scaleX: card.width / img.width /2, 
                        // // scaleY: card.width / img.height /2,
                        left: Math.random().toFixed(2)*200 + 100,
                        top: Math.random().toFixed(2)*200 + 100,
                        // // src:e.target.src,
                        // imgType:0, // imgType:0背景,1素材 2自定义商品
                        // goods_id: null,
                        // goodsImg_id:null,
                        // material_id: null,
                        // backgroundImgId:e.target.id
                    }); 
                    
                    card.remove(img).renderAll();
                    card.add(croppedImg).renderAll();
                    
                    console.log("croppedImg",croppedImg)
                    // this.el = croppedImg
                    console.log("card",this.card)
                    
                    // console.log("this.controlsVisibility",_this.controlsVisibility)
                    // console.log("cropImage",canvas_crop.toDataURL('png')) // 裁剪后的图片base64
                });
            });
        
        },
        cutModelOk(){
            
            if (!this.isCropping) {
                alert("请先框选裁剪区域。");
                return;
            }
            // 
            // console.log("selectedObj",this.selectedObj)
            // console.log("object",this.object)
            let el = this.selectedObj
            // console.log('this.el', el.aCoords)
            let object = this.object
            let canvas = this.card
            let lastActive = this.lastActive

            var left = el.left - object.left;
            var top = el.top - object.top;

            left *= 1;
            top *= 1;

            var width = el.width * 1;
            var height = el.height * 1;

            //将当前帧导出到一个新的canvas中并执行裁剪，在此期间暂停记录历史记录。
            this.cropImage(object, el.left, el.top, parseInt(el.scaleY * height), parseInt(width * el.scaleX));
            canvas.remove(object);
            canvas.remove(canvas.getActiveObject());
            lastActive = object;
            canvas.renderAll();

            this.isCropping = false;
            this.cutModel = true
            // console.log("裁剪ok",object)

        },
        //变形
        skewControl (){
            if(this.selectedObj == null){
                this.skewModel = false;
                return
            }
            this.skewModel = true
            // this.card.requestRenderAll();
            // console.log("selectedObj",this.selectedObj)
        },
        //变形modal
        skewModelOk(){
            this.skewXControl();
            this.skewYControl();
            this.skewModel = false;
        },
        //透明度modal
        alphaModelOk(){
            this.alphaModel = false;
        },
        alphaControl(){
            this.selectedObj.set({
                opacity: this.alphaModelValue/10
            })
            this.card.renderAll()
            this.saveState()
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
        // 透明度
        alphaObject() {
            this.alphaModel = true
            this.alphaControl()
            this.card.renderAll()
            this.saveState()
        },
        // 移除Object
        removeObject() {
            if (!this.selectedObj) return
            // console.log(this.selectedObj);
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
            // console.log("锁定",this.selectedObj);
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
            // console.log("取消锁定",this.selectedObj);
        },
        //复制粘贴
        paste(_clipboard){
            // clone again, so you can do multiple copies.
            let card = this.card;
            
            _clipboard.clone((clonedObj) => {
                // console.log("clonedObj",clonedObj)
                // console.log("this.selectedObj",this.selectedObj)
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
                // console.log("_clipboard",_clipboard)
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
        // console.log("objJSON",this.objJSON)
            card.getActiveObject().clone((cloned) => {
                
                // let _clipboard = cloned;
                // console.log("cloned",cloned)
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
.canvasCut{
    position: fixed;
    width: 0px;
    height: 0px;
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
