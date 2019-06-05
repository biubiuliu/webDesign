<template>
    <div :style="{position: 'fixed', width: '100%', minWidth:'800px'}">
        <Menu mode="horizontal" theme="dark" id="dark" active-name="1">
            <div class="layout-nav">
                <MenuItem name="首页"  to="/home/discover">
                    <i  class="iconfont iconzuo"></i>
                    首页
                </MenuItem>
                <MenuItem name="画布尺寸" class="canvasSize" @click.native="isShowCvsFun">
                    画布尺寸
                </MenuItem>
                
                <MenuItem name="我的收藏" @click.native="saveScheme">
                    保存方案
                </MenuItem>
                <MenuItem name="撤销" class="layout-user">
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
                <MenuItem name="导出清单" class="layout-user">
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
                        <Radio label="0">
                            <Icon type="social-apple"></Icon>
                            <span>1 : 1</span>
                        </Radio>
                        <Radio label="1">
                            <Icon type="social-android"></Icon>
                            <span>A3 竖排</span>
                        </Radio>
                        <Radio label="2">
                            <Icon type="social-windows"></Icon>
                            <span>A3 横排</span>
                        </Radio>
                        <Radio label="3">
                            <Icon type="social-windows"></Icon>
                            <span>16 : 9</span>
                        </Radio>
                    </RadioGroup>
                </Card>
                <div class="moudal" @click="closeMoudalFun"></div>
            </div>
            
        </transition>
        <Modal
            v-model="shemeInfoModal"
            title="填写方案"
            @on-ok="shemeInfoModalok"
            @on-cancel="shemeInfoModalcancel">
            <div>
                <Form :model="formItem" >
                    <FormItem>
                        <Input v-model="formItem.input" placeholder="填写方案名称"></Input>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col span="10">
                            <!-- @on-open-change ="handleGetEnumList(1)" -->
                                <Select v-model="formItem.selectRoom"  placeholder="#选择空间#">
                                    <Option v-for="(item,index) in selectRoomArr" :key="index" :value="item.id" >{{item.name}}</Option>

                                </Select>
                            </Col>
                            <Col span="10" offset="4">
                                <Select v-model="formItem.selectStyle"  placeholder="#选择风格#">
                                    <Option v-for="(item,index) in selectStyleArr" :key="index" :value="item.id" >{{item.name}}</Option>
                                </Select>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Input v-model="formItem.input" placeholder="填写客户名称"></Input>
                    </FormItem>
                    <FormItem>
                        <Input v-model="formItem.input" placeholder="填写客户手机号"></Input>
                    </FormItem>
                    <FormItem label="是否公开">
                        <i-switch v-model="formItem.switch" @on-change="isOpenFun"  size="large">
                            <span slot="open" >公开</span>
                            <span slot="close">个人</span>
                        </i-switch>
                    </FormItem>
                    <FormItem>
                        <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="填写客户楼盘地址"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions  } from 'vuex';
import { getEnumList } from '@/api/material.js'
export default {
    name: 'designBar',
    data() {
        return {
            msg: '这是我的设计bar',
            vertical: '0',
            isShowCvs: false,
            shemeInfoModal:false,
            formItem: {
                    input: '',
                    selectRoom: '',
                    selectStyle: '',
                    switch: true,
                    textarea: ''
                },
            imgObject:{
                id:"",//方案id（编辑方案使用）
                done_img_url:"",//方案大图url
                canvas_type:"",//方案id（编辑方案使用）
                canvas_type:"",//画布类型（1：1:1，2：A3横排，3：A3竖排，4：16:9）
                is_personal:"",//	公开类型（0：公共（默认）， 1：个人）
                scheme_name:"",//方案名称
                background_id:"",//背景图id
                space_type:"",//空间类型
                style_type:"",//风格类型
                phone:"",//手机
                address:"",//	地址
                goods_site_list:"",//单品信息
                material_site_list:"",//素材信息
            },
            selectRoomArr:[],
            selectStyleArr:[]
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
            }
        }),
        ...mapGetters([
            'card',
            'selectedObj',
        ])
    },
    mounted() {
        this.handleGetEnumList()
    },
    methods: {
        ...mapActions([
            'setCanvasW',
            'setCanvasH',
            'setCanvasState',
            'setPreviewImg',
            'saveState'
        ]),
        shemeInfoModalok () {
                this.$Message.info('Clicked ok');
            },
        shemeInfoModalcancel () {
            this.$Message.info('Clicked cancel');
        },
        //是否公开
        isOpenFun(ev) {
            console.log("是否公开",ev)
        },
        //保存方案
        saveScheme(){
            this.shemeInfoModal = true;
            console.log("保存方案")
            this.toJson()
        },
        //导出json格式
        toJson(){
            console.log(JSON.stringify(this.card.toJSON()));
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
            console.log(card.toDataURL({
                multiplier: 1,
                format: 'jpeg'
            })
            )
            console.log("------------------------",card.toDataURL)
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
            if (this.vertical == 0) {
                this.setCanvasW(780)
                this.setCanvasH(780)
                this.setCanvasState(this.vertical)
                this.changeCvsSize(this.cvsW,this.cvsH)
            } else if (this.vertical == 1) {
                this.setCanvasW(546)
                this.setCanvasH(780)
                this.setCanvasState(this.vertical)
                this.changeCvsSize(this.cvsW,this.cvsH)
            } else if (this.vertical == 2) {
                this.setCanvasW(1100)
                this.setCanvasH(780)
                this.setCanvasState(this.vertical)
                this.changeCvsSize(this.cvsW,this.cvsH)
            } else {
                this.setCanvasW(1350)
                this.setCanvasH(759)
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
        //品牌列表
        handleGetEnumList() {
            getEnumList().then(res=>{
                this.selectRoomArr = res.data.message.space_list
                this.selectStyleArr = res.data.message.style_list
            console.log('------------------', res.data.message)
            }).catch(err=>{
                console.log( err)
            })
        },
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
