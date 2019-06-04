import axios from '@/libs/api.request'
export const getGoodsType = () => {
    return axios.request({
        url: '/WeChatGoods/public/index.php/collocation/get/goods/type?cat_id=2476',
        method: 'get'
    })
}