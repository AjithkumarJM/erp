import { assetListType, assetTypesActionType } from './actionTypes';

const initialState = {
    response: {},
    requesting: false
}

const reducer = (state, action, methodType) => {
    let { payload, type } = action;

    switch (type) {
        case methodType.REQ:
            return { ...state, requesting: true }
        case methodType.RES:
            return { ...state, response: payload.data, requesting: false }
        case methodType.FAIL:
            return { ...state, response: payload.data, requesting: true }
        default:
            return state;
    }
}

const assetsList = (state = initialState, action) => reducer(state, action, assetListType);

const assetTypes = (state = initialState, action) => reducer(state, action, assetTypesActionType);

export { assetsList, assetTypes }