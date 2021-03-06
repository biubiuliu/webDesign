import axios from '@/libs/api.request'

// 获取验证码
export const getCode = (mobile) => {
    return axios.request({
        url: '/api/v1/get/verification/code',
        method: 'get',
        params: { mobile },
    })
}

// 登录
export const userLogin = (params) => {
    return axios.request({
        url: '/api/v1/login/user',
        method: 'post',
        data: params
    })
}

// 获取方案列表
export const getMeals = (params) => {
    return axios.request({
        url: '/api/v1/get/schemeList',
        method: 'get',
        params: params,
    })
}

// 获取文件夹列表
export const getDirList = () => {
    return axios.request({
        url: '/api/v1/get/dirList',
        method: 'get'
    })
}

// 添加文件夹
export const addSchemeDir = (dir_name,id,is_delete) => {
    return axios.request({
        url: '/api/v1/add/schemeDir',
        method: 'post',
        data: {
            dir_name: dir_name,
            id,
            is_delete
        },
    })
}

// 获取品牌列表
export const getBrandList = () => {
    return axios.request({
        url: '/api/v1/get/brandList',
        method: 'get',
    })
}

// 获取商品列表
export const getGoodsList = (params) => {
    return axios.request({
        url: '/api/v1/get/goods',
        method: 'get',
        params: params,
    })
}

// 修改方案基本信息（移动文件夹，是否公开，修改信息）
export const modifySchemeInfo = (params) => {
    return axios.request({
        url: '/api/v1/editor/schemeInfo',
        method: 'post',
        data: params
    })
}

// 获取方案基本信息
export const getSchemeInfo = (id) => {
    return axios.request({
        url: '/api/v1/get/schemeDetail?id=' + id,
        method: 'get',
    })
}

// 获取方案清单
export const getSchemeGoodsList = (id) => {
    return axios.request({
        url: '/api/v1/get/educe/goods?id=' + id,
        method: 'get',
    })
}

// 获取收藏列表
export const getCollectList = (page,type,style_ids,cat_ids,kwd,page_size) => {
    return axios.request({
        url: '/api/v1/get/collectList',
        method: 'get',
        params: {
            page,
            type,
            style_ids,
            cat_ids,
            kwd,
            page_size
        },
    })
}

// 获取收藏的筛选列表
export const getCollectScreen  = () => {
    return axios.request({
        url: '/api/v1/get/collectScreen',
        method: 'get',
    })
}

// 获取商品详情
export const getGoodsDetail = (goods_id) => {
    return axios.request({
        url: '/api/v1/get/goods/info',
        method: 'get',
        params:{
            goods_id
        }
    })
}

// 获取方案关联信息
export const getSchemeRelated = (id) => {
    return axios.request({
        url: '/api/v1/get/schemeRelated',
        method: 'get',
        params:{
            id
        }
    })
}

// 收藏
export const isCollect = (params) => {
    return axios.request({
        url: '/api/v1/add/collect',
        method: 'post',
        data:params
    })
}

// 删除方案
export const delScheme = (params) => {
    return axios.request({
        url: '/api/v1/delete/delScheme',
        method: 'post',
        data:params
    })
}

// 复制方案
export const copyScheme = (params) => {
    return axios.request({
        url:'/api/v1/add/copyScheme',
        method:'post',
        data:params
    })
}

// 获取方案收藏关联信息
export const getCollectRelated = (id) => {
    return axios.request({
        url: '/api/v1/get/collectRelated',
        method: 'get',
        params:{
            id
        }
    })
}
