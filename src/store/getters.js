const getters = {
    // cvsState: state => state.app.cvsState,
    proDetailVal: state => state.app.proDetailVal,
    // drag
    cardType: state => state.app.cardType,
    card: state => state.app.cardType === 1 ? state.app.frontCard : state.app.behindCard,
    selectedObj: state => state.app.selectedObj,
    previewImg: state => state.app.previewImg,
    canvasState: state => state.app.canvasState,
    undoList: state => state.app.undoList,
    redoList: state => state.app.redoList,

}
export default getters;