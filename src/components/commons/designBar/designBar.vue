<template>
    <div :style="{position: 'fixed', width: '100%', minWidth:'800px'}">
        <Menu mode="horizontal" theme="dark" id="dark" active-name="1" style="background:#33373c">
            <div class="layout-nav">
                <MenuItem name="首页" @click.native="routerHome">
                    <i  class="iconfont iconzuo"></i>
                    首页
                </MenuItem>
                <MenuItem name="画布尺寸" class="canvasSize" @click.native="isShowCvsFun">
                    画布尺寸
                </MenuItem>
                <MenuItem name="自动保存..." class="canvasAtuo" v-if="waitFun">
                    自动保存...
                </MenuItem>
                <MenuItem name="恢复" class="layout-user" @click.native="_redo" >
                    <i  class="iconfont iconchexiao1"></i>
                    恢复 
                </MenuItem>
                <MenuItem name="撤销"  @click.native="_undo">
                    <i  class="iconfont icondaohangchexiao"></i>
                    撤销 
                </MenuItem>
                <MenuItem name="重置" @click.native="clearAll"  >
                    <i  class="iconfont iconzhongzhi"></i>
                    重置
                </MenuItem>
                <MenuItem name="预览" @on-select="preview"  @click.native="preview">
                    <i  class="iconfont iconzhongzhi"></i>
                    预览
                </MenuItem>
                <MenuItem name="我的收藏" @click.native="saveScheme" class="layout-user">
                    <Button type="warning">保存方案</Button>
                </MenuItem>
                <MenuItem name="导出清单" @click.native="getGoodsList">
                    <i  class="iconfont iconxiazai"></i>
                    导出清单
                </MenuItem>
            </div>
        </Menu>
        <transition name="fade">
            <div class="canvasCard"  v-if="isShowCvs">
                <Card shadow>
                    <p slot="title">选择画布尺寸</p>
                    <RadioGroup v-model="vertical" vertical @on-change="CanvasSizeFun">
                        <Radio label="1">
                            <Icon type="social-apple"></Icon>
                            <span>1 : 1</span>
                        </Radio>
                        <Radio label="2">
                            <Icon type="social-android"></Icon>
                            <span>A3 竖排</span>
                        </Radio>
                        <Radio label="3">
                            <Icon type="social-windows"></Icon>
                            <span>A3 横排</span>
                        </Radio>
                        <Radio label="4">
                            <Icon type="social-windows"></Icon>
                            <span>16 : 9</span>
                        </Radio>
                    </RadioGroup>
                </Card>
                <div class="moudal" @click="closeMoudalFun"></div>
            </div>
        </transition>
        <Modal
            v-model="saveSchemeModal"
            title="是否保存方案"
            :mask-closable="false"
            @on-ok="isSaveSchemeOk"
            @on-cancel="isSaveSchemeCancel">
            <p>您有设计未保存,是否继续跳转至首页</p>
        </Modal>
        <Modal
            v-model="shemeInfoModal"
            :mask-closable="false"
            :closable='false'
            title="填写方案">
            <div>
                <Form :model="imgObject"  ref="imgObject" :rules="imgRuleValidate">
                    <FormItem prop="scheme_name">
                        <Input v-model="imgObject.scheme_name" placeholder="填写方案名称"></Input>
                    </FormItem>
                    <FormItem >
                        <Row>
                            <Col span="10">
                            <FormItem prop="space_type" >
                                <Select v-model="imgObject.space_type"  placeholder="#选择空间#">
                                    <Option v-for="(item,index) in selectRoomArr" :key="index" :value="item.id" >{{item.name}}</Option>

                                </Select>
                            </FormItem>
                            </Col>
                            <Col span="10" offset="4">
                            <FormItem prop="style_type">
                                <Select v-model="imgObject.style_type"  placeholder="#选择风格#">
                                    <Option v-for="(item,index) in selectStyleArr" :key="index" :value="item.id" >{{item.name}}</Option>
                                </Select>
                            </FormItem>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem prop="customer_name">
                        <Input v-model="imgObject.customer_name" placeholder="填写客户名称"></Input>
                    </FormItem>
                    <FormItem prop="phone" >
                        <Input v-model="imgObject.phone" placeholder="填写客户手机号"></Input>
                    </FormItem>
                    <FormItem label="是否公开">
                        <i-switch v-model="switchVal" :true-value="true"  :false-value="false"  @on-change="isOpenFun"  size="large">
                            <span slot="open" >公开</span>
                            <span slot="close" >个人</span>
                        </i-switch>
                    </FormItem>
                    <FormItem  prop="address">
                        <Input v-model="imgObject.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="填写客户楼盘地址"></Input>
                    </FormItem>
                </Form>
            </div>
                <div slot='footer'>
                    <Button type="default" @click="shemeInfoModalcancel">取消</Button>
                    <Button type="primary" @click="shemeInfoModalok('imgObject')">确定</Button>
                </div>
        </Modal>
         <!-- 清单 -->
        <goodsMerchBill :visible='merchBillModal' :data='goodsList' :loading='tableLoading' v-on:visible="changeVisible"/>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions  } from 'vuex';
