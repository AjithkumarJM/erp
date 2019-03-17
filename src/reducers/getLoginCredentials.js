import types from "../storeTypes";

let defaultState = {
    loginCredentials: {},
}

export default function (state = defaultState, action) {
    switch (action.type) {
        case types.GET_LOGIN_CREDENTIALS:
            // state = action.payload.data.data; 
            // concat to produce new instance of state (Mutating)
            // return state.concat([action.payload.data.data]); --- or 
            return { ...state, loginCredentials: action.payload }
        default:
            return state;
    }
}