import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import home from '@/components/commons/home/home'
import login from '@/components/commons/login/login'
import designHome from '@/components/commons/designHome/designHome'
import Preview from '@/view/Preview/Preview'


Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            redirect: '/home/discover'
        },
        {
            path: '/login',
            name: 'login',
            component: login,
        },
        {
            path: '/home',
            name: 'home',
            component: home,
            children: [{
                    path: 'discover',
                    name: 'discover',
                    component: () =>
                        import ('@/view/discover/discover.vue')
                },
                {
                    path: 'mydesign',
                    name: 'mydesign',
                    component: () =>
                        import ('@/view/mydesign/mydesign.vue')
                },
                {
                    path: 'mycollect',
                    name: 'mycollect',
                    component: () =>
                        import ('@/view/mycollect/mycollect.vue')
                },
                {
                    path: 'proDetail',
                    name: 'proDetail',
                    component: () =>
                        import ('@/view/proDetail/proDetail.vue')
                },
            ]
        },
        {
            path: '/designHome',
            name: 'designHome',
            component: designHome,
            children: [{
                    path: 'materialLib',
                    name: 'materialLib',
                    component: () =>
                        import ('@/view/materialLib/materialLib.vue')
                },
                {
                    path: 'goodsLib',
                    name: 'goodsLib',
                    component: () =>
                        import ('@/view/goodsLib/goodsLib.vue')
                },
                {
                    path: 'favorite',
                    name: 'favorite',
                    component: () =>
                        import ('@/view/favorite/favorite.vue')
                },
                {
                    path: 'uploading',
                    name: 'uploading',
                    component: () =>
                        import ('@/view/uploading/uploading.vue')
                }


            ]

        },
        {
            path: '/Preview',
            name: 'Preview',
            component: Preview
        },
        {
            path: '/HelloWorld',
            name: 'HelloWorld',
            component: HelloWorld
        },
    ]
})