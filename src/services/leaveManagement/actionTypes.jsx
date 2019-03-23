const leaveTypesActionType = {
    REQ: 'LEAVE_TYPES_REQ',
    RES: 'LEAVE_TYPES_RES',
    FAIL: 'LEAVE_TYPES_FAIL'
}

const leaveBalanceType = {
    REQ: 'LEAVE_BALANCE_REQ',
    RES: 'LEAVE_BALANCE_RES',
    FAIL: 'LEAVE_BALANCE_FAIL'
}

const holidayListType = {
    REQ: 'HOLIDAY_LIST_REQ',
    RES: 'HOLIDAY_LIST_RES',
    FAIL: 'HOLIDAY_LIST_FAIL'
}

const upcomingHolidayListType = {
    REQ: 'UPCOMING_HOLIDAY_LIST_REQ',
    RES: 'UPCOMING_HOLIDAY_LIST_RES',
    FAIL: 'UPCOMING_HOLIDAY_LIST_FAIL'
}

const leaveHistoryType = {
    REQ: 'LEAVE_HISTORY_TYPE_REQ',
    RES: 'LEAVE_HISTORY_TYPE_RES',
    FAIL: 'LEAVE_HISTORY_TYPE_FAIL'
}

const reporteesLeaveListType = {
    REQ: 'REPORTEES_LEAVE_HISTORY_REQ',
    RES: 'REPORTEES_LEAVE_HISTORY_RES',
    FAIL: 'REPORTEES_LEAVE_HISTORY_FAIL'
}

const allLeaveHistoryType = {
    REQ: 'ALL_LEAVE_HISTORY_REQ',
    RES: 'ALL_LEAVE_HISTORY_RES',
    FAIL: 'ALL_LEAVE_HISTORY_FAIL'
}

const pendingLeaveHistoryType = {
    REQ: 'PENDING_LEAVE_HISTORY_REQ',
    RES: 'PENDING_LEAVE_HISTORY_RES',
    FAIL: 'PENDING_LEAVE_HISTORY_FAIL'
}

export {
    leaveTypesActionType, leaveBalanceType, holidayListType, allLeaveHistoryType,
    upcomingHolidayListType, leaveHistoryType, reporteesLeaveListType, pendingLeaveHistoryType
}