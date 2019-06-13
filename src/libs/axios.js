import axios from 'axios'
import store from '@/store'
import md5 from 'js-md5';
import {getStorage} from './util'

const addErrorLog = errorInfo => {
    const { statusText, status, request: { responseURL } } = errorInfo
    let info = {
        type: 'ajax',
        code: status,
        mes: statusText,
        url: responseURL
    }
    if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
    constructor(baseUrl = baseURL) {
        this.baseUrl = baseUrl
        this.queue = {}
    }
    getInsideConfig() {
        // 登录带的参数
        const login_server = '4NR01nHbPT9FTXrFUM1Y3BE1';
        const timestamp = new Date().getTime() / 1000;
        const userInfo = getStorage('userInfo')
        const sessionKey = userInfo&&userInfo.sessionKey?userInfo.sessionKey:'';
        
        const config = {
            baseURL: this.baseUrl,
            headers: {}             
        }

        if (sessionKey) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.sessionKey = sessionKey;
            config.headers.randNumber = Math.random();
            config.headers.timestamp = timestamp;
            config.headers.sign = md5(login_server+sessionKey+timestamp+config.headers.randNumber);           
        }
        return config
    }
    destroy(url) {
        delete this.queue[url]
    }
    interceptors(instance, url) {
        // 请求拦截
        instance.interceptors.request.use(config => {
                store.state.app.isShowSpin = true; //在请求发出之前进行一些操作
                return config
            }, error => {
                return Promise.reject(error)
            })
            // 响应拦截
        instance.interceptors.response.use(res => {
            store.state.app.isShowSpin = false; //在这里对返回的数据进行处理
            this.destroy(url)
            const { data, status } = res
            return { data, status }
        }, error => {
            this.destroy(url)
            let errorInfo = error.response
            if (!errorInfo) {
                const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
                errorInfo = {
                    statusText,
                    status,
                    request: { responseURL: config.url }
                }
            }
            addErrorLog(errorInfo)
            return Promise.reject(error)
        })
    }
    request(options) {
        const instance = axios.create()
        options = Object.assign(this.getInsideConfig(), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }
}
export default HttpRequest