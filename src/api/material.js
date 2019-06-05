//素材库Api 点击素材库，获取素材库默认列表（包含素材，背景，自定义商品）
import axios from '@/libs/api.request'
export const getmaterial = (is_personal) => {
        return axios.request({
            url: '/api/v1/get/materials',
            params: {
                is_personal
            },
            method: 'get',
        })
    }
    //上传图片
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
    //上传背景图片
export const backgroundImg = (params) => {
        return axios.request({
            url: '/api/v1/add/backgroundImg',
            data: params,
            headers: {
                // 'sessionKey': 'sessionKey ',
                // "sign": 'sign',
                // "timestamp": 'timestamp',
            },
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

// 添加素材
export const addMaterial = (params) => {
    return axios.request({
        url: '/api/v1/add/materialInfo',
        data: params,
        method: 'post',
    })
}