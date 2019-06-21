<template>
    <Modal v-model="visible" width="1050" :closable="false">
        <a href="javascript:;" class="close" @click="changeVisible">×</a>
            <div class="table">
                <Table  :height="tableHeight" :columns="columns" ref="myTable" :data="data"  :loading="loading" size="large">
                    <template slot="selectRow" slot-scope="props">
                        <Select style="font-size:14px;color:rgb(134, 142, 150)" @on-change="skuChange($event,props.index)" :value="props.row.skuChoose">
                            <Option  v-for="(item, index) in props.row.skus" :key="index" :value="item.skuName">{{ item.skuName }}</Option>
                        </Select>
                    </template>
                </Table>
                <div class="total">
                    <span>总价</span>
                    <span>￥{{total}}</span>                    
                </div>
            </div>            
            <div slot="footer">
                <div class="footer_view">
                    <div class="modal_footer">
                        <span>总价</span>
                        <span>￥{{total}}</span>
                        <a href="javascript:;" class="print" @click="toPrint">打印</a>
                    </div>
                </div>
            </div>
    </Modal>     
</template>
<script>
import Vue from 'vue';

export default {
    name: 'schemeList',
    data(){
        return{
            msg:'导出清单',
            total:0,
            tableHeight:600,
            height:0,
            columns: [
                {
                    title: '单品名称',
                    key: 'goods_name',
                    width: 415,
                    render: (h, params) => {
                         return h('div',{
                             style:{
                                 display:'flex',
                                 alignItems:'center'
                                }
                             },[
                             h("img",{  
                                attrs: {
                                    src: params.row.goods_thumb
                                },
                                style: {
                                    width: "100px",
                                    height: "100px",
                                    margin: "2px 6px 2px 0",
                                },
                            },''),
                            h("div",{},[
                                h("p",{
                                    style:{
                                        lineHeight:'28px',
                                        fontSize:'14px',
                                        color:'rgb(134, 142, 150)',
                                    }
                                },params.row.goods_name),
                                h("p",{
                                    style:{
                                        lineHeight:'28px',
                                        fontSize:'14px',
                                         color:'rgb(134, 142, 150)',
                                    }
                                },'品牌 '+params.row.brand_name),
                                h("p",{
                                    style:{
                                        lineHeight:'28px',
                                        fontSize:'14px',
                                        color:'rgb(134, 142, 150)',
                                    }
                                },'分类 '+params.row.cat_name),]),
                         ])   
                    },
                },
                {
                    title: '规格属性',
                    key: 'skus',
                    // width: 450,
                     render: (h, params) => {
                        return h('div',{
                             style:{
                                 lineHeight:'28px',
                                 fontSize:'14px', 
                                 color:'rgb(134, 142, 150)',                           
                                }
                             },
                            params.row.skus.length?
                            this.$refs.myTable.$scopedSlots.selectRow({
                                row: params.row,
                                index: params.index
                            }):'暂无规格属性'
                        )
                    }
                },
                {
                    title: '价格',
                    key: 'shop_price',
                    width: 175,
                    render: (h, params) => {
                         return h('div',{
                             style:{
                                 lineHeight:'28px',
                                 fontSize:'14px',
                                 color:'#f90',
                                 fontWeight: 700
                                }
                             },'￥'+params.row.shop_price)
                    }
                }
            ],
        }
    },

    props:{
      visible:Boolean,// 是否展示
      data:Array,// 数据 {brand_name: "",cat_name: "",goods_id:1,goods_name: "",goods_thumb: "",shop_price: "",skus: [{skuId:'',skuName:'',price:''}],style_name:""}
      loading:Boolean, // 是否显示loading,
    },

    watch:{
        data(val) {
            this.data = val;
            this.init();
            this.caculate(); 
            this.height = 105*val.length+48;   
        }
    },

    methods: {
        // init 
        init () {
            this.data.map((item)=>{                        
                if(item.skus.length){
                    item.skuChoose = item.skus[0].skuName;
                }        
            }) 
        },

        // 属性修改
        skuChange (event, idx,price) {
            this.data[idx].skuChoose = event
            this.data[idx].skus.map((item)=>{
                if(item.skuName==event){
                   this.data[idx].shop_price = item.price;
                   this.caculate(); 
                }
            })
        },

        // 修改modal显示状态
        changeVisible () {           
            this.modalVisible = false;
            this.$emit('visible', this.modalVisible)
        },
        
        // 计算总计
        caculate () {
            this.total = 0;
            this.data.map((item,i)=>{               
                this.total = this.total+parseInt(item.shop_price);
            })
        },

        // 打印
        toPrint () {
            var _this = this;
            this.modalVisible = false;
            this.$emit('visible', false)
            this.tableHeight = this.height;
            document.getElementsByClassName('total')[0].style.display='block';
            setTimeout(function(){
                var oldstr = document.body.innerHTML;
                var newstr = document.getElementsByClassName('table')[0].innerHTML;              
                // 2. 复制给body，并执行window.print打印功能
                document.body.innerHTML = newstr;
                window.print();
                window.location.reload();
                return false
            },500)
        }
    },
}
</script>
<style scope>
.close{
    display: block;
    background: #ff9a00;
    width: 18px;
    height: 18px;
    border-radius:9px;
    color: #333;
    top: -12px;
    right: -12px;
    position: absolute;
    font-size: 18px;
    text-align: center;
    line-height: 18px;
}
.close:hover{
    color: #333
}
.footer_view{
   height:25px;
   position:relative;
}
.modal_footer{
    position: absolute;
    bottom: -12px;
    right: -18px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.modal_footer span:first-child{
    font-size: 14px;
    color: #333;
}
.modal_footer span:nth-child(2){
    font-size: 16px;
    color: #ff9a00;
    font-weight: 700;
    margin: 0 20px;
}
.print{
    width: 150px;
    height: 50px;
    background: #ff9a00;
    color: #fff;
    font-size: 14px;
    line-height: 50px;
    text-align: center;
    display: block;
}
.print:hover{
    color: #fff
}
.total{   
    text-align: right;
    display: none; 
    line-height:50px;
    padding-right:10px;
}
.total span:nth-child(2){
    font-size: 16px;
    color: #ff9a00;
    font-weight: 700;
}
</style>



