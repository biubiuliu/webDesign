/**
 * Created by Sugar on 2018/6/11.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
    },
    getters
})

export default store