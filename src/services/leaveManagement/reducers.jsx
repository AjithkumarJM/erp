import {
    leaveTypesActionType, leaveBalanceType, holidayListType, upcomingHolidayListType
} from './actionTypes';

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

const leaveTypes = (state = initialState, action) => reducer(state, action, leaveTypesActionType);

const leaveBalance = (state = initialState, action) => reducer(state, action, leaveBalanceType);

const holidayList = (state = initialState, action) => reducer(state, action, holidayListType);

const upcomingHolidayList = (state = initialState, action) => reducer(state, action, upcomingHolidayListType);

export { leaveTypes, leaveBalance, holidayList, upcomingHolidayList }