<template>
    <canvas id="canvas" :width="cvsW" :height="cvsH"></canvas>
</template>

<script>
import {mapState, mapGetters,mapActions } from 'vuex'
import { fabric } from 'fabric'
export default {
name: "CanvasCard",
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
            'htmlFontSize',
        ]),

    },
    watch: {
        cvsState(cvsState,oldCvsState) {
            console.log("改变",this.card)
        }
    },
    data() {
        return {
            
        }
    },
    created() {
        // console.log("cvsW",this.cvsW,this.cvsH)
    },
    mounted() {
        console.log('mounted card');
        // 会员卡尺寸 85.5*54毫米 (标准)
        const card = this.self = new fabric.Canvas('canvas', {
            backgroundColor: '#E3E0D5',
        })
        card.setWidth(this.cvsW)
        card.setHeight(this.cvsH)
        card.selection = true  //选中一个组
        card.hasControls = false
        // card.borderColor = '#ff8d23'
        card.preserveObjectStacking = true // 禁止选中图层时自定置于顶部

        //设置比实际大的canvas,解决高清屏幕下图片模糊
        // card.setWidth(this.cW * this.dpr)
        // card.setHeight(this.cH * this.dpr)
        this.addCardEventListener(card)
        this.initFrontCard(card)
        
        this.saveState()
        console.log("test",card)
    },

    methods: {
        ...mapActions([
            'initFrontCard',
            'setSelectedObj',
            'saveState',
            'setIsLocking',
        ]),
        addCardEventListener(card) {
            card.on('object:added', (e) => {
            console.log('object:added',e)
            // this.saveState()
            })
            card.on('object:modified', (e) => {
            console.log('object:modified',e)
            this.saveState()
            })
            card.on('object:removed', (e) => {
            console.log('object:removed')
            this.saveState()
            })
            // card.on('object:selected', (e) => {
            //   console.log('object:selected', e.target)
            //   this.setSelectedObj(e.target)
            // })
            card.on('selection:created', (e) => {
            console.log('selection:created', e.target)
            this.setSelectedObj(e.target)
            })
            card.on('selection:updated', (e) => {
            console.log('selection:updated', e.target.hasControls)
            this.setIsLocking(e.target.hasControls)
            this.setSelectedObj(e.target)
            })
            card.on('selection:cleared', (e) => {
            console.log('selection:cleared')
            this.setSelectedObj(null)
            })

        },
    },

}
</script>

<style scoped>

</style>
