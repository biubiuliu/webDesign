import axios from '@/libs/api.request'
export const getGoodsType = () => {
    return axios.request({
        url: '/WeChatGoods/public/index.php/collocation/get/goods/type?cat_id=2476',
        method: 'get'
    })
}

// 获取方案列表
export const getMeals = (params) =>{
    return axios.request({
        url:'/api/v1/get/schemeList',
        method: 'get',
        params: params,
    })
}

// 获取文件夹列表
export const getDirList = () => {
    return axios.request({
        url:'/api/v1/get/dirList',
        method:'get'
    })
}

// 添加文件夹
export const addSchemeDir = (dir_name) => {
    return axios.request({
        url:'/api/v1/add/schemeDir',
        method:'post',
        data: {
            dir_name:dir_name
        },
    })
}

// 枚举列表（风格、空间）
export const getEnumList = () => {
    return axios.request({
        url:'/api/v1/get/enumList',
        method:'get',       
    })
}

// 获取品牌列表
export const getBrandList = () => {
    return axios.request({
        url:'/api/v1/get/brandList',
        method:'get',       
    })
}

// 获取商品列表
export const getGoodsList = (params) => {
    return axios.request({
        url:'/api/v1/get/goods',
        method:'get',
        params: params,
    })
}