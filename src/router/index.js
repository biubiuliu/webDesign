import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import home from '@/components/commons/home/home'
import designHome from '@/components/commons/designHome/designHome'


Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            redirect: '/home'
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
            ]
        },
        {
            path: '/designHome',
            name: 'designHome',
            component: designHome,

        },
        {
            path: '/HelloWorld',
            name: 'HelloWorld',
            component: HelloWorld
        },
    ]
})