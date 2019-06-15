import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import home from '@/components/commons/home/home'
import login from '@/components/commons/login/login'
import designHome from '@/components/commons/designHome/designHome'
import Preview from '@/view/Preview/Preview'
import {getStorage} from '@/libs/util'
const userInfo = getStorage('userInfo')
const sessionKey = userInfo&&userInfo.sessionKey?userInfo.sessionKey:'';

Vue.use(Router)

 var router = new Router({
    routes: [{
            path: '/',
            redirect: '/home/discover',
            meta: {
                requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            },
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
                    meta: {
                        requireAuth: true,  
                    },
                    component: () =>
                        import ('@/view/discover/discover.vue')
                },
                {
                    path: 'mydesign',
                    name: 'mydesign',
                    meta: {
                        requireAuth: true,  
                    },
                    component: () =>
                        import ('@/view/mydesign/mydesign.vue')
                },
                {
                    path: 'mycollect',
                    name: 'mycollect',
                    meta: {
                        requireAuth: true,  
                    },
                    component: () =>
                        import ('@/view/mycollect/mycollect.vue')
                },
                {
                    path: 'proDetail/:id/:type',
                    name: 'proDetail',
                    meta: {
                        requireAuth: true,  
                    },
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
                    meta: {
                        requireAuth: true,  
                    },
                    component: () =>
                        import ('@/view/materialLib/materialLib.vue')
                },
                {
                    path: 'goodsLib',
                    name: 'goodsLib',
                    meta: {
                        requireAuth: true,  
                    },
                    component: () =>
                        import ('@/view/goodsLib/goodsLib.vue')
                },
                {
                    path: 'favorite',
                    name: 'favorite',
                    meta: {
                        requireAuth: true,  
                    },
                    component: () =>
                        import ('@/view/favorite/favorite.vue')
                },
                {
                    path: 'uploading',
                    name: 'uploading',
                    meta: {
                        requireAuth: true,  
                    },
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

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (sessionKey) {  // 通过vuex state获取当前的token是否存在
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
        next();
    }else {
        next();
    }
})

export default router