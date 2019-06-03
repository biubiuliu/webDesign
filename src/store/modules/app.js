const app = {
    state: {
        cvsState: 0,
        cvsW: 780,
        cvsH: 780,
        proDetailVal: {},
        // drag
        cardType: 1,
        frontCard: null,
        behindCard: null,
        undoList: [],
        selectedObj: null,


    },
    mutations: {
        //设置画布大小
        SET_CVS_W: (state, cvsW) => {
            state.cvsW = cvsW
        },
        SET_CVS_H: (state, cvsH) => {
            state.cvsH = cvsH
        },
        SET_CVS_STATE: (state, cvsState) => {
            state.cvsState = cvsState
        },
        // drag -s
        SET_SELECTEDOBJ: (state, object) => {
            state.selectedObj = object
        },
        INIT_FRONTCARD: (state, fCanvas) => {
            state.frontCard = fCanvas
        },
        INIT_BEHINDCARD: (state, fCanvas) => {
            state.behindCard = fCanvas
        },
        SET_REDOLIST: (state, list) => {
            state.redoList = list
        },
        SET_CANVASSTATE: (state, canvasState) => {
            state.canvasState = canvasState
        },
        ADD_UNDO: (state, canvasState) => {
            state.undoList.push(canvasState)
        },
        // drag  -e

    },
    actions: {
        updataProDetailVal(ctx, obj) {
            ctx.commit('SET_PRODETAIL', obj)
        },
        setCanvasW({ commit }, cvsW) {
            commit('SET_CVS_W', cvsW)
        },
        setCanvasH({ commit }, cvsH) {
            commit('SET_CVS_H', cvsH)
        },
        setCanvasState({ commit }, cvsState) {
            commit('SET_CVS_STATE', cvsState)
        },
        // darg
        initFrontCard({ commit }, fCanvas) {
            commit('INIT_FRONTCARD', fCanvas)
        },
        initBehindCard({ commit }, fCanvas) {
            commit('INIT_BEHINDCARD', fCanvas)
        },
        setSelectedObj({ commit }, object) {
            commit('SET_SELECTEDOBJ', object)
        },
        saveState({ commit, state }) {
            // 清空恢复栈redoList
            commit('SET_REDOLIST', [])

            if (state.canvasState) {
                commit('ADD_UNDO', state.canvasState)
            }
            console.log(state.frontCard.toJSON([
                'hasControls',
                'borderColor',
            ]))
            commit('SET_CANVASSTATE', state.frontCard.toJSON([
                'hasControls',
                'borderColor',
                'scaleX',
                'scaleY',
                'angle',
                'top',
                'left',
                'crossOrigin'
            ]))

            // console.log(state.canvasState)
        }


    }
}
export default app