import { getEnumList, getSaveScheme,uploadImg } from '@/api/material.js'
import { getSchemeInfo, getSchemeGoodsList } from '@/api/data.js'
import goodsMerchBill from '@/components/commons/goodsMerchBill/goodsMerchBill'
import qs from 'qs'
export default {
    name: 'designBar',
    components: {
        goodsMerchBill
    },
    data() {
        return {
            msg: '这是我的设计bar',
            vertical: '0',
            isShowCvs: false,
            shemeInfoModal:false,
            saveSchemeModal:false,
            imgObject:{
                id: null, // 方案id（编辑方案使用）
                done_img_url: '', // 方案大图url 1
                canvas_type: null, // 画布类型（1：1:1，2：A3横排，3：A3竖排，4：16:9）1
                is_personal: 0,//	公开类型（0：公共（默认）， 1：个人）1
                scheme_name: "", // 方案名称1
                background_id: null, // 背景图id1
                space_type: null, // 空间类型1
                style_type: null, // 风格类型1
                phone: "", // 手机1
                address: "", //	地址1
                customer_name: null,
                img_site_json:null,
                is_auto:1 //自动保存 ( 0:否（默认)，1:是 )
                
            },
            // 表单验证
            imgRuleValidate:{
                scheme_name: [
                    { required: true, message: '方案名称不能为空', trigger: 'blur' }
                ],
                customer_name: [
                    { required: true, message: '客户名称不能为空', trigger: 'blur' }
                    ],
                phone: [
                    { required: true, message: '客户手机不能为空', trigger: 'blur' }
                ],
                space_type: [
                    { type: 'number', required: true, message: '空间类型', trigger: 'change' }
                ],
                style_type: [
                    { type: 'number', required: true, message: '空间风格', trigger: 'change' }
                ],
                address: [
                    { required: true, message: '详细地址', trigger: 'blur' }
                ],
            },
            switchVal:true, //控制switch
            imgFile:{},
            selectRoomArr:[],
            selectStyleArr:[],
            canvasDataArr:[], //画布数据
            proId:  null, // 方案id
            loadObj: null,
            merchBillModal:false,// 清单列表是否显示
            goodsList:[], // 清单数据
            tableLoading:false,
            timer: null,
            isCvsNull:null,
            waitFun:false,
        }
    },
    computed: {
        ...mapState({
            cvsState: state =>{
            return state.app.cvsState
            },
            cvsW: state =>{
                return state.app.cvsW
            },
            cvsH: state =>{
                return state.app.cvsH
            },
            objJSON: state =>{
                return state.app.objJSON
            },
            proDetailVal: state =>{
                return state.app.proDetailVal
            },
            schemeId: state =>{
                return state.app.schemeId
            },
        }),
        ...mapGetters([
            'card',
            'selectedObj',
            'undoList',
            'redoList',
        ])
    },
    created() {
        // console.log("this.card",this.card._objects)
        // if(){
            this.saveSchemeAtuo()
        // }
    },
    updated() {
        // console.log("this.card",this.card._objects)
    },
    mounted() {
        this.proId = this.proDetailVal.id
        this.handleGetEnumList()
        this.isProIdfun()
        
    },
    destroyed() {
        clearInterval(this.timer);
    },
    methods: {
        ...mapActions([
            'setCanvasW',
            'setCanvasH',
            'setCanvasState',
            'setPreviewImg',
            'saveState',
            'undo',
            'redo',
        ]),
        //对话框ok
        isSaveSchemeOk(){
            this.$router.push({ path: '/home/discover' });

            
        },
        //对话框cancel
        isSaveSchemeCancel(){
            this.saveSchemeModal = false
        },
        //跳转主页
        routerHome(){
            this.saveSchemeModal = true
        },
        //判断存在id 调取接口 渲染画布 赋值
        isProIdfun(){
            if( this.schemeId ){
                this.handleGetSchemeInfo(this.schemeId)
                // console.log("this.schemeId",this.schemeId)
            }
            
        },
        shemeInfoModalok (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.toJson()
                    this.imgObject.id = this.schemeId ? this.schemeId : null
                    this.imgObject.canvas_type = parseInt(this.vertical) 
                    this.imgObject.is_auto = 0 
                    // this.imgObject.background_id = parseInt(this.selectedObj.backgroundImgId) 
                    // this.imgObject = qs.stringify(this.imgObject)
                    this.imgObject.is_auto = 0;
                    this.handleGetSaveScheme(this.imgObject)
                    // this.saveSchemeAtuo()
                }
            })
        },
        shemeInfoModalcancel () {
            this.saveSchemeAtuo(),
            this.shemeInfoModal = false,
            this.$Message.info('你取消保存');
        },
        //是否公开
        isOpenFun(ev) {
            this.imgObject.is_personal = this.switchVal?0:1
            // console.log("是否公开",this.imgObject.is_personal)
        },
        // 自动保存方案
        saveSchemeAtuo(){
            // 自动保存
            this.timer = setInterval(() =>{  
                if(this.card._objects.length == 0) return
                console.log("自动保存 0.0",this.card) 
                this.imgObject.canvas_type = parseInt(this.vertical) 
                this.imgObject.is_auto = 1 
                this.saveSchemeAuto()
                setTimeout(() => {
                    this.handleGetSaveSchemeAtuo(this.imgObject) 
                }, 1000);                          
            }, 30000); 
        },
        //保存方案
        saveScheme(){         
            clearInterval(this.timer);                                    
            this.shemeInfoModal = true;
            // this.toJson()
            this.canvasDataArr = this.objJSON.objects
            this.imgObject.img_site_json =  JSON.stringify(this.objJSON)
            //通过toJson数据获取背景素材自定义商品图片
            // console.log("____________",this.objJSON)

            this.useBase64Fun()
            let formData = new FormData();
            // 向 formData 对象中添加文件
            formData.append('file',this.imgFile);
            this.handleGetUploadImg(formData)
        },
        saveSchemeAuto(){
            this.waitFun = true
            // this.toJson()
            this.canvasDataArr = this.objJSON.objects
            this.imgObject.img_site_json =  JSON.stringify(this.objJSON)
            //通过toJson数据获取背景素材自定义商品图片
            // console.log("____________",this.objJSON)

            this.useBase64Fun()
            let formData = new FormData();
            // 向 formData 对象中添加文件
            formData.append('file',this.imgFile);
            this.handleGetUploadImg(formData)
        },
        //导出json格式
        toJson(){
            // this.imgObject.goods_site_list = JSON.stringify(this.card.toJSON())
            // this.imgObject.material_site_list = JSON.stringify(this.card.toJSON())
            
            // console.log("画布对象",this.canvasDataArr);
        },
        //将base64转成文件
        dataURLtoBlob (dataurl, filename = 'Img') {
            let arr = dataurl.split(',')
            let mime = arr[0].match(/:(.*?);/)[1]
            let suffix = mime.split('/')[1]
            let bstr = atob(arr[1])
            let n = bstr.length
            let u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
                return new File([u8arr], `${filename}.${suffix}`, {type: mime})
        },
        //调用方法
        useBase64Fun() {
            //调用
            const card = this.card
            var imgName = 'image'
            if (!card) return;
            const base64Data = card.toDataURL({
                    multiplier: 1,
                    format: 'jpeg'
            });
            this.imgFile = this.dataURLtoBlob(base64Data, imgName);
        },
        _undo() {
            this.undo()
        },
        _redo() {
            this.redo()
        },
        //清空画布
        clearAll() {
            const card = this.card
            if (!card) return
            // card.clear()
            card.set({
            backgroundColor: '#fff'
            })
            card.getObjects().slice().forEach(obj => {
            card.remove(obj)
            });
        },
        //预览
        preview() {
            const card = this.card
            if (!card) return
            const result = card.toDataURL({
                multiplier: 1,
                format: 'jpeg'
            })
            this.setPreviewImg(result)
            let routeData = this.$router.resolve({ path: '/preview' });
            window.open(routeData.href, '_blank');
        },
       //控制画布尺寸弹出框
        isShowCvsFun() {
            this.isShowCvs = !this.isShowCvs
        },
        //改变画布大小
        CanvasSizeFun() {
            if (this.vertical == 1) {
                this.setCanvasW(780)
                this.setCanvasH(780)
                this.setCanvasState(this.vertical)
                this.changeCvsSize(this.cvsW,this.cvsH)
            } else if (this.vertical == 2) {
                this.setCanvasW(546)
                this.setCanvasH(780)
                this.setCanvasState(this.vertical)
                this.changeCvsSize(this.cvsW,this.cvsH)
            } else if (this.vertical == 3) {
                this.setCanvasW(1100)
                this.setCanvasH(780)
                this.setCanvasState(this.vertical)
                this.changeCvsSize(this.cvsW,this.cvsH)
            } else if(this.vertical == 4) {
                this.setCanvasW(1350)
                this.setCanvasH(759)
                this.setCanvasState(this.vertical)
                this.changeCvsSize(this.cvsW,this.cvsH)
                
            }else{
                this.setCanvasW(546)
                this.setCanvasH(546)
                this.setCanvasState(this.vertical)
                this.changeCvsSize(this.cvsW,this.cvsH)
            }
        },
        //动态改变初始化canvas 尺寸
        changeCvsSize(w,h) {
            this.card.renderAll()
            this.card.setWidth(w,h)
            this.saveState()
        },
        //closeMoudalFun 点击遮罩层关闭画布尺寸
        closeMoudalFun() {
            this.isShowCvs = false
        },
        /** 
         * start API
         */
        //品牌列表
        handleGetEnumList() {
            getEnumList().then(res=>{
                this.selectRoomArr = res.data.message.space_list
                this.selectStyleArr = res.data.message.style_list
            }).catch(err=>{
                console.log( err)
            })
        },
        //添加,保存方案
        handleGetSaveScheme(data) {
            getSaveScheme(data).then(res => {
                // console.log('添加,保存方案', res.data.success)
                if(!res.data.success) {
                    this.shemeInfoModal = true
                    this.$Message.error(res.data.message);
                }else{
                    this.$router.push({name:'mydesign'})
                    this.$Message.info(res.data.message);
                } 
            }).catch(err =>{
                console.log(err)
            })
        },
        //添加,保存方案(自动保存)
        handleGetSaveSchemeAtuo(data) {
            getSaveScheme(data).then(res => {
                console.log('添加,保存方案', res.data.success)
                if(!res.data.success) {
                    // this.$Message.error(res.data.message);
                }else{
                    // this.$Message.info(res.data.message.msg);
                    this.imgObject.id = res.data.message.id
                    this.waitFun = false
                } 
            }).catch(err =>{
                console.log(err)
            })
        },
        //上传方案图片
        handleGetUploadImg(file) {
            uploadImg(file).then(res => {
                this.imgObject.done_img_url = res.data.message
                // console.log('上传方案图片', res)
            }).catch(err =>{
                console.log(err)
            })
        },
        // 数据反序列化  获取后台方案数据 准备渲染
        handleGetSchemeInfo (proId) {
            getSchemeInfo(proId).then(res => {
                this.loadObj = res.data.message.img_site_json
                // console.log("这是素材库",this.loadObj)
                // this.card.loadFromJSON( JSON.stringify(this.loadObj) )
                this.imgObject = res.data.message
                // this.setCanvasState(res.data.message.canvas_type)
                this.card.loadFromJSON(JSON.stringify(this.loadObj), this.card.renderAll(), function(o, object) {
                    // console.log("o",o)
                    // console.log("object",object)
                    // `o` = json object
                    // `object` = fabric.Object instance
                    // ... do some stuff ...

                });
                this.card.item(0).set({
                    borderColor: 'red',
                    cornerColor: 'green',
                    cornerSize: 6,
                    transparentCorners: false
                });
                this.card.setActiveObject(this.card.item(0));
            }).catch(err => {
                console.log(err)
            })
        },

        // 导出清单
        getGoodsList () {
            // 先保存
            //this.saveScheme()
            this.tableLoading = true;      
            getSchemeGoodsList(this.schemeId).then(res => {
                if(res.data.success){ 
                    this.goodsList = res.data.message;
                    if(res.data.message.length){
                        this.merchBillModal = true;
                    }else{
                        this.$Message.info('该方案下还没有商品数据哦')
                    }
                }                  
                this.tableLoading = false
            }).catch(err => {
                console.log(err)
                this.tableLoading = false;
            })
        },

        // 监听修改列表是否显示
        changeVisible (event) {
            this.merchBillModal = event
        },

        /**
         * end API
         */
    },
}
</script>
<style scoped>
    .layout-nav{
        display: flex;
    }
    .layout-user{
        margin-left: auto;
    }
    .canvasSize{
        position: relative;
    }
    .canvasAtuo{
        position: absolute;
        left: 200px;
    }

    .canvasCard{
        position: absolute;
        top: 60px;
        left: 100px;
        color:#515A6E;
        text-align: left
    }
    .moudal{
        position: fixed;
        width: 100%;
        left: 0;
        top: 60px;
        min-height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: -1;
    }
</style>
