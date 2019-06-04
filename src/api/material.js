//素材库Api
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
export const backgroundImg = (data) => {
    return axios.request({
        url: '/api/v1/add/backgroundImg',
        data: {
            img_url,
            is_personal
        },
        method: 'post',
    })
}