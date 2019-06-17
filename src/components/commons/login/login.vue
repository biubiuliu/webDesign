<template>
    <div class="login_body">
        <div class="bgImg_div">
            <!-- <img src="./loginBg.jpg" alt=""> -->
            <div class="login_product">
                <div class="login_list">
                    <div class="login_text">
                       <h1>专业版新功能上线,即刻开启创作设计</h1> 
                       <ul>                                                
                            <li>画布编辑与模板功能</li>
                            <li>无限再创作功能</li>
                            <li>无限收藏商品</li>
                            <li>无限商品容量</li>
                            <li>无线项目容量</li>
                            <li>高清大图下载</li>                            
                            <li>单品智能筛选</li>
                        </ul>
                    </div>
                    
                </div>
                <div class="login_input_box"> 
                    <div class="input_title">
                        <img class="login_log" src="./logo.png" alt="">
                        <div class="line"></div>
                        <div class="login_title">欢迎登录</div>
                    </div> 
                    <Form ref="formInline" :model="formInline" :rules="ruleInline" >
                        <FormItem prop="mobile">
                            <Input type="text" size="large" v-model="formInline.mobile" placeholder="请输入您的手机号">
                            </Input>
                        </FormItem>
                        <FormItem prop="code">
                            <Row>
                                <Col span="14">
                                    <Input type="text" size="large" v-model="formInline.code" placeholder="验证码">
                                    </Input>
                                </Col>
                                <Col span="8" offset="2">
                                    <Button  class="sendCode" @click="send()" v-if="!sendMsgDisabled">                                       
                                         发送验证码
                                    </Button>
                                    <Button disabled v-else class="sendedCode">
                                        {{time+'秒后获取'}}
                                    </Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" class="login" @click="handleSubmit('formInline')">登录</Button>
                        </FormItem>
                    </Form>                  
                </div>
            </div>
        </div>      
    </div>
</template>
<script>
import { getCode,userLogin } from '@/api/data.js'
import { setStorage, getStorage,delStorage} from '@/libs/util.js'

export default {
    name: 'login',
    data() {
        const validatePhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('手机号不能为空'));
            } else if (!/^1[34578]\d{9}$/.test(value)) {
                callback('手机号格式不正确');
            } else {
                callback();
            }   
        };

        return {
            msg: '登入',
            time: 60, // 发送验证码倒计时
            sendMsgDisabled: false,
            formInline: {
                mobile: '',
                code: ''
            },
            ruleInline: {
                mobile: [
                    { required: true,validator:validatePhone,trigger:'blur'},
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                ]
            }
        }
    },
    created() {
       this.getUserName();
    },
     methods: {
            // 如果登录则跳转到发现页面
            getUserName(){
                let userInfo = getStorage('userInfo');
                if(userInfo){
                    //this.$router.push({name:'discover'})
                }
            },

            // 点击登录
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.toLogin();                     
                    } else {
                        
                    }
                })
            },

            // 登录
            toLogin(){
               userLogin(this.formInline).then(res=>{
                   if(res.data.success){
                        this.$Message.success("登录成功"); 
                        var value = {mobile:this.formInline.mobile,sessionKey:res.data.message}
                        setStorage('userInfo',value);
                        let _this=this;
                        setTimeout(function()  {
                              let redirect = decodeURIComponent(_this.$route.query.redirect || '/home/discover');  //获取登录成功后要跳转的路由。
                              console.log(redirect);
                              _this.$router.push({
                                path: redirect
                              })
                        }, 2000)
                   }else{
                      this.$Message.error(res.data.message); 
                   }
               })
            },
            
            // 发送验证码倒计时
            send() {             
                if(this.sendMsgDisabled){
                    return
                }
                if(!this.formInline.mobile){
                    return this.$Message.error('请输入手机号')
                }
                if (!/^1[34578]\d{9}$/.test(this.formInline.mobile)) {
                    return this.$Message.error('手机号格式不正确')
                }

                this.sendMsgDisabled = true;
                this.getVerificationCode();
                let _this = this;
                let interval = window.setInterval(function() {
                    if ((_this.time--) <= 0) {
                        _this.time = 60;
                        _this.sendMsgDisabled = false;
                        window.clearInterval(interval);
                    }
                }, 1000);
            },

            // 获取验证码
            getVerificationCode(){
                getCode(this.formInline.mobile).then(res =>{
                    console.log(res.data.message)
                })
            }
        } 
}
</script>
<style scoped>
.login_body{
    color: black;
    height:100%;

    width:100%;
    overflow: hidden;
    background-image: url(./bg.jpg);
    background-size:cover
}
.bgImg_div{
    width: 100%;
    min-width: 1920px;
    height: 100vh;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
.bgImg_div>img{
    width: 100%;
    height: 100%;
    
}
.login_product{
     /* top: calc(100%-25%); */
    /* position: absolute;
   
    top: 20%;
    left: 40%;
    width: 50%;
    min-width: 800px;
    height: 70%; */
    position: relative;
    width: 745px;
}
.login_list{
    /* width: 80%;
    height: 100%; */
    padding-left: 60px;
    color: white;
    border-radius: 2%;
    background: pink;
    background: linear-gradient(135deg, #3A9B90, #6FAF99, #ADC7A4)
}
.login_input_box{
    top:5%;
    height: 90%; 
    box-shadow: -10px 0 10px #6FAF99;
    border-radius: 2%;
    background: white;
    position: absolute;
    width: 400px;
    right: -120px;
    padding:44px 30px 0px 30px;
}
h1{
    /* padding: 5%; */
    /* border-bottom: 1px solid whitesmoke; */
    font-size: 18px;
    font-weight: 400;
    position: relative;   
}
h1::after{
    content: '';
    position: absolute;
    z-index: 1;
    left: -13px;
    bottom: -13px;
    display: inline-block;
    height: 2px;
    width: 319px;
    background: rgba(255,255,255,.5);
}
hr{
    border-bottom: 1px solid whitesmoke;
}
ul{
    margin-top: 30px;
}
ul>li{
    margin-top: 14px;
    font-size: 16px;
    list-style: disc;
}
.login_text{
    text-align: left;
    padding: 60px 0;
}
.input_title{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 66px;
}
.login_log{
    width: 106px;
    height: 40px;
}
.line{
    height: 18px;
    width: 1px;
    background: #f2f2f2;
}
.login_title{
    font-size: 16px;
    font-weight: 400;
}
.login{
    width: 100%;
    height: 50px;
    background: #ff9a00;
    font-size: 16px;
    border: none;
}
.sendCode{
    color: #fff;
    font-size: 16px;
    border: none;
    background: #ff9a00;
}
.sendedCode{
    font-size: 16px;
}

</style>
