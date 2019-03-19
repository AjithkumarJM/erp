import * as types from "./actionTypes";
import cookie from "react-cookies";

const initState = {
    response: {},
    requesting: false
}

export default function (state = initState, action) {

    switch (action.type) {
        case types.REQ:
            return {
                ...state,
                requesting: true
            }
        case types.RES:

            return {
                ...state,
                data: action.payload.data,
                requesting: false
            }
        case types.FAIL:
            return {
                ...state,
                error: action.payload.data,
                requesting: false
            }
        default:
            return state;
    }
}