import API_CALL from "../index";
import {
    leaveTypesActionType, leaveBalanceType, holidayListType, allLeaveHistoryType,
    upcomingHolidayListType, leaveHistoryType, reporteesLeaveListType, pendingLeaveHistoryType
} from './actionTypes';

const getLeaveTypes = () => API_CALL('get', 'typesofleaves/list', null, leaveTypesActionType);

const getHolidayList = () => API_CALL('get', 'holiday/list', null, holidayListType);

const getUpcomingHolidayList = () => API_CALL('get', 'sorted/holiday/list', null, upcomingHolidayListType);

const getLeaveHistory = id => API_CALL('get', `leavehistory/id/${id}`, null, leaveHistoryType);

const getLeaveBalance = id => API_CALL('get', `balanceleave/${id}`, null, leaveBalanceType);

const postApplyLeave = (values, callback) => API_CALL('post', 'applyleave', values, null, callback);

const postCancelLeave = (values, callback) => API_CALL('post', 'leave/status/update/', values, null, callback);

const getReporteesLeaveListById = id => API_CALL('get', `leave/fullhistoryby/${id}`, null, reporteesLeaveListType);

const getAllLeaveHistory = () => API_CALL('get', 'entire/leave/history', null, allLeaveHistoryType);

const getPendingLeaveHistoryById = id => API_CALL('get', `leave/pending/${id}`, null, pendingLeaveHistoryType)

const postLeaveBulkUpload = ({ file }) => {
    let values = new FormData();
    values.append('file', file[0]);

    return API_CALL('post', 'asset/bulkupload', values, null, callback)
}

export {
    getLeaveTypes, postCancelLeave, getLeaveBalance, getAllLeaveHistory, getPendingLeaveHistoryById, postLeaveBulkUpload,
    getHolidayList, postApplyLeave, getUpcomingHolidayList, getLeaveHistory, getReporteesLeaveListById
}