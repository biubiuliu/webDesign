import axios from '@/libs/api.request'
export const getGoodsType2 = (cat_id) => {
    return axios.request({
        url: '/WeChatGoods/public/index.php/collocation/get/goods/type?cat_id=' + cat_id,
        method: 'get'
    })
}
export const getGoodsType = () => {
    return axios.request({
        url: '/WeChatGoods/public/index.php/collocation/get/goods/type?cat_id=2476',
        method: 'get'
    })
}