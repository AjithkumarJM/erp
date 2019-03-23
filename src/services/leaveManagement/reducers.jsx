import {
    leaveTypesActionType, leaveBalanceType, holidayListType, pendingLeaveHistoryType,
    upcomingHolidayListType, reporteesLeaveListType, leaveHistoryType, allLeaveHistoryType
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

const leaveHistory = (state = initialState, action) => reducer(state, action, leaveHistoryType);

const reporteesLeaveHistory = (state = initialState, action) => reducer(state, action, reporteesLeaveListType);

const allLeaveHistory = (state = initialState, action) => reducer(state, action, allLeaveHistoryType);

const pendingLeaveHistory = (state = initialState, action) => reducer(state, action, pendingLeaveHistoryType);

export {
    leaveTypes, leaveBalance, holidayList, upcomingHolidayList, pendingLeaveHistory,
    leaveHistory, reporteesLeaveHistory, allLeaveHistory
}