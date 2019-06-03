/**
 * Created by Sugar on 2018/6/11.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import getters from './getters'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
    },
    getters,
    plugins: [createPersistedState({
        storage: window.sessionStorage,
        updataProDetailVal(val) {
            return {
                // 只储存state中的user
                proDetailVal: val.proDetailVal
            }
        }
    })]
})

export default store