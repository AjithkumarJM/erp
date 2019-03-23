import { commonEmployeesType } from './actionTypes';

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

const commonEmployeesInfo = (state = initialState, action) => reducer(state, action, commonEmployeesType);

export { commonEmployeesInfo }