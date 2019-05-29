const app = {
    state: {
        cvsState: 0,
        cvsW: 780,
        cvsH: 780,
    },
    mutations: {
        changeCvsSizeFun(state, cvsW, cvsH) {
            if (state.cvsState == 0) {
                console.log("vuex--0")
                state.cvsW = 780
                state.cvsH = 780
            } else if (state.cvsState == 1) {
                console.log("vuex--1")
                state.cvsW = 546
                state.cvsH = 780
            } else if (state.cvsState == 2) {
                console.log("vuex--2")
                state.cvsW = 1100
                state.cvsH = 780
            } else {
                state.cvsW = 1350
                state.cvsH = 759
            }
        }
    },
    actions: {
        changeCvsSizeFun(ctx, cvsW, cvsH) {
            ctx.commit('changeCvsSizeFun', cvsW, cvsH)
        }
    }
}
export default app