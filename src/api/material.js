//素材库Api 点击素材库，获取素材库默认列表（包含素材，背景，自定义商品）
import axios from '@/libs/api.request'
import qs from 'qs'
export const getmaterial = (is_personal) => {
        return axios.request({
            url: '/api/v1/get/materials',
            params: is_personal,
            method: 'get',
        })
    }
    //获取素材/自定义商品/背景图列表
export const getmaterialList = (getmaterialData) => {
        return axios.request({
            url: '/api/v1/get/material/list',
            params: getmaterialData,
            method: 'get',
        })
    }
    // 保存方案 添加/编辑 方案
export const getSaveScheme = (imgObject) => {
        return axios.request({
            url: '/api/v1/create/createScheme',
            data: qs.stringify(imgObject),
            method: 'post',
        })
    }
    //上传自定义图片
export const customGoods = (data) => {
        return axios.request({
            url: '/api/v1/add/customGoods',
            data: {
                goods_id,
                goods_img,
                is_personal
            },
            method: 'post',
        })
    }
    //上传图片
export const uploadImg = (file) => {
        return axios.request({
            url: '/api/v1/upload/img',
            data: file,
            method: 'post',
        })
    }
    //上传背景图片
export const backgroundImg = (params) => {
        return axios.request({
            url: '/api/v1/add/backgroundImg',
            data: params,
            method: 'post',
        })
    }
    //获取商品列表
export const goodsList = (page, style_id, keywords, brand_id, category_id) => {
    return axios.request({
        url: '/api/v1/get/goods',
        params: {
            page,
            style_id,
            keywords,
            brand_id,
            category_id
        },
        method: 'get',
    })
}

//品牌-风格-分类列表
export const category = () => {
        return axios.request({
            url: '/api/v1/get/goods/category',
            method: 'get',
        })
    }
    // 枚举列表（风格、空间）
export const getEnumList = () => {
    return axios.request({
        url: 'api/v1/get/enumList',
        method: 'get',
    })
}

// 添加素材
export const addMaterial = (params) => {
    return axios.request({
        url: '/api/v1/add/materialInfo',
        data: params,
        method: 'post',
    })
}
