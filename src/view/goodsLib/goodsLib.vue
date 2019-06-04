<template>
    <div>
        <div class="select_box">
            <Select v-model="selsect" size="small" style="width:100px"  id="select">
                <Option value="brand" label="brand" class="option">
                    <span>品牌</span>
                    <span style="float:right;color:#ccc">America</span>
                </Option>
                <Option value="London" label="London"  class="option">
                    <span>dddd</span>
                    <span style="float:right;color:#ccc">U.K.</span>
                </Option>
                <Option value="Sydney" label="Sydney"  class="option">
                    <span>Sydney</span>
                    <span style="float:right;color:#ccc">Australian</span>
                </Option>
            </Select>
            <Select v-model="selsect" size="small" style="width:100px" id="select">
                <Option value="brand" label="brand" class="option">
                    <span>品牌</span>
                    <span style="float:right;color:#ccc">America</span>
                </Option>
                <Option value="London" label="London"  class="option">
                    <span>dddd</span>
                    <span style="float:right;color:#ccc">U.K.</span>
                </Option>
                <Option value="Sydney" label="Sydney"  class="option">
                    <span>Sydney</span>
                    <span style="float:right;color:#ccc">Australian</span>
                </Option>
            </Select>
            <Select v-model="selsect" size="small" style="width:100px" id="select">
                <Option value="brand" label="brand" class="option">
                    <span>品牌</span>
                    <span style="float:right;color:#ccc">America</span>
                </Option>
                <Option value="London" label="London"  class="option">
                    <span>dddd</span>
                    <span style="float:right;color:#ccc">U.K.</span>
                </Option>
                <Option value="Sydney" label="Sydney"  class="option">
                    <span>Sydney</span>
                    <span style="float:right;color:#ccc">Australian</span>
                </Option>
            </Select>
        </div>
        <div>
            <ul class="goodsUl flexLayout">
                <li class="goodsLi" v-for="(item,index) in goodsImgArr" :key="index" @click="goodsImgDownFun"  @mouseenter="mouseenter(item,index)"  @mouseleave="mouseleave(item,index)">
                    <img class="goodsImg" src="./images.jpg" alt="">
                    <div class="iconBox flexLayout" v-if="item.isShowIcon">
                        <div @click="iconshoucang1Fun(index)" ><i  class="iconfont iconshoucang1"></i></div>
                        <div @click="iconxiazaiFun(index)"><i  class="iconfont iconxiazai"></i></div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="goodsModalBox">
            <Modal
                title="下载的商品"
                v-model="goodsLibModal"
                :styles="{left: '80px',top: '180px',margin:'0',width:'340px'}">
                <ul class="flexLayout">
                    <li class="goodsLi" v-for="(item,index) in goodsImgArr" :key="index">
                        <CheckboxGroup v-model="social"  class="checkBoxLeftTop">
                            <Checkbox :label="index">&nbsp;</Checkbox>
                        </CheckboxGroup>
                        <img class="goodsImg" src="./images.jpg" alt="图片丢失">
                    </li>
                </ul>
            </Modal>
        </div>
        
    </div>
</template>
<script>
export default {
    name: 'goodsLib',
    data() {
        return {
            msg: '这是商品库',
            goodsImgArr:[
                {src:require("./images.jpg"),id:'1',isShowIcon:false},
                {src:require("./images.jpg"),id:'2',isShowIcon:false},
                {src:require("./images.jpg"),id:'3',isShowIcon:false},
                {src:require("./images.jpg"),id:'4',isShowIcon:false},
                {src:require("./images.jpg"),id:'5',isShowIcon:false},
                {src:require("./images.jpg"),id:'6',isShowIcon:false},
            ],
            selsect:"brand",
            goodsLibModal: false,
            social:[]
        }
    },
    methods: {
        mouseenter(item,index) {
            item.isShowIcon = true; 
        },
        mouseleave(item,index) {
            item.isShowIcon = false;
        },
        goodsImgDownFun() {
            this.modal9 = true;
        },
        iconshoucang1Fun(index) {
            console.log("收藏", index)
        },
        iconxiazaiFun(index) {
            console.log( "下载", index)
        }
    },
    
}
</script>
<style scoped>
.select_box  /deep/ .ivu-select-selection {
    color: white;
    background: #293039;
    border: 0;
  }
.select_box  /deep/ .ivu-select-item-selected {
    /* background: #f90; */
    color: black
  }
.select_box  /deep/ .ivu-select-item:hover {
    background: #f90;
  }
.select_box{
    margin-top: 10px
}
#select>div{
    background: #293039 !important;
}
.flexLayout{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
}
.ivu-select-selection{
     background: #293039 !important;
}
.goodsUl{
    padding: 10px 40px;
}
.goodsLi{
    position: relative;
}
.iconBox{
    width: 100%;
    position: absolute;
    padding: 0 5px;
    top: 5px;
}
i{
    font-size: 10px
}
.iconBox>div{
    width: 16px;
    height: 16px;
    border-radius: 3px;
    line-height: 16px;
    background: rgba(0, 0, 0, 0.5)
}
.goodsImg{
    width: 100px;
    height: 100px;
}
.goodsModalBox{
}
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;    
}
.ivu-modal{
    top: 0;
    left:0;
    margin:0;
    width:0;
}
.checkBoxLeftTop{
    position: absolute;
    top: 0px;
    left: 0px;
    color: gold
}
</style>
