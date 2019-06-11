const app = {
    state: {
        cvsState: 0,
        cvsW: 780,
        cvsH: 780,
        proDetailVal: {},
        isShowSpin: false,
        isLocking: true,
        // drag
        cardType: 1,
        frontCard: null,
        behindCard: null,
        undoList: [],
        redoList: [],
        selectedObj: null,
        previewImg: null,
        objJSON: null
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
        SET_LOCK: (state, isLocking) => {
            state.isLocking = isLocking
        },
        SET_PRODETAIL: (state, proDetailVal) => {
            state.proDetailVal = proDetailVal
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
        POP_UNDO: (state) => {
            state.undoList.pop()
        },
        ADD_REDO: (state, canvasState) => {
            state.redoList.push(canvasState)
        },
        POP_REDO: (state) => {
            state.redoList.pop()
        },
        SET_PREVIEW_IMG: (state, img) => {
            state.previewImg = img
        },
        addRedo({ commit }, canvasState) {
            commit('ADD_REDO', canvasState)
        },
        // drag  -e

    },
    actions: {
        updataProDetailVal({ commit }, obj) {
            commit('SET_PRODETAIL', obj)
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
        setIsLocking({ commit }, isLocking) {
            commit('SET_LOCK', isLocking)
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
            state.objJSON = state.frontCard.toJSON([
                    'hasControls',
                    'borderColor',
                    'imgType',
                    'goods_id',
                    'goodsImg_id',
                    'material_id',

                ]),
                // console.log(state.frontCard.toJSON([
                //     'hasControls',
                //     'borderColor',
                //     'imgType',
                //     'goods_id',
                //     'goodsImg_id',
                //     'material_id',

                // ]))
                commit('SET_CANVASSTATE', state.frontCard.toJSON([
                    'hasControls',
                    'borderColor',
                    'scaleX',
                    'scaleY',
                    'angle',
                    'top',
                    'left',
                    'crossOrigin',
                    'imgType',
                    'goods_id',
                    'goodsImg_id',
                    'material_id',
                ]))

            // console.log(state.canvasState)
        },
        addUndo({ commit }, canvasState) {
            commit('ADD_UNDO', canvasState)
        },
        popUndo({ commit }) {
            commit('POP_UNDO')
        },
        addRedo({ commit }, canvasState) {
            commit('ADD_REDO', canvasState)
        },
        popRedo({ commit }) {
            commit('POP_REDO')
        },
        setRedo({ commit }, list) {
            commit('SET_REDOLIST', list)
        },
        // 撤销
        undo({ commit, state }) {
            commit('ADD_REDO', state.canvasState)
            const lastState = {...state.undoList[state.undoList.length - 1] }
            commit('SET_CANVASSTATE', lastState)
                // this.popUndo()
            commit('POP_UNDO')
            state.frontCard.loadFromJSON(lastState, () => {
                state.frontCard.renderAll()
            })
        },
        // 恢复
        redo({ commit, state }) {
            commit('ADD_UNDO', state.canvasState)
            const lastState = {...state.redoList[state.redoList.length - 1] }
            commit('SET_CANVASSTATE', lastState)
            commit('POP_REDO')
            console.log('lastState', lastState)
            state.frontCard.loadFromJSON(lastState, () => {
                state.frontCard.renderAll()
            })
        },
        // 预览图片
        setPreviewImg({ commit }, img) {
            commit('SET_PREVIEW_IMG', img)
        },


    }
}
export default app