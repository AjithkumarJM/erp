import { clientListType, activeClientType, clientByIdType, allClientType } from './actionTypes';

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

const clientTypeList = (state = initialState, action) => reducer(state, action, clientListType);

const activeClients = (state = initialState, action) => reducer(state, action, activeClientType);

const clientById = (state = initialState, action) => reducer(state, action, clientByIdType);

const allClients = (state = initialState, action) => reducer(state, action, allClientType);

export { clientTypeList, activeClients, clientById, allClients }